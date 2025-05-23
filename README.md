# Warehouse Management System

A modern, full-featured warehouse management system built with React and Supabase, featuring SKU mapping, data analytics, and multi-marketplace integration.

## Features

- **SKU Mapping**: Efficiently map SKUs across different marketplaces to master SKUs (MSKUs)
- **Data Upload**: Support for CSV, Excel, and JSON file uploads for bulk data processing
- **Analytics Dashboard**: Real-time insights with interactive charts and metrics
- **AI-Powered Analytics**: Natural language querying for data insights
- **Multi-Marketplace Support**: Unified management across different e-commerce platforms
- **Baserow Integration**: Flexible database management with visual interface

## Tech Stack

- **Frontend**: React, TailwindCSS, Chart.js
- **State Management**: React Context
- **Data Visualization**: react-chartjs-2
- **File Processing**: Papa Parse, XLSX
- **UI Components**: Headless UI, Heroicons
- **Database**: Baserow
- **Notifications**: React Toastify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Sheets API credentials (for WMS data)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd warehouse-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY=your-private-key
VITE_GOOGLE_SHEET_ID=your-sheet-id
```

4. Start the development server:
```bash
npm run dev
```

5. Start the backend server:
```bash
npm run server
```

## Project Structure

```
warehouse-management-system/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── server/
│   └── index.js          # Express server for file processing
└── public/               # Static assets
```

## Key Components

### SKU Mapper
- Manages SKU to MSKU mappings
- Supports pattern recognition for automatic mapping
- Handles multiple marketplace formats

### Data Upload
- Supports multiple file formats (CSV, Excel, JSON)
- Validates and processes data in bulk
- Provides detailed processing reports

### Analytics Dashboard
- Real-time metrics visualization
- Interactive charts and graphs
- Customizable date ranges and filters

### AI Analytics
- Natural language query processing
- Automated data analysis
- Dynamic visualization generation

## API Endpoints

### SKU Mappings
- `GET /api/sku-mappings` - Get all SKU mappings
- `POST /api/sku-mappings` - Create new mapping
- `PUT /api/sku-mappings/:id` - Update mapping
- `DELETE /api/sku-mappings/:id` - Delete mapping

### File Processing
- `POST /api/upload` - Upload files
- `POST /api/process-files` - Process uploaded files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


