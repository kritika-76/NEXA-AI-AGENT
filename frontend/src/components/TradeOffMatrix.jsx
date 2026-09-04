import React from 'react';
import { X, Award, Zap, ShieldCheck, CheckCircle2, Truck, RotateCcw, ShoppingCart, Percent } from 'lucide-react';
import ExplainabilityBadge from './ExplainabilityBadge';

export default function TradeOffMatrix({
  offers,
  onSelectOffer,
  onClose
}) {
  if (!offers || offers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Multi-Attribute Trade-Off Matrix
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                10 Evaluated Merchant Offers
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Multi-dimensional evaluation across Price (30%), Specs (25%), Delivery (15%), Warranty (10%), Trust (10%), Benefits (10%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Top Cards Row */}
            <div className="grid grid-cols-5 gap-3 pb-6 border-b border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 self-end pb-2">
                Evaluation Metric
              </div>
              {offers.slice(0, 4).map((offer, idx) => (
                <div
                  key={offer.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between relative ${
                    offer.isRecommendedPick
                      ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-400/20'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  {/* Badges */}
                  {offer.isBestOverallValue && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                      <Award className="w-2.5 h-2.5" /> Best Overall Value
                    </span>
                  )}
                  {offer.isLowestPrice && !offer.isBestOverallValue && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                      <Award className="w-2.5 h-2.5" /> Lowest Price
                    </span>
                  )}
                  {offer.isFastestDelivery && !offer.isBestOverallValue && !offer.isLowestPrice && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                      <Award className="w-2.5 h-2.5" /> Fastest Delivery
                    </span>
                  )}

                  <div>
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 bg-white border border-slate-200 mt-1">
                      <img src={offer.image} alt={offer.productName} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 right-1.5 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        {offer.aiUtilityScore}/100
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 block truncate">{offer.merchant}</span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{offer.productName}</h4>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                      ₹{offer.finalTotal.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectOffer(offer);
                    }}
                    className="mt-2.5 w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Select Offer</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Matrix Comparison Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {/* AI Utility Score */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  AI Utility Score
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="font-black text-sky-700 flex items-center gap-1 text-sm">
                    <Zap className="w-3.5 h-3.5 fill-sky-600" />
                    <span>{o.aiUtilityScore}/100</span>
                  </div>
                ))}
              </div>

              {/* Final Price & Discount */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Final Price & Discount
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-slate-900 font-bold">
                    <span>₹{o.finalTotal.toLocaleString('en-IN')}</span>
                    <span className="text-emerald-700 font-semibold block text-[11px]">Save ₹{o.negotiatedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Shipping
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-slate-700 font-medium">
                    {o.shipping}
                  </div>
                ))}
              </div>

              {/* Risk Rating */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Risk & Security
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{o.riskAssessment} Risk</span>
                  </div>
                ))}
              </div>

              {/* Delivery Speed */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Delivery Speed
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-slate-800 font-semibold">
                    {o.deliveryTime}
                  </div>
                ))}
              </div>

              {/* Warranty & Return */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Warranty & Returns
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-slate-700 font-medium">
                    <span>{o.warranty}</span>
                    <span className="text-slate-400 block text-[10px]">{o.returnPolicy}</span>
                  </div>
                ))}
              </div>

              {/* Free Bundles */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Free Bundles
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-emerald-800 font-semibold">
                    {o.freeBundles?.join(', ') || 'Standard Packaging'}
                  </div>
                ))}
              </div>

              {/* Hardware Specifications */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Hardware Specs
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-slate-800 font-medium text-[11px]">
                    <div>{o.specs.processor}</div>
                    <div className="text-slate-500">{o.specs.ram} • {o.specs.storage}</div>
                  </div>
                ))}
              </div>

              {/* Merchant Rating */}
              <div className="grid grid-cols-5 gap-3 py-3 items-center">
                <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Merchant Rating
                </div>
                {offers.slice(0, 4).map(o => (
                  <div key={o.id} className="text-slate-800 font-bold">
                    ★ {o.merchantRating} / 5.0
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
