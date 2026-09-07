import React, { useState, useEffect } from 'react';
import { productService, aiService } from '../services/api';
import { Database, Search, Sparkles, ShieldCheck, Tag, CheckCircle2, Zap, Play, ArrowRight, Layers, X, Package, RotateCcw, Clock, Percent, Award } from 'lucide-react';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Playground state
  const [testQuery, setTestQuery] = useState('I need a laptop for machine learning and gaming under ₹75,000');
  const [playgroundResults, setPlaygroundResults] = useState(null);
  const [testingAi, setTestingAi] = useState(false);

  useEffect(() => {
    productService.getProducts()
      .then(res => {
        setProducts(res.products || []);
        setFilteredProducts(res.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.merchant.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.bestFor && p.bestFor.some(b => b.toLowerCase().includes(q))) ||
        (p.agenticMetadata?.semanticKeywords && p.agenticMetadata.semanticKeywords.some(k => k.toLowerCase().includes(q)))
      );
    }
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const handleTestAiQuery = async () => {
    if (!testQuery.trim()) return;
    setTestingAi(true);

    try {
      const intentRes = await aiService.parseIntent(testQuery);
      const matchRes = await aiService.matchProducts(intentRes.intent);
      setPlaygroundResults({
        parsedIntent: intentRes.intent,
        matches: matchRes.recommendations || []
      });
    } catch (err) {
      console.error('Playground test error:', err);
    } finally {
      setTestingAi(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2">
              <Database className="w-3.5 h-3.5 text-sky-600" />
              <span>Catalog Index & Agentic Schema</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI-Ready Merchant Catalog
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Traditional product catalogs are designed for humans to browse. NEXA structures product information so AI shopping agents can understand what a product is suitable for.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Agent-Readable Schema</span>
            </span>
          </div>
        </div>

        {/* 1. Agent Matching Playground */}
        <div className="mb-8 p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Agent Query Playground
              </h3>
              <p className="text-xs text-slate-400">
                Simulate how NEXA evaluates natural language customer queries against this AI-ready catalog
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. I need a laptop for machine learning and gaming under ₹75,000"
              className="flex-1 bg-slate-800/90 text-slate-100 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-hidden focus:border-sky-500"
            />
            <button
              onClick={handleTestAiQuery}
              disabled={testingAi}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {testingAi ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>Test AI Query</span>
            </button>
          </div>

          {playgroundResults && (
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-3 animate-fade-in text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                <span className="text-sky-400 font-bold block mb-1">Parsed Intent Constraints:</span>
                <span>Category: {playgroundResults.parsedIntent?.category} | Budget: ₹{playgroundResults.parsedIntent?.budget?.toLocaleString('en-IN')} | Primary Use: {playgroundResults.parsedIntent?.primaryUse || 'general'} | Priority: {playgroundResults.parsedIntent?.priority || 'auto'}</span>
              </div>

              <div>
                <span className="text-emerald-400 font-bold block mb-2 font-sans">
                  Top Recommended Matches ({playgroundResults.matches.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                  {playgroundResults.matches.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
                      <img src={m.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs truncate">{m.name}</span>
                          <span className="text-[10px] font-bold text-emerald-400">{m.matchScore}%</span>
                        </div>
                        <span className="text-[11px] text-slate-300">₹{m.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Catalog Filtering Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'laptop', 'headphones', 'smartphone', 'accessory'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70'
                }`}
              >
                {cat === 'all' ? 'All Catalog' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, tag or spec..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* 3. Catalog Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductDetails(product)}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-400 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.category}
                      </span>
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        AI Score: {product.agenticMetadata?.intentReadinessScore || 96}/100
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Best For Tags */}
                {product.bestFor && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Best For:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {product.bestFor.map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured Specs */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 mb-2">
                  <div className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                    Structured Specs
                  </div>
                  {product.specs?.ram && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-400">RAM:</span>
                      <span className="font-semibold">{product.specs.ram}</span>
                    </div>
                  )}
                  {product.specs?.storage && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-400">Storage:</span>
                      <span className="font-semibold">{product.specs.storage}</span>
                    </div>
                  )}
                  {product.specs?.processor && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-400">Processor:</span>
                      <span className="font-semibold truncate max-w-[170px]">{product.specs.processor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Stock & Click prompt */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-sky-600" />
                  {product.stock || 24} Available
                </span>
                <span className="text-[11px] font-bold text-sky-600 group-hover:underline">
                  View Agentic Schema →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Agentic Product Details Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedProductDetails.image}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    Agent-Ready Schema
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedProductDetails.name}
                  </h3>
                  <p className="text-sm font-extrabold text-slate-900">
                    ₹{selectedProductDetails.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Schema Details List */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Stock</span>
                  <span className="font-extrabold text-slate-900">{selectedProductDetails.stock || 24} Available</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Delivery</span>
                  <span className="font-extrabold text-emerald-700">{selectedProductDetails.deliveryRange || '2–4 Days'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Warranty</span>
                  <span className="font-bold text-slate-900">{selectedProductDetails.warranty || '12 Months'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Return Policy</span>
                  <span className="font-bold text-slate-900">{selectedProductDetails.returnPolicy || '14 Days'}</span>
                </div>
              </div>

              {/* Best For */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Best For</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProductDetails.bestFor || ['Coding', 'Development', 'College']).map((b, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg font-bold text-xs">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Specifications</span>
                <div className="space-y-1 text-slate-800 font-medium">
                  {Object.entries(selectedProductDetails.specs || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-slate-500">{key}:</span>
                      <span className="font-bold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatible Products */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Compatible Products</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProductDetails.compatibleProducts || ['Mouse', 'Laptop Stand', 'Laptop Bag']).map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg font-bold text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Offers */}
              {selectedProductDetails.offers && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-0.5">
                  <span className="text-emerald-800 font-semibold block text-[10px] uppercase">Offers</span>
                  <p className="font-bold">{selectedProductDetails.offers}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedProductDetails(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
