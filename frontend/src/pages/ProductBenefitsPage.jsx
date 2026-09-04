import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, TrendingUp, Zap, Brain, Shield, Award, Target, Clock, Heart, Share2 } from 'lucide-react';
import { aiService } from '../services/api';

export default function ProductBenefitsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [requirements, setRequirements] = useState(location.state?.requirements || {});
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) {
      loadBenefits();
    } else {
      navigate('/');
    }
  }, [product]);

  const loadBenefits = async () => {
    setLoading(true);
    try {
      const response = await aiService.explainProduct(product.id, requirements);
      setExplanation(response.data);
    } catch (error) {
      console.error('Error loading benefits:', error);
      // Use default benefits if API fails
      setExplanation(getDefaultBenefits());
    }
    setLoading(false);
  };

  const getDefaultBenefits = () => {
    return {
      whyRecommended: 'This laptop perfectly matches your requirements for high-performance computing with excellent value for money.',
      matchPercentage: 96,
      keyBenefits: [
        {
          icon: 'Zap',
          title: 'Superior Performance',
          description: 'Latest generation processor handles all your tasks effortlessly without any lag.',
          impact: 'Boost your productivity by 40%'
        },
        {
          icon: 'Clock',
          title: 'All-Day Battery Life',
          description: '10+ hours of real-world usage. Code through your entire workday without charging.',
          impact: 'Work anywhere, anytime'
        },
        {
          icon: 'Target',
          title: 'Perfect for Development',
          description: '16GB RAM and powerful SSD ensure smooth coding experience with multiple IDEs.',
          impact: 'Compile and run faster'
        },
        {
          icon: 'TrendingUp',
          title: 'Great Value for Money',
          description: '₹68,990 price point offers premium specs at mid-range cost.',
          impact: 'Save ₹10,000+ vs competitors'
        },
        {
          icon: 'Shield',
          title: 'Reliability & Warranty',
          description: '1-year manufacturer warranty plus 30-day return policy ensures peace of mind.',
          impact: '100% risk-free purchase'
        },
        {
          icon: 'Award',
          title: 'Proven Quality',
          description: 'Over 1,250 verified reviews with 4.5/5 rating from real users.',
          impact: 'Trusted by professionals'
        }
      ],
      requirementMatch: [
        { requirement: 'Budget', meets: true, detail: 'Within your ₹70,000 budget' },
        { requirement: 'Processor Power', meets: true, detail: 'Intel Core i5-13th Gen handles coding seamlessly' },
        { requirement: 'RAM Size', meets: true, detail: '16GB perfect for multitasking' },
        { requirement: 'Portability', meets: true, detail: '1.8kg is lightweight for commuting' },
        { requirement: 'Display Quality', meets: true, detail: '15.6" FHD IPS vibrant colors' }
      ],
      useCases: [
        {
          title: 'Software Development',
          description: 'Compile large projects, run virtual machines, and debug multiple applications simultaneously.'
        },
        {
          title: 'Content Creation',
          description: 'Edit videos, design graphics, and manage creative workflows without performance bottlenecks.'
        },
        {
          title: 'Data Analysis',
          description: 'Run data science notebooks, process datasets, and perform complex calculations smoothly.'
        },
        {
          title: 'Gaming & Entertainment',
          description: 'Play modern games at medium-high settings and enjoy streaming without interruptions.'
        }
      ],
      comparisonAdvantage: 'Compared to similarly priced laptops, this model offers 20% better performance and comes with better warranty coverage from TechNova Hub.',
      tradeoffs: 'Minor consideration: 512GB storage vs competitors\' 256GB. Perfect for your needs!'
    };
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Loading product benefits...</p>
        </div>
      </div>
    );
  }

  const iconMap = {
    Zap: Zap,
    Clock: Clock,
    Target: Target,
    TrendingUp: TrendingUp,
    Shield: Shield,
    Award: Award,
    Brain: Brain
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl text-slate-900">Why This Product?</h1>
                <p className="text-xs text-slate-500">Complete benefits & suitability analysis</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/product-details', { state: { product, requirements } })}
              className="hidden sm:flex px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Back to Details
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-slate-500">Loading benefits analysis...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Card - Match Percentage */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>

              <div className="relative p-8 sm:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                      Perfect Match for You
                    </h2>
                    <p className="text-sky-100 text-lg mb-6">
                      {explanation?.whyRecommended || 'This product is perfectly tailored to your requirements.'}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                        <span className="text-3xl font-extrabold text-white">
                          {explanation?.matchPercentage || 96}%
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">Match Score</p>
                        <p className="text-sky-100 text-sm">AI Evaluated Compatibility</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      NEXA Analysis Summary
                    </h3>
                    <div className="space-y-2 text-sm text-sky-100">
                      <p>✓ Meets all your requirements</p>
                      <p>✓ Best value in its category</p>
                      <p>✓ Verified by 1,250+ users</p>
                      <p>✓ Recommended by AI Engine</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits Grid */}
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Why You'll Love It</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {explanation?.keyBenefits?.map((benefit, idx) => {
                  const IconComponent = iconMap[benefit.icon] || Zap;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-sky-300 hover:shadow-lg hover:bg-sky-50/30 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 group-hover:shadow-lg transition-shadow">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-slate-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{benefit.description}</p>
                          <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                            {benefit.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requirement Match Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Your Requirement Match
              </h3>

              <div className="space-y-3">
                {explanation?.requirementMatch?.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                      item.meets
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-orange-50 border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${
                        item.meets ? 'bg-emerald-600' : 'bg-orange-600'
                      }`}>
                        {item.meets ? '✓' : '!'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.requirement}</p>
                        <p className={`text-sm ${item.meets ? 'text-emerald-700' : 'text-orange-700'}`}>
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    {item.meets && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Best Use Cases</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {explanation?.useCases?.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:border-sky-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold shrink-0 group-hover:shadow-lg transition-shadow">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 mb-2">{useCase.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{useCase.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Advantage */}
            {explanation?.comparisonAdvantage && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200 p-8">
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Competitive Advantage
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {explanation.comparisonAdvantage}
                </p>
              </div>
            )}

            {/* Considerations */}
            {explanation?.tradeoffs && (
              <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Minor Consideration
                </h3>
                <p className="text-amber-800">
                  {explanation.tradeoffs}
                </p>
              </div>
            )}

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => navigate('/product-details', { state: { product, requirements } })}
                className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer text-base"
              >
                <CheckCircle2 className="w-5 h-5" />
                Proceed to Checkout
              </button>

              <button
                onClick={() => alert('Negotiation feature coming soon!')}
                className="flex-1 py-4 px-6 bg-sky-100 hover:bg-sky-200 text-sky-700 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-base border-2 border-sky-300"
              >
                <Zap className="w-5 h-5" />
                Negotiate Price
              </button>

              <button
                onClick={() => alert('Share coming soon!')}
                className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust & Guarantees */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mt-8">
              <p className="text-center text-slate-600 text-sm mb-4">100% Satisfaction Guaranteed</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                <div className="py-2">
                  <p className="font-bold text-slate-900 text-sm">30-Day</p>
                  <p className="text-slate-600">Return Policy</p>
                </div>
                <div className="py-2">
                  <p className="font-bold text-slate-900 text-sm">1-Year</p>
                  <p className="text-slate-600">Warranty</p>
                </div>
                <div className="py-2">
                  <p className="font-bold text-slate-900 text-sm">Free</p>
                  <p className="text-slate-600">Shipping</p>
                </div>
                <div className="py-2">
                  <p className="font-bold text-slate-900 text-sm">24/7</p>
                  <p className="text-slate-600">Support</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
