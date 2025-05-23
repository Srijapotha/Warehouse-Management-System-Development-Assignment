import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function loadWMSData(sheetId) {
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: import.meta.env.VITE_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map(row => ({
      sku: row.SKU,
      msku: row.MSKU,
      marketplace: row.Marketplace,
      productName: row['Product Name'],
      category: row.Category,
      price: parseFloat(row.Price),
      stock: parseInt(row.Stock),
    }));
  } catch (error) {
    console.error('Error loading WMS data:', error);
    throw new Error('Failed to load WMS data from Google Sheets');
  }
}