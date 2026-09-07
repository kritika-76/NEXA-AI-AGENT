import React from 'react';
import { X, ShieldCheck, CheckCircle2, Zap, Award, Truck, RotateCcw, Clock, Lock, ArrowRight, Percent, Database, Cpu } from 'lucide-react';

export default function CommercePassportModal({ merchant, onClose }) {
  if (!merchant) return null;

  const { passport, negotiationLimits } = merchant;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header Passport Top Banner */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-32 h-32 text-white" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  {passport?.verificationStatus || 'Tier-1 Verified'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {passport?.merchantId || 'did:nexa:merch:0x89f2a'}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1">
                {merchant.name}
              </h2>
              <p className="text-xs text-sky-200 font-medium">
                {merchant.tagline || 'Premium Official Enterprise & Developer Gear'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Verified Orders</span>
              <span className="font-extrabold text-white text-base">
                {merchant.verifiedOrders ? merchant.verifiedOrders.toLocaleString('en-IN') : '3,840'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Agent Rating</span>
              <span className="font-extrabold text-amber-300 text-base">
                ★ {merchant.rating} / 5.0
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">A2A Response SLA</span>
              <span className="font-extrabold text-emerald-400 text-base">
                {merchant.responseTime || '< 300ms'}
              </span>
            </div>
          </div>
        </div>

        {/* Passport Body Sections */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Section 1: Fulfillment & Delivery SLA */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              <span>Fulfilment & Delivery SLA</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
              <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Standard Dispatch SLA</span>
                <span className="font-bold">{merchant.deliverySla || 'Standard: 1–3 Business Days'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Express Air Dispatch</span>
                <span className="font-bold text-emerald-700">Available Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Section 2: Return & Warranty Policy */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Return & Warranty Boundaries</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
              <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Buyer Protection Policy</span>
                <span className="font-bold">{merchant.returnPolicy || '14-Day Free Returns'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                <span className="text-slate-400 text-[10px] block">Manufacturer Warranty</span>
                <span className="font-bold">{merchant.warranty || '12-Month Official Manufacturer Warranty'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Negotiation & Margin Boundaries */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/90 space-y-2">
            <h4 className="font-bold text-purple-950 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-purple-700" />
              <span>A2A Negotiation & Margin Boundaries</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                <span className="text-slate-400 text-[10px] block">Maximum Concession</span>
                <span className="font-extrabold text-purple-900 text-sm">
                  Up to {negotiationLimits?.maxConcessionPercent || 8}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                <span className="text-slate-400 text-[10px] block">Minimum Margin Floor</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {negotiationLimits?.minMarginPercent || 12}% Protected
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Standardized Capabilities */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Standardized A2A Capabilities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(passport?.capabilities || [
                'Premium Developer Gear',
                'Brand Authorized Direct Reseller',
                'Priority 24/7 Enterprise Support',
                'AI Negotiation Enabled (A2A Protocol v2.1)',
                'Razorpay Direct Test & Live Ready'
              ]).map((cap, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Inventory & Fulfillment Telemetry */}
          {passport?.inventoryTelemetry && (
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Active SKUs</span>
                <span className="font-bold text-white">{passport.inventoryTelemetry.activeSkuCount} SKUs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">In-Stock Rate</span>
                <span className="font-bold text-emerald-400">{passport.inventoryTelemetry.liveInStockRate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Avg Dispatch</span>
                <span className="font-bold text-sky-400">{passport.inventoryTelemetry.averageDispatchTimeHours}h</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
}
