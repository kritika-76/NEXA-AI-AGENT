import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, ArrowRight, RefreshCw, AlertCircle, Percent, Lock, Sparkles, TrendingDown } from 'lucide-react';
import { aiService } from '../services/api';

export default function BoundedNegotiationModal({
  offer,
  requirements,
  onClose,
  onNegotiationComplete
}) {
  const [negotiationData, setNegotiationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!offer) return;
    setIsSimulating(true);
    setCurrentStep(0);

    aiService.runNegotiation(offer.id, requirements)
      .then(res => {
        setNegotiationData(res);
        // Simulate step by step timeline playback
        setTimeout(() => setCurrentStep(1), 600);
        setTimeout(() => setCurrentStep(2), 1400);
        setTimeout(() => {
          setCurrentStep(3);
          setIsSimulating(false);
        }, 2200);
      })
      .catch(err => {
        console.error('Negotiation execution error:', err);
        setIsSimulating(false);
      });
  }, [offer, requirements]);

  if (!offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Bounded A2A Negotiation
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                  Max 3 Rounds
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Buyer Agent ↔ {offer.merchant} Policy-Protected Autonomous Negotiation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Item Glance */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={offer.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Product</span>
                <h4 className="text-sm font-bold text-slate-900">{offer.productName}</h4>
                <p className="text-xs text-slate-500">{offer.merchant}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 line-through">₹{offer.originalPrice.toLocaleString('en-IN')}</span>
              <div className="text-lg font-black text-slate-900">
                ₹{(negotiationData?.authoritativeFinalTotal || offer.finalTotal).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Strict Negotiation Rules Banner */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-slate-400 text-[10px] block">Max Rounds</span>
              <span className="font-extrabold text-purple-900">3 Protocol Rounds</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-slate-400 text-[10px] block">Max Concession</span>
              <span className="font-extrabold text-purple-900">Up to 8% Cap</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-slate-400 text-[10px] block">Min Margin Floor</span>
              <span className="font-extrabold text-emerald-700">12% Protected</span>
            </div>
          </div>

          {/* Visual 3-Round Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Autonomous Multi-Round Timeline
            </h4>

            {negotiationData?.timeline.map((roundItem, idx) => {
              const isVisible = currentStep >= roundItem.round;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isVisible
                      ? 'bg-white border-slate-200/90 shadow-2xs opacity-100 translate-y-0'
                      : 'bg-slate-50 border-slate-100 opacity-40 translate-y-2'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-indigo-700 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px]">
                        {roundItem.round}
                      </span>
                      {roundItem.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {roundItem.merchantResponse.status}
                    </span>
                  </div>

                  {/* Buyer Action */}
                  <p className="text-xs text-slate-800 font-semibold mb-1">
                    {roundItem.buyerAgentAction}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Reason: {roundItem.reason}
                  </p>

                  {/* Money Action Policy Check Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-800">
                      <span className="text-slate-400">ACTION:</span>
                      <span className="font-bold text-slate-900">{roundItem.policyCheck.action}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-sans text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">REASON:</span>
                      <span className="truncate max-w-[280px]">{roundItem.policyCheck.reason}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">POLICY CHECK:</span>
                      <span className="font-bold text-emerald-700">{roundItem.policyCheck.result}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60 text-[10px]">
                      <span className="text-slate-400">MARGIN IMPACT:</span>
                      <span className="text-indigo-700 font-semibold">{roundItem.policyCheck.marginCalculation}</span>
                    </div>
                  </div>

                  {/* Merchant Response */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{roundItem.merchantResponse.message}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Agreement Summary Box */}
          {!isSimulating && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between animate-fade-in">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                  Authoritative Final Total
                </span>
                <div className="text-2xl font-black text-emerald-900 mt-0.5">
                  ₹{negotiationData?.authoritativeFinalTotal?.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Total Saved: ₹{negotiationData?.totalSavings?.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-1">1-Day Express Delivery Included</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Cancel
          </button>
          <button
            disabled={isSimulating}
            onClick={() => {
              onClose();
              if (onNegotiationComplete) onNegotiationComplete(negotiationData);
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Negotiating Rounds...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Proceed to Customer Authorization Gate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
