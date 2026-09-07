import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIActivityDrawer from './components/AIActivityDrawer';
import ShopPage from './pages/ShopPage';
import MerchantNetworkPage from './pages/MerchantNetworkPage';
import MerchantAnalyticsPage from './pages/MerchantAnalyticsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import MerchantPage from './pages/MerchantPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductBenefitsPage from './pages/ProductBenefitsPage';

export default function App() {
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [logs, setLogs] = useState([
    {
      stage: 'System Boot',
      message: 'NEXA Agentic Commerce Engine initialized & ready.',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [activeMemory, setActiveMemory] = useState({});

  const handleAddLog = (logEntry) => {
    setLogs(prev => [logEntry, ...prev.slice(0, 49)]); // Keep last 50 logs
    if (logEntry.stage === 'Memory Initialization' || logEntry.stage === 'Memory Update' || logEntry.stage === 'Dynamic Recalibration') {
      if (logEntry.detail) {
        setActiveMemory(logEntry.detail);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
        <Navbar
          onToggleTrace={() => setIsTraceOpen(!isTraceOpen)}
          isTraceOpen={isTraceOpen}
        />

        <main className="flex-1">
          <Routes>
            {/* Page 1: Shop with NEXA */}
            <Route path="/" element={<ShopPage onAddLog={handleAddLog} />} />

            {/* Page 2: Connected Merchant Agent Network */}
            <Route path="/merchants" element={<MerchantNetworkPage />} />

            {/* Page 3: Merchant Analytics & Lost Intent Engine */}
            <Route path="/merchant-analytics" element={<MerchantAnalyticsPage />} />

            {/* Page 4: A2A Commerce Audit Trail */}
            <Route path="/audit" element={<AuditTrailPage />} />

            {/* Additional support routes */}
            <Route path="/merchant" element={<MerchantPage />} />
            <Route path="/catalog" element={<CatalogPage />} />

            {/* Product Details & Benefits Pages */}
            <Route path="/product-details" element={<ProductDetailsPage />} />
            <Route path="/product-benefits" element={<ProductBenefitsPage />} />
          </Routes>
        </main>

        {/* Live AI Reasoning Activity Drawer */}
        <AIActivityDrawer
          isOpen={isTraceOpen}
          onClose={() => setIsTraceOpen(false)}
          logs={logs}
          activeRequirements={activeMemory}
        />

        {/* Global Minimal Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">NEXA</span>
              <span>â€”</span>
              <span className="italic font-serif">â€œAnswer a few questions. Find what truly fits you.â€</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px]">
                Razorpay Buildathon: Track 01
              </span>
              <span>AI Growth & Agentic Commerce</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
