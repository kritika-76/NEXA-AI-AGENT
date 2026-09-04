import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { aiService } from '../services/api';

export default function ExplainabilityModal({
  product,
  requirements,
  onClose,
  onSelectProduct
}) {
  const [explanationData, setExplanationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    aiService.explainProduct(product.id, requirements)
      .then(res => {
        setExplanationData(res.explanation);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load explainability:', err);
        setLoading(false);
      });
  }, [product, requirements]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                Why Did NEXA Recommend This?
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Transparent AI Decision Rationale & Requirement Verification
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
          {/* Product Glance Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-slate-500">{product.merchant}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Zap className="w-3 h-3 fill-current" />
                  {product.matchScore}% Match
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 truncate">{product.name}</h3>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-sky-600 gap-3">
              <Sparkles className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium text-slate-600">Generating plain-language reasoning...</span>
            </div>
          ) : (
            <>
              {/* Natural Language Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  AI Decision Summary
                </h4>
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 text-sky-950 text-sm leading-relaxed font-medium">
                  {explanationData?.summary || product.aiExplanationSummary}
                </div>
              </div>

              {/* Requirement Match Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  YOUR REQUIREMENT → PRODUCT MATCH
                </h4>
                <div className="space-y-2.5">
                  {explanationData?.requirementMatches?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{item.requirement}</span>
                          <span className="text-[10px] text-slate-400">→</span>
                          <span className="text-xs font-medium text-slate-600">{item.productSpec}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">{item.explanation}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade-off Transparency */}
              {explanationData?.tradeoffs && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>NEXA Transparency Note</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {explanationData.tradeoffs.consideration}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onSelectProduct(product);
            }}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-md shadow-sky-600/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Proceed with this Product</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
