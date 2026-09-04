import React from 'react';
import { X, Check, Zap, ShoppingCart, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export default function ComparisonModal({
  products,
  selectedProduct,
  onClose,
  onSelectProduct
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Product Comparison
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Compare specifications, merchant guarantees, and key highlights side-by-side
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Product Cards Top Row */}
            <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 self-end pb-2">
                Features & Specs
              </div>
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between relative ${
                    selectedProduct?.id === p.id
                      ? 'bg-sky-50/60 border-sky-400 ring-2 ring-sky-400/20'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  {/* Highlights Badge */}
                  {p.isBestPrice && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Award className="w-3 h-3" /> BEST PRICE
                    </span>
                  )}
                  {p.isBestPerformance && !p.isBestPrice && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Award className="w-3 h-3" /> BEST PERFORMANCE
                    </span>
                  )}
                  {p.isFastestDelivery && !p.isBestPrice && !p.isBestPerformance && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Award className="w-3 h-3" /> FASTEST DELIVERY
                    </span>
                  )}

                  <div>
                    <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5 bg-white border border-slate-200 mt-1">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{p.name}</h3>
                    <p className="text-base font-extrabold text-slate-900 mt-1">
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                    className="mt-3 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Choose This</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Spec Comparison Rows */}
            <div className="divide-y divide-slate-100 text-sm">
              {/* 1. Price */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Price (INR)
                </div>
                {products.map(p => (
                  <div key={p.id} className="font-extrabold text-slate-900 text-xs">
                    ₹{p.price.toLocaleString('en-IN')}
                    {p.isBestPrice && <span className="ml-1 text-[10px] font-bold text-emerald-600">(Best Price)</span>}
                  </div>
                ))}
              </div>

              {/* 2. RAM */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  RAM
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-800 text-xs font-semibold">
                    {p.specs.ram || p.specs.connectivity || '—'}
                  </div>
                ))}
              </div>

              {/* 3. Storage */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Storage
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-800 text-xs font-semibold">
                    {p.specs.storage || p.specs.ports || '—'}
                  </div>
                ))}
              </div>

              {/* 4. Processor */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Processor
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-800 text-xs font-semibold">
                    {p.specs.processor || p.specs.drivers || p.specs.sensor || '—'}
                  </div>
                ))}
              </div>

              {/* 5. Battery */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Battery Life
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-800 text-xs font-semibold">
                    {p.specs.battery || '—'}
                  </div>
                ))}
              </div>

              {/* 6. Delivery */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Delivery
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.deliveryRange || (p.deliveryDays <= 1 ? 'Next-Day Delivery' : `${p.deliveryDays} Days`)}</span>
                  </div>
                ))}
              </div>

              {/* 7. Warranty */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Warranty
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-700 text-xs font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{p.warranty || '12 Months Warranty'}</span>
                  </div>
                ))}
              </div>

              {/* 8. Return Policy */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Return Policy
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-700 text-xs font-medium flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{p.returnPolicy || '14 Days Return'}</span>
                  </div>
                ))}
              </div>

              {/* 9. Merchant Rating */}
              <div className="grid grid-cols-4 gap-4 py-3 items-center">
                <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Merchant Rating
                </div>
                {products.map(p => (
                  <div key={p.id} className="text-slate-800 text-xs font-bold">
                    ★ {p.rating} / 5.0 ({p.merchant})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
