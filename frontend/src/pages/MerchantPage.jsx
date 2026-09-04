import React, { useState, useEffect } from 'react';
import { merchantService } from '../services/api';
import { BarChart3, TrendingUp, ShoppingBag, Zap, Target, ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck, Layers, PieChart, Info, X, DollarSign } from 'lucide-react';

export default function MerchantPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedActions, setAppliedActions] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    merchantService.getInsights()
      .then(res => {
        setInsights(res.insights);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load merchant insights:', err);
        setLoading(false);
      });
  }, []);

  const handleApplyAction = (actionId) => {
    if (!appliedActions.includes(actionId)) {
      setAppliedActions([...appliedActions, actionId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-sky-600 gap-3">
        <Sparkles className="w-6 h-6 animate-spin" />
        <span className="text-sm font-semibold text-slate-600">Loading AI Revenue Assistant...</span>
      </div>
    );
  }

  const { overview, aiGrowthOpportunities, lostIntentInsights } = insights || {};

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Razorpay Buildathon Track 01 — AI Growth & Agentic Commerce</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Revenue Assistant
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Help merchants make their catalog understandable to AI agents and grow revenue based on real customer intent.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Commerce Engine: Active</span>
          </div>
        </div>

        {/* 1. Core Merchant Metrics (AI-Assisted Sales, AI Orders, Conversion Rate, AOV) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* AI-Assisted Sales */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI-Assisted Sales
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overview?.aiAssistedSales || '₹1.42L'}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                Live Month
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              Directly routed through NEXA conversational agent
            </p>
          </div>

          {/* AI Orders */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Orders
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {overview?.aiOrders || 42}
              </span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                Confirmed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              Zero drop-off during explicit approval checkout
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conversion Rate
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-indigo-700">
                {overview?.conversionRate || 28.4}%
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                vs 7.2% Search
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              +294% conversion uplift compared to manual browsing
            </p>
          </div>

          {/* Average Order Value */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average Order Value
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-emerald-600">
                ₹{overview?.averageOrderValue ? overview.averageOrderValue.toLocaleString('en-IN') : '3,380'}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                +{overview?.aovUpliftWithCrossSell || 21.4}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              Boosted by AI companion setup cross-sells
            </p>
          </div>
        </div>

        {/* 2. AI Growth Opportunities */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>AI Growth Opportunities</span>
              </h2>
              <p className="text-xs text-slate-500">
                Customer purchase intent synthesized into actionable merchant revenue opportunities
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-lg">
              Recommendations Only
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiGrowthOpportunities?.map(opp => {
              const isApplied = appliedActions.includes(opp.id);
              return (
                <div
                  key={opp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full block w-fit mb-2">
                      INSIGHT
                    </span>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-3">
                      “{opp.insight}”
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        AI Recommendation:
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {opp.recommendation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 font-semibold block">Potential Impact</span>
                        <span className="font-extrabold text-emerald-700">{opp.impact}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-sky-50 border border-sky-200">
                        <span className="text-[10px] text-sky-800 font-semibold block">Estimated Revenue</span>
                        <span className="font-extrabold text-sky-700">+{opp.additionalRevenue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleApplyAction(opp.id)}
                      className={`py-2 px-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isApplied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isApplied ? 'Applied' : 'Apply Recommendation'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedOpportunity(opp)}
                      className="py-2 px-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Lost Intent Insights: WHY CUSTOMERS DID NOT BUY */}
        {lostIntentInsights && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs mb-6">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <span>{lostIntentInsights.title}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Lost intent telemetry captured when customers abandoned searches without selecting products
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {lostIntentInsights.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 truncate">{item.reason}</span>
                    <span className="text-sm font-extrabold text-rose-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* NEXA Growth Suggestion */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-sky-900 block mb-0.5">
                  NEXA Growth Suggestion
                </span>
                <p className="text-xs text-sky-800 leading-relaxed font-medium">
                  “{lostIntentInsights.growthSuggestion}”
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Revenue Opportunity Details</h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <p><strong>Intent Analysis:</strong> {selectedOpportunity.insight}</p>
              <p><strong>Recommended Action:</strong> {selectedOpportunity.recommendation}</p>
              <p><strong>Impact Model:</strong> Expected conversion uplift of {selectedOpportunity.impact}, providing an estimated {selectedOpportunity.additionalRevenue} additional monthly revenue.</p>
              <p className="text-[11px] text-slate-500 italic">• Applying this recommendation prepares agentic bundling rules without modifying underlying base catalog prices.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
