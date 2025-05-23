import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export class SalesDataProcessor {
  constructor(skuMapper) {
    this.skuMapper = skuMapper;
  }

  async processSalesFile(file) {
    try {
      const fileType = this.getFileType(file);
      let data;

      switch (fileType) {
        case 'csv':
          data = await this.processCSV(file);
          break;
        case 'excel':
          data = await this.processExcel(file);
          break;
        default:
          throw new Error('Unsupported file type');
      }

      return this.processSalesData(data);
    } catch (error) {
      console.error('Error processing sales file:', error);
      throw error;
    }
  }

  getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'csv') return 'csv';
    if (['xlsx', 'xls'].includes(extension)) return 'excel';
    return 'unknown';
  }

  processCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  }

  async processExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  processSalesData(data) {
    const processedData = data.map(row => {
      const sku = this.extractSKU(row);
      const marketplace = this.extractMarketplace(row);
      const mapping = this.skuMapper.getMsku(sku, marketplace);

      return {
        originalSKU: sku,
        msku: mapping.success ? mapping.msku : null,
        marketplace,
        orderDate: this.extractDate(row),
        quantity: this.extractQuantity(row),
        price: this.extractPrice(row),
        orderNumber: this.extractOrderNumber(row),
        mappingConfidence: mapping.confidence || 0,
        hasError: !mapping.success,
        errorMessage: mapping.success ? null : mapping.message,
      };
    });

    return {
      success: true,
      data: processedData,
      summary: this.generateSummary(processedData),
    };
  }

  extractSKU(row) {
    const possibleFields = ['sku', 'SKU', 'product_sku', 'item_sku', 'ProductSKU'];
    for (const field of possibleFields) {
      if (row[field]) return row[field];
    }
    throw new Error('SKU field not found in data');
  }

  extractMarketplace(row) {
    const possibleFields = ['marketplace', 'Marketplace', 'channel', 'Channel', 'platform', 'Platform'];
    for (const field of possibleFields) {
      if (row[field]) return row[field];
    }
    return 'Unknown';
  }

  extractDate(row) {
    const possibleFields = ['date', 'Date', 'order_date', 'OrderDate', 'purchase_date'];
    for (const field of possibleFields) {
      if (row[field]) return new Date(row[field]);
    }
    return new Date();
  }

  extractQuantity(row) {
    const possibleFields = ['quantity', 'Quantity', 'qty', 'QTY', 'units'];
    for (const field of possibleFields) {
      if (row[field]) return parseInt(row[field]) || 0;
    }
    return 1;
  }

  extractPrice(row) {
    const possibleFields = ['price', 'Price', 'unit_price', 'UnitPrice', 'amount'];
    for (const field of possibleFields) {
      if (row[field]) return parseFloat(row[field]) || 0;
    }
    return 0;
  }

  extractOrderNumber(row) {
    const possibleFields = ['order_number', 'OrderNumber', 'order_id', 'OrderID'];
    for (const field of possibleFields) {
      if (row[field]) return row[field];
    }
    return 'Unknown';
  }

  generateSummary(data) {
    const summary = {
      totalOrders: data.length,
      totalQuantity: 0,
      totalRevenue: 0,
      mappedSkus: 0,
      unmappedSkus: 0,
      marketplaces: new Set(),
      dateRange: {
        start: null,
        end: null,
      },
    };

    data.forEach(row => {
      summary.totalQuantity += row.quantity;
      summary.totalRevenue += row.quantity * row.price;
      row.msku ? summary.mappedSkus++ : summary.unmappedSkus++;
      summary.marketplaces.add(row.marketplace);

      const date = new Date(row.orderDate);
      if (!summary.dateRange.start || date < summary.dateRange.start) {
        summary.dateRange.start = date;
      }
      if (!summary.dateRange.end || date > summary.dateRange.end) {
        summary.dateRange.end = date;
      }
    });

    summary.marketplaces = Array.from(summary.marketplaces);
    return summary;
  }
}