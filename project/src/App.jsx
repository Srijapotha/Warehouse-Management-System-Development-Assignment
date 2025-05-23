import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SkuMapper from './pages/SkuMapper'
import DataUpload from './pages/DataUpload'
import DatabaseManager from './pages/DatabaseManager'
import AIAnalytics from './pages/AIAnalytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="sku-mapper" element={<SkuMapper />} />
        <Route path="data-upload" element={<DataUpload />} />
        <Route path="database" element={<DatabaseManager />} />
        <Route path="ai-analytics" element={<AIAnalytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App