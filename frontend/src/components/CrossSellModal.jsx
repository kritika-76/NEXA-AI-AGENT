import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Sparkles, ShieldCheck, ArrowRight, AlertTriangle, Trash2, HelpCircle } from 'lucide-react';
import { aiService } from '../services/api';

export default function CrossSellModal({
  product,
  requirements,
  onClose,
  onProceedToCheckout
}) {
  const [crossSellItems, setCrossSellItems] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ignoreBudgetWarning, setIgnoreBudgetWarning] = useState(false);

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    aiService.getCrossSell(product.id)
      .then(res => {
        setCrossSellItems(res.bundles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Cross-sell fetch error:', err);
        setLoading(false);
      });
  }, [product]);

  const toggleAddon = (item) => {
    if (selectedAddons.some(a => a.id === item.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== item.id));
    } else {
      setSelectedAddons([...selectedAddons, item]);
    }
  };

  const removeSpecificAddon = (addonId) => {
    setSelectedAddons(selectedAddons.filter(a => a.id !== addonId));
  };

  const targetBudget = Number(requirements.budget) || 70000;
  const addonTotal = selectedAddons.reduce((acc, cur) => acc + (cur.bundleDiscountPrice || cur.price), 0);
  const totalAmount = product.price + addonTotal;
  const totalSavings = selectedAddons.reduce((acc, cur) => acc + (cur.savingsAmount || 0), 0) +
    (product.originalPrice && product.originalPrice > product.price ? product.originalPrice - product.price : 0);

  // Constraint check
  const isBudgetExceeded = totalAmount > targetBudget;
  const exceededBy = totalAmount - targetBudget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                COMPLETE YOUR SETUP
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Relevant companion accessories tailored to your {requirements.primaryUse || 'coding'} workflow
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
          {/* Selected Primary Product Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                Primary Selection
              </span>
              <h3 className="text-base font-bold text-slate-900 truncate">{product.name}</h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Selected</span>
            </div>
          </div>

          {/* Budget Constraint Violation Banner */}
          {isBudgetExceeded && !ignoreBudgetWarning && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Budget Constraint Alert
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Your selected items exceed your original budget of <strong>₹{targetBudget.toLocaleString('en-IN')}</strong> by <strong>₹{exceededBy.toLocaleString('en-IN')}</strong>.
                  </p>
                </div>
              </div>

              {/* Action Buttons to resolve constraint violation */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedAddons.map(a => (
                  <button
                    key={a.id}
                    onClick={() => removeSpecificAddon(a.id)}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 text-amber-700" />
                    <span>Remove {a.name} (-₹{(a.bundleDiscountPrice || a.price).toLocaleString('en-IN')})</span>
                  </button>
                ))}
                <button
                  onClick={() => setIgnoreBudgetWarning(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          )}

          {/* Complementary Cross-Sell Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended Complementary Add-Ons
              </h4>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Optional Companion Items
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                Finding optimal matching accessories...
              </div>
            ) : crossSellItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No additional add-ons available for this item.</p>
            ) : (
              <div className="space-y-3">
                {crossSellItems.map(item => {
                  const isSelected = selectedAddons.some(a => a.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-slate-200 mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-slate-900">{item.name}</h5>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                              {item.discountPercent}% Off Bundle
                            </span>
                          </div>

                          {/* WHY THIS? Explicit section */}
                          <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                            <span className="font-bold text-sky-800 block text-[10px] uppercase tracking-wider mb-0.5">
                              WHY THIS?
                            </span>
                            <p className="leading-snug text-slate-600">{item.explainableReason}</p>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-sm font-extrabold text-slate-900">
                              +₹{(item.bundleDiscountPrice || item.price).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Add to Order / Not Now Buttons */}
                      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                        {isSelected ? (
                          <button
                            type="button"
                            onClick={() => toggleAddon(item)}
                            className="px-3.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Order</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleAddon(item)}
                              className="px-3.5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Order</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Order Summary & Explicit Proceed */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Total Order Value ({1 + selectedAddons.length} item{selectedAddons.length > 0 ? 's' : ''})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
              {totalSavings > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  You Save ₹{totalSavings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout({
                  primaryProduct: product,
                  addons: selectedAddons,
                  totalAmount,
                  totalSavings,
                  targetBudget
                });
              }}
              className="flex-1 sm:flex-none px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 hover:shadow-sky-600/40 transition-all cursor-pointer"
            >
              <span>Review Your Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
