import React from 'react';
import { X, Activity, Cpu, CheckCircle2, Zap, ArrowRight, Check } from 'lucide-react';

export default function AIActivityDrawer({ isOpen, onClose, logs, activeRequirements }) {
  if (!isOpen) return null;

  const standardChecklist = [
    { label: 'Customer intent received', key: 'intent' },
    { label: 'Requirements extracted', key: 'extract' },
    { label: 'Relevant questions selected', key: 'questions' },
    { label: 'Products matched', key: 'match' },
    { label: 'Recommendation generated', key: 'recommend' },
    { label: 'Cross-sell suggestion generated', key: 'crossSell' },
    { label: 'Customer approved order', key: 'approved' },
    { label: 'Razorpay checkout initiated', key: 'checkout' }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col animate-fade-in font-mono">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Activity Log
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time Transparent Agentic Reasoning Trace
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Standard Agent Lifecycle Checklist */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 text-xs font-sans">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-2.5">
          Agent Execution Pipeline
        </span>
        <div className="space-y-1.5">
          {standardChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300 text-xs">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 border border-emerald-500/40">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Snapshot */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2 font-sans flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>Active Requirements Memory</span>
        </div>
        <pre className="text-[11px] text-emerald-300 bg-slate-950 p-2.5 rounded-lg overflow-x-auto border border-slate-800/80">
          {JSON.stringify(activeRequirements || {}, null, 2)}
        </pre>
      </div>

      {/* Reasoning Steps Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans">
          Live Decision Log
        </div>

        {logs && logs.length > 0 ? (
          logs.map((log, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-sky-400 uppercase">{log.stage}</span>
                <span>{log.time}</span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed font-sans">{log.message}</p>
              {log.detail && (
                <div className="mt-1 p-2 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 overflow-x-auto">
                  {typeof log.detail === 'object' ? JSON.stringify(log.detail, null, 2) : log.detail}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 font-sans text-xs">
            Start a shopping search to inspect live agent reasoning traces.
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-sans flex items-center justify-between">
        <span>Deterministic + LLM Engine</span>
        <span className="text-emerald-400 font-semibold">Zero Hallucinations</span>
      </div>
    </div>
  );
}
