import React, { useState, useEffect } from 'react';
import { merchantService } from '../services/api';
import { BarChart3, TrendingUp, ShoppingBag, Zap, Target, ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck, Layers, PieChart, Info, X, DollarSign, Award, Sliders } from 'lucide-react';

export default function MerchantAnalyticsPage() {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState('merch_technova');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campaignApproved, setCampaignApproved] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState(null);

  useEffect(() => {
    merchantService.getMerchants().then(res => setMerchants(res.merchants || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    merchantService.getMerchantAnalytics(selectedMerchantId)
      .then(res => {
        setAnalyticsData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load merchant analytics:', err);
        setLoading(false);
      });
  }, [selectedMerchantId]);

  const handleApproveCampaign = async () => {
    try {
      const res = await merchantService.approveGrowthAction({
        merchantId: selectedMerchantId,
        actionId: 'growth_rule_3pct_concession'
      });
      setCampaignApproved(true);
      setApprovalMessage(res.message);
    } catch (err) {
      console.error('Failed to approve campaign:', err);
    }
  };

  const { topMetrics, lostIntentRootCauses, aiGrowthAgent } = analyticsData || {};
  const currentMerchantName = merchants.find(m => m.id === selectedMerchantId)?.name || 'TechNova Solutions';

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Page Header with Merchant Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Track 01 — AI Revenue & Growth Optimization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Merchant Analytics & Lost Intent Engine
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Autonomous diagnostic telemetry converting lost customer intents into bounded merchant revenue growth actions.
            </p>
          </div>

          {/* Merchant Dropdown Selector */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-2xl shadow-2xs">
            <span className="text-xs font-bold text-slate-500 pl-2">Merchant Node:</span>
            <select
              value={selectedMerchantId}
              onChange={(e) => {
                setSelectedMerchantId(e.target.value);
                setCampaignApproved(false);
                setApprovalMessage(null);
              }}
              className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-sky-500 cursor-pointer"
            >
              {merchants.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. Core Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total AI Revenue */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Total AI Revenue
            </span>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {topMetrics?.totalAiRevenue || '₹1.42L'}
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-3">
              <TrendingUp className="w-3 h-3" /> Settled via Razorpay
            </span>
          </div>

          {/* Intents Processed */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Intents Processed
            </span>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {topMetrics?.intentsProcessed ? topMetrics.intentsProcessed.toLocaleString('en-IN') : '14,820'}
            </div>
            <span className="text-xs font-semibold text-slate-500 block mt-3">
              A2A RFPs evaluated in real-time
            </span>
          </div>

          {/* Orders Won */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Orders Won
            </span>
            <div className="text-3xl font-black text-indigo-700 mt-2">
              {topMetrics?.ordersWon || 42}
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-3">
              28.4% Win Rate vs 7.2% Search
            </span>
          </div>

          {/* Average Order Value */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Average Order Value
            </span>
            <div className="text-3xl font-black text-emerald-600 mt-2">
              {topMetrics?.averageOrderValue || '₹3,380'}
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-3">
              +21.4% with AI Companion Bundle
            </span>
          </div>
        </div>

        {/* 2. Major Insight Card: "Why Did TechNova Solutions Lose Customers?" */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-600" />
                <span>Why Did {currentMerchantName} Lose Customers?</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Root causes diagnosed across 14,820 buyer negotiation sessions
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
              Lost Intent Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {(lostIntentRootCauses?.breakdown || [
              { reason: 'Price Disadvantage', percentage: 38, count: 184 },
              { reason: 'Hardware Spec / Brand Mismatch', percentage: 22, count: 106 },
              { reason: 'Inventory Stock-Out', percentage: 18, count: 87 },
              { reason: 'Delivery SLA Disadvantage', percentage: 12, count: 58 }
            ]).slice(0, 4).map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[140px]">{item.reason}</span>
                  <span className="font-extrabold text-rose-600 text-sm">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">{item.count || 120} buyer drop-offs</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AI Growth Agent Card with Gated Approval Actions */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl mb-8 border border-slate-800">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">
                  AI Growth Agent
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {aiGrowthAgent?.opportunityTitle || 'Growth Opportunity Detected'}
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase">
              Merchant Approval Required
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 mb-5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Customer Intent Telemetry</span>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              “{aiGrowthAgent?.intentInsight || '38% of lost laptop intents were caused by a ₹1,000–₹3,000 price disadvantage.'}”
            </p>
            <div className="pt-2 border-t border-slate-700/80">
              <span className="text-[10px] text-sky-400 font-bold uppercase">AI Actionable Recommendation</span>
              <p className="text-xs text-white font-medium mt-0.5">
                {aiGrowthAgent?.aiRecommendation || 'Apply a maximum 3% dynamic concession to eligible coding-laptop purchase requests above ₹65,000.'}
              </p>
            </div>
          </div>

          {/* Projected Impact Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Expected Conversion</span>
              <span className="font-extrabold text-emerald-400 text-sm">{aiGrowthAgent?.expectedConversionIncrease || '+14%'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Projected Orders</span>
              <span className="font-extrabold text-sky-400 text-sm">{aiGrowthAgent?.projectedAdditionalOrders || '+140 Orders'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Revenue Impact</span>
              <span className="font-extrabold text-amber-300 text-sm">{aiGrowthAgent?.projectedRevenueImpact || '+₹8.4 Lakhs'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Max Concession Cap</span>
              <span className="font-extrabold text-purple-300 text-sm">{aiGrowthAgent?.maxDiscount || '3%'} Cap</span>
            </div>
          </div>

          {/* Gated Action Buttons */}
          {campaignApproved ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-semibold animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{approvalMessage || 'Dynamic 3% Concession Rule Approved & Deployed to A2A Negotiation Engine.'}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-950 px-2 py-0.5 rounded text-emerald-400">
                ACTIVE
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleApproveCampaign}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Growth Action</span>
              </button>
              <button
                onClick={() => alert('Rule modification drawer opened.')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Modify Rules</span>
              </button>
              <button
                onClick={() => alert('Recommendation dismissed.')}
                className="px-4 py-3 text-slate-400 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        {/* 4. Measurable Revenue Impact Tracking (AI Growth Actions Performance) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>AI Growth Actions Performance (Simulation & Telemetry)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Measurable revenue uplift generated across Track 01 agentic commerce simulations
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              Simulated Data
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Rule</span>
              <span className="font-extrabold text-slate-900 text-sm mt-1 block">Dynamic 3% Concession</span>
              <span className="text-[10px] text-slate-500">Targeted on coding laptops</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Conversion Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-slate-400 line-through">29%</span>
                <span className="font-extrabold text-emerald-700 text-sm">35%</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">+6%</span>
              </div>
              <span className="text-[10px] text-slate-500">Before vs After Simulation</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Revenue Uplift</span>
              <span className="font-extrabold text-emerald-700 text-base mt-1 block">+₹8.4 Lakhs</span>
              <span className="text-[10px] text-slate-500">Additional gross merchandise value</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Incremental Orders</span>
              <span className="font-extrabold text-sky-700 text-base mt-1 block">+140 Orders</span>
              <span className="text-[10px] text-slate-500">Won from competitor drops</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
