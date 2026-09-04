import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, Info, Check, Zap, Truck, RotateCcw, Star, Heart } from 'lucide-react';
import { aiService } from '../services/api';

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [requirements, setRequirements] = useState(location.state?.requirements || {});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    if (product) {
      loadRecommendations();
    } else {
      navigate('/');
    }
  }, [product]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const response = await aiService.getCrossSellBundles(product.id);
      setRecommendations(response.data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
    setLoading(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    navigate('/checkout', { state: { product, requirements } });
  };

  const handleNegotiate = () => {
    // Trigger negotiation modal logic
    navigate('/', { state: { activeOffer: product, openNegotiate: true } });
  };

  const handleViewBenefits = () => {
    navigate('/product-benefits', { state: { product, requirements } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900">Product Details</h1>
              <p className="text-xs text-slate-500">Comprehensive product information & recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Image & Quick Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Product Image */}
              <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full transition-all ${
                    wishlist
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-6 border border-sky-200">
                <p className="text-xs text-sky-700 font-bold uppercase tracking-wider mb-2">Final Price</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-slate-900">
                    ₹{product.finalTotal?.toLocaleString('en-IN') || product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {product.discount && (
                  <p className="text-sm font-bold text-emerald-700">💚 Save ₹{product.discount.toLocaleString('en-IN')}</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm sm:text-base"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleViewBenefits}
                  className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl flex items-center justify-center gap-2 border-2 border-blue-200 transition-all cursor-pointer text-sm sm:text-base"
                >
                  <Info className="w-4 h-4" />
                  <span>Why This Product?</span>
                </button>

                <button
                  onClick={handleNegotiate}
                  className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-2xl flex items-center justify-center gap-2 border-2 border-indigo-200 transition-all cursor-pointer text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Negotiate Price</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-200">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-slate-600" />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">30-Day Returns</p>
                    <p className="text-xs text-slate-500">Free & hassle-free</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-slate-600" />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">Free Shipping</p>
                    <p className="text-xs text-slate-500">Delivery in 2-3 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-slate-600" />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">Warranty</p>
                    <p className="text-xs text-slate-500">1 year manufacturer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Name & Rating */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">
                    {product.rating || 4.5}/5.0 ({product.reviews || 1250} reviews)
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200">
                  🏆 NEXA Recommended
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
              {['overview', 'specifications', 'features'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-bold text-sm capitalize transition-all border-b-2 ${
                    activeTab === tab
                      ? 'text-sky-700 border-sky-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {product.description || 'Premium quality laptop designed for professionals and developers. Perfect for coding, content creation, and multitasking with high-performance specifications.'}
                  </p>
                </div>

                {/* Key Highlights */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4">Key Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-emerald-900">High Performance</p>
                        <p className="text-xs text-emerald-700">Latest processors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-blue-900">Efficient Battery</p>
                        <p className="text-xs text-blue-700">All-day battery life</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <Zap className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-purple-900">Sleek Design</p>
                        <p className="text-xs text-purple-700">Lightweight & portable</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
                      <Zap className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-orange-900">Display</p>
                        <p className="text-xs text-orange-700">Vibrant FHD screen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Processor</span>
                    <span className="font-bold text-slate-900">{product.specs?.processor || 'Intel Core i5-13th Gen'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">RAM</span>
                    <span className="font-bold text-slate-900">{product.specs?.ram || '16GB DDR5'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Storage</span>
                    <span className="font-bold text-slate-900">{product.specs?.storage || '512GB SSD NVMe'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Display</span>
                    <span className="font-bold text-slate-900">{product.specs?.display || '15.6" FHD IPS'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Weight</span>
                    <span className="font-bold text-slate-900">{product.specs?.weight || '1.8 kg'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-3">
                {[
                  { title: 'Thunderbolt Port', desc: 'Ultra-fast data transfer up to 40Gbps' },
                  { title: 'HDMI 2.1', desc: 'Connect to 4K displays and external devices' },
                  { title: 'USB-C', desc: 'Fast charging and data transfer capabilities' },
                  { title: 'WiFi 6E', desc: 'Next-gen wireless connectivity' },
                  { title: 'Backlit Keyboard', desc: 'Type comfortably in low-light conditions' },
                  { title: 'Stereo Speakers', desc: 'Immersive audio experience' }
                ].map((feature, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all">
                    <p className="font-bold text-slate-900">{feature.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Merchant Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider mb-2">Sold By</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {product.merchant?.[0] || 'M'}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">{product.merchant || 'TechNova Hub'}</p>
                  <p className="text-sm text-slate-600">Rating: ⭐ {product.merchantRating || 4.8}/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        {recommendations.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-200">
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Complete Your Setup</h3>
              <p className="text-slate-600">Recommended accessories to enhance your experience</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all overflow-hidden bg-white"
                >
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    {item.discountPercent && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{item.discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-1">{item.category}</p>
                      <h4 className="font-bold text-slate-900 line-clamp-2">{item.name}</h4>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-slate-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.whyThisReason}</p>

                    <button className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-sm rounded-lg transition-colors cursor-pointer">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
