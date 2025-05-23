import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const port = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample SKU to MSKU mappings
const skuMappings = [
  { id: '1', sku: 'GOLDEN-APPLE', msku: 'APPLE-001', marketplace: 'Amazon' },
  { id: '2', sku: 'GLD', msku: 'APPLE-001', marketplace: 'Shopify' },
  { id: '3', sku: 'REDAPPLE', msku: 'APPLE-002', marketplace: 'Amazon' },
  { id: '4', sku: 'RED-A', msku: 'APPLE-002', marketplace: 'Shopify' },
  { id: '5', sku: 'WIDGET-BLUE', msku: 'WIDGET-001', marketplace: 'Amazon' },
  { id: '6', sku: 'BLUE-W', msku: 'WIDGET-001', marketplace: 'Shopify' },
  { id: '7', sku: 'WIDGET-RED', msku: 'WIDGET-002', marketplace: 'Amazon' },
  { id: '8', sku: 'RED-W', msku: 'WIDGET-002', marketplace: 'Shopify' },
  { id: '9', sku: 'GADGET-SMALL', msku: 'GADGET-001', marketplace: 'Amazon' },
  { id: '10', sku: 'SMALL-G', msku: 'GADGET-001', marketplace: 'Shopify' },
  { id: '11', sku: 'GADGET-LARGE', msku: 'GADGET-002', marketplace: 'Amazon' },
  { id: '12', sku: 'LARGE-G', msku: 'GADGET-002', marketplace: 'Shopify' },
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all SKU mappings
app.get('/api/sku-mappings', (req, res) => {
  res.json({ success: true, data: skuMappings });
});

// Get a single SKU mapping
app.get('/api/sku-mappings/:id', (req, res) => {
  const mapping = skuMappings.find(m => m.id === req.params.id);
  if (!mapping) {
    return res.status(404).json({ success: false, message: 'Mapping not found' });
  }
  res.json({ success: true, data: mapping });
});

// Create a new SKU mapping
app.post('/api/sku-mappings', (req, res) => {
  const { sku, msku, marketplace } = req.body;
  
  if (!sku || !msku || !marketplace) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Check if mapping already exists
  const exists = skuMappings.some(m => m.sku === sku && m.marketplace === marketplace);
  if (exists) {
    return res.status(409).json({ success: false, message: 'Mapping already exists' });
  }
  
  const newMapping = {
    id: Date.now().toString(),
    sku,
    msku,
    marketplace
  };
  
  skuMappings.push(newMapping);
  res.status(201).json({ success: true, data: newMapping });
});

// Update a SKU mapping
app.put('/api/sku-mappings/:id', (req, res) => {
  const { sku, msku, marketplace } = req.body;
  const id = req.params.id;
  
  if (!sku || !msku || !marketplace) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  const mappingIndex = skuMappings.findIndex(m => m.id === id);
  if (mappingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Mapping not found' });
  }
  
  // Check if update would create a duplicate
  const duplicateCheck = skuMappings.some(
    m => m.id !== id && m.sku === sku && m.marketplace === marketplace
  );
  if (duplicateCheck) {
    return res.status(409).json({ success: false, message: 'Update would create duplicate mapping' });
  }
  
  skuMappings[mappingIndex] = { ...skuMappings[mappingIndex], sku, msku, marketplace };
  res.json({ success: true, data: skuMappings[mappingIndex] });
});

// Delete a SKU mapping
app.delete('/api/sku-mappings/:id', (req, res) => {
  const mappingIndex = skuMappings.findIndex(m => m.id === req.params.id);
  if (mappingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Mapping not found' });
  }
  
  skuMappings.splice(mappingIndex, 1);
  res.json({ success: true, message: 'Mapping deleted successfully' });
});

// File upload endpoint
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const fileDetails = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path
    }));
    
    res.json({ success: true, message: 'Files uploaded successfully', files: fileDetails });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ success: false, message: 'File upload failed', error: error.message });
  }
});

// Process files endpoint (simulated)
app.post('/api/process-files', (req, res) => {
  const { fileIds } = req.body;
  
  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).json({ success: false, message: 'No file IDs provided' });
  }
  
  // Simulate processing time
  setTimeout(() => {
    const results = fileIds.map(fileId => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      return {
        fileId,
        success,
        message: success ? 'File processed successfully' : 'Error processing file',
        processedSkus: success ? Math.floor(Math.random() * 100) + 5 : 0,
        timestamp: new Date().toISOString()
      };
    });
    
    res.json({ success: true, results });
  }, 2000);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});