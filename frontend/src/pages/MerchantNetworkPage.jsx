import React, { useState, useEffect } from 'react';
import { merchantService } from '../services/api';
import CommercePassportModal from '../components/CommercePassportModal';
import { Network, ShieldCheck, Zap, Star, Clock, Truck, RotateCcw, Award, ArrowRight, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export default function MerchantNetworkPage() {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    merchantService.getMerchants()
      .then(res => {
        setMerchants(res.merchants || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load merchants:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2">
              <Network className="w-3.5 h-3.5 text-sky-600" />
              <span>A2A Protocol v2.1 Connected Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Connected Merchant Agent Network
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Standardized AI Commerce Passports allowing autonomous Buyer Agents to discover, evaluate, negotiate, and transact securely with verified merchant nodes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>5 Active Merchant Agents Online</span>
          </div>
        </div>

        {/* 5 Connected Merchant Cards Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              onClick={() => setSelectedMerchant(merchant)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-sky-400 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group p-6 relative"
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 group-hover:bg-sky-50 group-hover:text-sky-800 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider transition-colors">
                    {merchant.merchantType}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{merchant.rating}</span>
                  </div>
                </div>

                {/* Merchant Name & Tagline */}
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                  {merchant.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {merchant.tagline}
                </p>

                {/* Structured Metrics Grid */}
                <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 text-xs">
                  {/* Response Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Response SLA
                    </span>
                    <span className="font-bold text-emerald-700">{merchant.responseTime}</span>
                  </div>

                  {/* Delivery SLA */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" /> Delivery SLA
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">{merchant.deliverySla}</span>
                  </div>

                  {/* Return Policy */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Return Policy
                    </span>
                    <span className="font-semibold text-slate-800">{merchant.returnPolicy}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {merchant.verifiedOrders.toLocaleString('en-IN')} Orders
                </span>
                <span className="text-xs font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>AI Passport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Value Proposition Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-sky-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Standardized AI Commerce Passport Architecture</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Making Merchants Discoverable, Negotiable & Transactable by AI
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional e-commerce is built for human visual browsing. NEXA's standardized schema exposes inventory telemetry, concession thresholds, delivery SLAs, and margin safeguards directly to Buyer Agents.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setSelectedMerchant(merchants[0])}
              className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Inspect Sample Passport (TechNova)</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Commerce Passport Modal */}
      {selectedMerchant && (
        <CommercePassportModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </div>
  );
}
