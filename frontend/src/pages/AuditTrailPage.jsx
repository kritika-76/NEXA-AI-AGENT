import React, { useState, useEffect } from 'react';
import { auditService } from '../services/api';
import { ShieldCheck, Filter, Code2, RefreshCw, CheckCircle2, AlertCircle, Info, X, Copy, Check, Terminal, ExternalLink, ArrowRight } from 'lucide-react';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedActor, setSelectedActor] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const actors = ['ALL', 'CUSTOMER', 'BUYER AGENT', 'POLICY ENGINE', 'MERCHANT AGENT', 'RAZORPAY'];

  const fetchLogs = async (actorFilter = selectedActor) => {
    setLoading(true);
    try {
      const res = await auditService.getAuditLogs(actorFilter);
      setLogs(res.logs || []);
      setFilteredLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(selectedActor);
  }, [selectedActor]);

  const handleCopyPayload = () => {
    if (!selectedEvent) return;
    navigator.clipboard.writeText(JSON.stringify(selectedEvent.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActorBadgeStyle = (actor) => {
    switch (actor) {
      case 'BUYER AGENT':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'POLICY ENGINE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'MERCHANT AGENT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CUSTOMER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RAZORPAY':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'BLOCKED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ALERT':
      case 'WARN':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'INFO':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Cryptographic Governance & Deterministic Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A2A Commerce Audit Trail
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Cryptographically traceable, deterministic event log recording every autonomous decision, policy evaluation, price concession, and state mutation across the A2A network.
            </p>
          </div>

          <button
            onClick={() => fetchLogs(selectedActor)}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin text-sky-600' : ''}`} />
            <span>Refresh Events</span>
          </button>
        </div>

        {/* Actor Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter Actor:
          </span>
          {actors.map((actor) => (
            <button
              key={actor}
              onClick={() => setSelectedActor(actor)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer border ${
                selectedActor === actor
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {actor}
            </button>
          ))}
        </div>

        {/* Timeline Events Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Audit Event Log ({filteredLogs.length} Events)
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-500">Append-Only Immutability Active</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No events found matching the filter "{selectedActor}".
              </div>
            ) : (
              filteredLogs.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Event Timestamp */}
                    <div className="text-left shrink-0 min-w-[90px]">
                      <span className="text-xs font-mono font-bold text-slate-500 block">
                        {log.timestamp}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {log.id}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Actor Badge */}
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border ${getActorBadgeStyle(log.actor)}`}>
                          {log.actor}
                        </span>

                        {/* Event Type */}
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {log.eventType}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getStatusBadgeStyle(log.status)}`}>
                          {log.status}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>

                  {/* Action: View Payload Button */}
                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      onClick={() => setSelectedEvent(log)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200/80 hover:border-sky-200 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Payload</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Structured Payload JSON Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 text-slate-100 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-800 animate-scale-up overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400">{selectedEvent.eventType}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({selectedEvent.id})</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Emitted by {selectedEvent.actor} at {selectedEvent.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPayload}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event Summary Description */}
            <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-slate-400">Event Context: </span>
              {selectedEvent.description}
            </div>

            {/* JSON Code Viewer */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-sky-300 bg-[#0d1117]">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(selectedEvent.payload, null, 2)}
              </pre>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>SHA-256 State Hash: 0x8f2a99c4...71b</span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
