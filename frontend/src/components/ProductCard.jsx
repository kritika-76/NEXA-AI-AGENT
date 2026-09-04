import React from 'react';
import { Star, CheckCircle2, HelpCircle, ArrowRightLeft, MessageSquare, ShoppingCart, Truck, ShieldCheck, Zap } from 'lucide-react';

export default function ProductCard({
  product,
  rank,
  onWhyThis,
  onCompare,
  onAskNexa,
  onSelectProduct
}) {
  const getMatchScoreBadgeColor = (score) => {
    if (score >= 95) return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (score >= 90) return 'bg-sky-50 text-sky-700 border-sky-300';
    return 'bg-indigo-50 text-indigo-700 border-indigo-300';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Top Banner: Rank & Match Score */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
            #{rank}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {rank === 1 ? 'Top AI Recommendation' : rank === 2 ? 'Strong Contender' : 'Great Alternative'}
          </span>
        </div>

        {/* Match Percentage Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1 shadow-2xs ${getMatchScoreBadgeColor(
            product.matchScore
          )}`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{product.matchScore}% Match</span>
        </div>
      </div>

      {/* Product Image & Basic Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Merchant & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-slate-600 truncate max-w-[60%] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            {product.merchant}
          </span>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-semibold border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-amber-600 font-normal text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Price & Delivery */}
        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{product.deliveryDays <= 1 ? 'Next Day' : `${product.deliveryDays} Days`}</span>
          </div>
        </div>

        {/* Key Hardware Specs Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.specs.processor && (
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {product.specs.processor}
            </span>
          )}
          {product.specs.ram && (
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {product.specs.ram}
            </span>
          )}
          {product.specs.storage && (
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {product.specs.storage}
            </span>
          )}
          {product.specs.battery && (
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[200px]">
              {product.specs.battery}
            </span>
          )}
          {product.specs.anc && (
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {product.specs.anc}
            </span>
          )}
          {product.specs.camera && (
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[200px]">
              {product.specs.camera}
            </span>
          )}
        </div>

        {/* Why It Matches Highlights */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Why it matches your requirements:
          </span>
          <ul className="space-y-1.5">
            {product.matchReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
        {/* Primary CTA: Select / Buy */}
        <button
          onClick={() => onSelectProduct(product)}
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 hover:shadow-lg transition-all cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Select Product</span>
        </button>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            onClick={() => onWhyThis(product)}
            className="py-1.5 px-2 text-xs font-semibold text-slate-700 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Explain why NEXA recommended this"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Why this?</span>
          </button>

          <button
            onClick={() => onCompare(product)}
            className="py-1.5 px-2 text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Compare with top alternatives"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Compare</span>
          </button>

          <button
            onClick={() => onAskNexa(product)}
            className="py-1.5 px-2 text-xs font-semibold text-slate-700 hover:text-purple-700 bg-white hover:bg-purple-50 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Ask a specific question about this product"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Ask NEXA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
