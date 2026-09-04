import React, { useState } from 'react';
import { Sparkles, Edit3, Check, X, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function RequirementsMemory({ requirements, onUpdateRequirement, isUpdating }) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  if (!requirements || Object.keys(requirements).length === 0) {
    return null;
  }

  const handleStartEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveEdit = (field) => {
    let finalVal = tempValue;
    if (field === 'budget') {
      finalVal = Number(tempValue) || requirements.budget || 70000;
    }
    onUpdateRequirement(field, finalVal);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  // Helper to format labels
  const formatBudget = (val) => {
    if (!val) return '₹70,000';
    const num = Number(val);
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
  };

  const formatUse = (val) => {
    if (!val) return 'General';
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const formatPriority = (val) => {
    if (!val) return 'Best Value';
    if (val === 'performance') return '⚡ High Performance';
    if (val === 'battery') return '🔋 Long Battery';
    if (val === 'value') return '💰 Best Value';
    if (val === 'anc') return '🎧 Active Noise Cancelling';
    if (val === 'camera') return '📸 Pro Camera';
    if (val === 'lightweight') return '🪶 Ultra Lightweight';
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const formatDelivery = (val) => {
    if (val === 'express') return '⚡ 1-2 Days';
    if (val === 'standard') return '📦 Within 1 Week';
    return '🚚 Standard';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl p-4 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100/80 flex items-center justify-center text-sky-700">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              YOUR REQUIREMENTS
              <span className="text-[10px] font-normal lowercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                live agent memory
              </span>
            </h3>
            <p className="text-xs text-slate-700">
              NEXA dynamically recalculates top recommendations whenever you edit these criteria.
            </p>
          </div>
        </div>

        {isUpdating && (
          <div className="flex items-center gap-1.5 text-xs text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full animate-pulse self-start sm:self-auto">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Recalibrating matches...</span>
          </div>
        )}
      </div>

      {/* Requirement Chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* 1. Category */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-700 text-xs font-medium border border-slate-200">
          <span className="text-slate-700">Category:</span>
          <span className="font-semibold text-slate-900 capitalize">{requirements.category || 'Laptop'}</span>
        </div>

        {/* 2. Budget Chip */}
        {editingField === 'budget' ? (
          <div className="inline-flex items-center gap-1.5 bg-white border-2 border-sky-500 rounded-xl px-2 py-1 shadow-sm">
            <span className="text-xs font-bold text-slate-700">₹</span>
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="e.g. 75000"
              className="w-24 text-xs font-semibold text-slate-900 focus:outline-hidden"
              autoFocus
            />
            <button
              onClick={() => handleSaveEdit('budget')}
              className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-md"
              title="Apply"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-rose-100 text-rose-500 rounded-md"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleStartEdit('budget', requirements.budget || 70000)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100/80 text-sky-800 text-xs font-medium border border-sky-200 transition-colors cursor-pointer"
            title="Click to edit budget"
          >
            <span className="text-sky-800 font-semibold">Budget:</span>
            <span className="font-bold text-sky-950">{formatBudget(requirements.budget)}</span>
            <Edit3 className="w-3 h-3 text-sky-400 group-hover:text-sky-700 ml-0.5" />
          </button>
        )}

        {/* 3. Primary Use Chip */}
        {editingField === 'primaryUse' ? (
          <div className="inline-flex items-center gap-1.5 bg-white border-2 border-sky-500 rounded-xl px-2 py-1 shadow-sm">
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="text-xs font-semibold text-slate-900 focus:outline-hidden bg-transparent cursor-pointer"
              autoFocus
            >
              <option value="coding">Coding & Development</option>
              <option value="college">College & Academics</option>
              <option value="gaming">Gaming & AI/ML</option>
              <option value="office">Office & Business</option>
              <option value="travel">Travel & Commute</option>
              <option value="camera">Photography & Video</option>
            </select>
            <button
              onClick={() => handleSaveEdit('primaryUse')}
              className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-md"
              title="Apply"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-rose-100 text-rose-500 rounded-md"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleStartEdit('primaryUse', requirements.primaryUse || 'coding')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-800 text-xs font-medium border border-indigo-200 transition-colors cursor-pointer"
            title="Click to edit use case"
          >
            <span className="text-indigo-800 font-semibold">Use:</span>
            <span className="font-bold text-indigo-950">{formatUse(requirements.primaryUse)}</span>
            <Edit3 className="w-3 h-3 text-indigo-400 group-hover:text-indigo-700 ml-0.5" />
          </button>
        )}

        {/* 4. Priority Chip */}
        {editingField === 'priority' ? (
          <div className="inline-flex items-center gap-1.5 bg-white border-2 border-sky-500 rounded-xl px-2 py-1 shadow-sm">
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="text-xs font-semibold text-slate-900 focus:outline-hidden bg-transparent cursor-pointer"
              autoFocus
            >
              <option value="performance">High Performance</option>
              <option value="battery">All-Day Battery</option>
              <option value="value">Best Overall Value</option>
              <option value="lightweight">Lightweight & Slim</option>
              <option value="anc">Active Noise Cancelling</option>
              <option value="camera">Pro Camera</option>
            </select>
            <button
              onClick={() => handleSaveEdit('priority')}
              className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-md"
              title="Apply"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-rose-100 text-rose-500 rounded-md"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleStartEdit('priority', requirements.priority || 'performance')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-800 text-xs font-medium border border-purple-200 transition-colors cursor-pointer"
            title="Click to edit priority"
          >
            <span className="text-purple-800 font-semibold">Priority:</span>
            <span className="font-bold text-purple-950">{formatPriority(requirements.priority)}</span>
            <Edit3 className="w-3 h-3 text-purple-400 group-hover:text-purple-700 ml-0.5" />
          </button>
        )}

        {/* 5. RAM Chip (for laptops) */}
        {requirements.category === 'laptop' && (
          editingField === 'ram' ? (
            <div className="inline-flex items-center gap-1.5 bg-white border-2 border-sky-500 rounded-xl px-2 py-1 shadow-sm">
              <select
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="text-xs font-semibold text-slate-900 focus:outline-hidden bg-transparent cursor-pointer"
                autoFocus
              >
                <option value="16GB">16GB RAM</option>
                <option value="8GB">8GB RAM</option>
                <option value="32GB">32GB RAM</option>
                <option value="auto">Auto / Any</option>
              </select>
              <button
                onClick={() => handleSaveEdit('ram')}
                className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-md"
                title="Apply"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 hover:bg-rose-100 text-rose-500 rounded-md"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleStartEdit('ram', requirements.ram || '16GB')}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-medium border border-emerald-200 transition-colors cursor-pointer"
              title="Click to edit RAM requirement"
            >
              <span className="text-emerald-800 font-semibold">RAM:</span>
              <span className="font-bold text-emerald-950">{requirements.ram || '16GB'}</span>
              <Edit3 className="w-3 h-3 text-emerald-400 group-hover:text-emerald-700 ml-0.5" />
            </button>
          )
        )}

        {/* 6. Delivery Chip */}
        {editingField === 'delivery' ? (
          <div className="inline-flex items-center gap-1.5 bg-white border-2 border-sky-500 rounded-xl px-2 py-1 shadow-sm">
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="text-xs font-semibold text-slate-900 focus:outline-hidden bg-transparent cursor-pointer"
              autoFocus
            >
              <option value="express">Express (1-2 Days)</option>
              <option value="standard">Standard (1 Week)</option>
              <option value="any">No Preference</option>
            </select>
            <button
              onClick={() => handleSaveEdit('delivery')}
              className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-md"
              title="Apply"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-rose-100 text-rose-500 rounded-md"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleStartEdit('delivery', requirements.delivery || 'express')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-800 text-xs font-medium border border-amber-200 transition-colors cursor-pointer"
            title="Click to edit delivery preference"
          >
            <span className="text-amber-800 font-semibold">Delivery:</span>
            <span className="font-bold text-amber-950">{formatDelivery(requirements.delivery)}</span>
            <Edit3 className="w-3 h-3 text-amber-400 group-hover:text-amber-700 ml-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
