import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * FileProcessor class
 * Handles various file formats and extracts SKU data
 */
class FileProcessor {
  /**
   * Process a file and extract SKU data
   * @param {File} file - The file to process
   * @returns {Promise<Object>} - Processing results
   */
  async processFile(file) {
    try {
      const fileType = this.detectFileType(file);
      let data;
      
      switch (fileType) {
        case 'csv':
          data = await this.processCSV(file);
          break;
        case 'excel':
          data = await this.processExcel(file);
          break;
        case 'json':
          data = await this.processJSON(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }
      
      // Extract SKU data from the processed file
      const skuData = this.extractSkuData(data, fileType);
      
      return {
        success: true,
        fileName: file.name,
        fileType,
        rowCount: data.length,
        skuData,
      };
    } catch (error) {
      return {
        success: false,
        fileName: file.name,
        error: error.message
      };
    }
  }
  
  /**
   * Detect the type of file based on extension and mime type
   */
  detectFileType(file) {
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    if (fileName.endsWith('.csv') || mimeType === 'text/csv') {
      return 'csv';
    } else if (
      fileName.endsWith('.xlsx') || 
      fileName.endsWith('.xls') || 
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel')
    ) {
      return 'excel';
    } else if (
      fileName.endsWith('.json') || 
      mimeType === 'application/json'
    ) {
      return 'json';
    } else {
      return 'unknown';
    }
  }
  
  /**
   * Process CSV file
   */
  async processCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          } else {
            resolve(results.data);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  }
  
  /**
   * Process Excel file
   */
  async processExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convert to objects with headers
          if (jsonData.length > 1) {
            const headers = jsonData[0];
            const rows = jsonData.slice(1).map(row => {
              const obj = {};
              headers.forEach((header, i) => {
                obj[header] = row[i];
              });
              return obj;
            });
            
            resolve(rows);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(new Error(`Excel parsing error: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading Excel file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  /**
   * Process JSON file
   */
  async processJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Handle different JSON structures
          if (Array.isArray(data)) {
            resolve(data);
          } else if (data.items && Array.isArray(data.items)) {
            resolve(data.items);
          } else if (data.data && Array.isArray(data.data)) {
            resolve(data.data);
          } else if (data.products && Array.isArray(data.products)) {
            resolve(data.products);
          } else if (data.orders && Array.isArray(data.orders)) {
            resolve(data.orders);
          } else {
            // If it's an object, convert to array with single item
            resolve([data]);
          }
        } catch (error) {
          reject(new Error(`JSON parsing error: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading JSON file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Extract SKU data from processed file data
   */
  extractSkuData(data, fileType) {
    if (!data || data.length === 0) {
      return [];
    }
    
    // Try to identify SKU and marketplace fields
    const firstRow = data[0];
    const possibleSkuFields = ['sku', 'sku_id', 'product_id', 'item_id', 'product_code'];
    const possibleMarketplaceFields = ['marketplace', 'channel', 'store', 'platform', 'source'];
    
    // Find SKU field
    let skuField = this.findMatchingField(firstRow, possibleSkuFields);
    
    // Find marketplace field
    let marketplaceField = this.findMatchingField(firstRow, possibleMarketplaceFields);
    
    // Default marketplace if not found
    const defaultMarketplace = this.guessMarketplaceFromFileType(fileType);
    
    // Extract SKU data
    return data.map(row => {
      let sku = skuField ? row[skuField] : null;
      
      // If no SKU field found, try to extract it from a product name or similar field
      if (!sku) {
        sku = this.extractSkuFromProductInfo(row);
      }
      
      // Skip rows without SKU
      if (!sku) {
        return null;
      }
      
      return {
        sku: String(sku),
        marketplace: marketplaceField && row[marketplaceField] 
          ? String(row[marketplaceField]) 
          : defaultMarketplace,
        originalData: row
      };
    }).filter(Boolean); // Remove null entries
  }
  
  /**
   * Find a matching field in the data based on possible names
   */
  findMatchingField(row, possibleFields) {
    const rowKeys = Object.keys(row).map(key => key.toLowerCase());
    
    // Try exact match first
    for (const field of possibleFields) {
      if (rowKeys.includes(field.toLowerCase())) {
        return Object.keys(row).find(key => key.toLowerCase() === field.toLowerCase());
      }
    }
    
    // Try partial match
    for (const field of possibleFields) {
      const matchingKey = Object.keys(row).find(key => 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      if (matchingKey) {
        return matchingKey;
      }
    }
    
    return null;
  }
  
  /**
   * Try to extract SKU from product information when SKU field is not found
   */
  extractSkuFromProductInfo(row) {
    // Check for product name, title, description fields
    const possibleProductFields = ['product', 'name', 'title', 'product_name', 'item_name', 'description'];
    
    for (const field of possibleProductFields) {
      const key = Object.keys(row).find(k => k.toLowerCase().includes(field.toLowerCase()));
      
      if (key && row[key]) {
        // Try to extract SKU-like pattern (alphanumeric with possible hyphens)
        const value = String(row[key]);
        const skuMatch = value.match(/[A-Z0-9]+-[A-Z0-9]+/i);
        
        if (skuMatch) {
          return skuMatch[0];
        }
      }
    }
    
    // If all else fails, look for any field that might be a SKU
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase().includes('id') && typeof value === 'string' && value.length > 3) {
        return value;
      }
    }
    
    return null;
  }
  
  /**
   * Guess marketplace from file type or name
   */
  guessMarketplaceFromFileType(fileType) {
    // This would be more sophisticated in a real implementation
    return 'Unknown';
  }
}

export default FileProcessor;