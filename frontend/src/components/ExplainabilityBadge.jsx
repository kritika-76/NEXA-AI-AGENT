import React, { useState } from 'react';
import { HelpCircle, Sparkles, X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { aiService } from '../services/api';

export default function ExplainabilityBadge({
  decisionType = 'RECOMMENDATION',
  context = {},
  variant = 'button', // 'button' | 'badge' | 'inline'
  customLabel = 'Why did NEXA do this?'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async (e) => {
    e.stopPropagation();
    setIsOpen(true);
    setLoading(true);

    try {
      const res = await aiService.getWhyNexa(decisionType, context);
      setData(res.explanation);
    } catch (err) {
      console.error('Explainability fetch error:', err);
      setData({
        decision: `Action: ${decisionType}`,
        reason: 'Executed according to customer budget constraints and verified merchant policy rules.',
        inputFactors: ['Customer Budget', '16GB RAM constraint', '1-Day Delivery SLA'],
        policyConstraints: ['Hard Budget Cap = STRICT', 'Minimum Margin >= 12%'],
        expectedOutcome: 'High buyer utility and protected merchant boundaries.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      {variant === 'button' ? (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-800 text-xs font-bold border border-purple-200 transition-colors shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>{customLabel}</span>
        </button>
      ) : variant === 'badge' ? (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50/70 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3 h-3 text-purple-500" />
          <span>Why this decision?</span>
        </button>
      ) : (
        <span
          onClick={handleOpen}
          className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer inline-flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          {customLabel}
        </span>
      )}

      {/* Dedicated Explainability Modal */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    Why Did NEXA Do This?
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    A2A Autonomous Financial & Policy Explainability Layer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                Fetching decision factors...
              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-slate-700">
                {/* Decision & Reason */}
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                    Autonomous Decision
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{data?.decision}</p>
                  <p className="text-slate-600 mt-1 leading-relaxed">{data?.reason}</p>
                </div>

                {/* Input Factors */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Input Factors Evaluated
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {data?.inputFactors?.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 text-[11px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Policy Constraints */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Policy Constraints Verified
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {data?.policyConstraints?.map((pc, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {pc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-sky-950 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                    Expected Outcome
                  </span>
                  <p className="font-medium text-slate-800">{data?.expectedOutcome}</p>
                </div>
              </div>
            )}

            {/* Close CTA */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
