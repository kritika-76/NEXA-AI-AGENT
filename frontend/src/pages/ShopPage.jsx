import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConversationalFlow from '../components/ConversationalFlow';
import RequirementsMemory from '../components/RequirementsMemory';
import ExplainabilityModal from '../components/ExplainabilityModal';
import ComparisonModal from '../components/ComparisonModal';
import ProductFollowUpChat from '../components/ProductFollowUpChat';
import CrossSellModal from '../components/CrossSellModal';
import CheckoutModal from '../components/CheckoutModal';
import BoundedNegotiationModal from '../components/BoundedNegotiationModal';
import TradeOffMatrix from '../components/TradeOffMatrix';
import CommercePassportModal from '../components/CommercePassportModal';
import ExplainabilityBadge from '../components/ExplainabilityBadge';
import { aiService, merchantService } from '../services/api';
import {
  Sparkles, ArrowRightLeft, RefreshCw, Zap, SlidersHorizontal, CheckCircle2,
  AlertCircle, ArrowRight, ShieldCheck, Truck, Star, Award, RotateCcw,
  ShoppingCart, Lock, Info, X, ExternalLink, HelpCircle, Layers, Check
} from 'lucide-react';

export default function ShopPage({ onAddLog }) {
  const navigate = useNavigate();
  // Conversational state
  const [messages, setMessages] = useState([]);
  const [requirements, setRequirements] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasFinishedQuestions, setHasFinishedQuestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingMemory, setIsUpdatingMemory] = useState(false);

  // A2A RFP & Evaluated Offers State
  const [rfpData, setRfpData] = useState(null);
  const [evaluatedOffers, setEvaluatedOffers] = useState([]);
  const [recommendedPick, setRecommendedPick] = useState(null);
  const [hasBroadcastRfp, setHasBroadcastRfp] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [offersFilter, setOffersFilter] = useState('ALL'); // 'ALL', 'PASS', 'BLOCKED'

  // Graceful failure notification banner
  const [gracefulAlert, setGracefulAlert] = useState(null);

  // Modals state
  const [modalType, setModalType] = useState(null); // 'explain', 'compare', 'ask', 'crossSell', 'checkout', 'negotiate', 'tradeOff', 'passport'
  const [activeOffer, setActiveOffer] = useState(null);
  const [selectedMerchantPassport, setSelectedMerchantPassport] = useState(null);
  const [orderPayload, setOrderPayload] = useState(null);

  const logStep = (stage, message, detail = null) => {
    if (onAddLog) {
      onAddLog({
        stage,
        message,
        detail,
        time: new Date().toLocaleTimeString()
      });
    }
  };

  // 1. Handle user's initial natural query or prompt click
  const handleInitialPrompt = async (promptText) => {
    setIsLoading(true);
    setGracefulAlert(null);
    logStep('Intent Extraction', `Customer intent received: "${promptText}"`);

    setMessages([{ sender: 'user', text: promptText }]);

    try {
      const intentRes = await aiService.parseIntent(promptText);
      const parsedIntent = intentRes.intent;

      logStep('Requirements Extracted', 'Hard and soft constraints parsed from customer prompt', parsedIntent);
      setRequirements(parsedIntent);

      const qRes = await aiService.getQuestions(parsedIntent.category);
      const fetchedQuestions = qRes.questions || [];
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setHasFinishedQuestions(false);

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Great! I'll help you find what truly fits. Let me refine your requirements with a few quick questions.`
        }
      ]);

      logStep('Questions Selected', `Dynamic questionnaire loaded for ${parsedIntent.category}`);
    } catch (err) {
      console.error('Error in initial prompt:', err);
      const defaultReqs = { category: 'laptop', budget: 70000, primaryUse: 'coding', priority: 'performance', ram: '16GB', delivery: 'express' };
      setRequirements(defaultReqs);
      broadcastRfpToMerchants(defaultReqs);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle answering a dynamic question
  const handleAnswerQuestion = async (field, value, label) => {
    const updatedReqs = { ...requirements, [field]: value };
    setRequirements(updatedReqs);

    logStep('Memory Update', `Requirement recorded: [${field}] = ${value} (${label || value})`);

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: label || String(value) }
    ]);

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setHasFinishedQuestions(true);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Thank you! I am broadcasting your RFP across the A2A Merchant Grid to discover, evaluate, and negotiate verified offers.`
        }
      ]);

      broadcastRfpToMerchants(updatedReqs);
    }
  };

  // 3. Broadcast RFP to 5 merchants & evaluate 10 offers
  const broadcastRfpToMerchants = async (reqs) => {
    setIsBroadcasting(true);
    logStep('RFP Broadcast', 'Broadcasting RFP to 5 Connected Merchant Agents across A2A Protocol v2.1', reqs);

    try {
      const res = await aiService.broadcastRfp(reqs);
      setRfpData(res);
      setEvaluatedOffers(res.evaluatedOffers || []);
      setRecommendedPick(res.recommendedPick || null);
      setHasBroadcastRfp(true);

      logStep('Policy Engine Evaluation', `Evaluated ${res.totalOffersEvaluated || 10} offers: ${res.passedPolicyCount || 6} passed hard policies, ${res.blockedPolicyCount || 4} blocked due to budget cap.`);
      logStep('Buyer Agent Recommendation', `Selected top candidate: ${res.recommendedPick?.productName || 'Dell Inspiron 15 Pro'} by ${res.recommendedPick?.merchant || 'TechNova Solutions'} with Utility Score ${res.recommendedPick?.aiUtilityScore || 92}/100.`);
    } catch (err) {
      console.error('Error broadcasting RFP:', err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // 4. Handle free-form follow-up input in chat
  const handleFreeMessage = async (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setIsLoading(true);

    logStep('Follow-up Inquiry', `Customer follow-up inquiry: "${text}"`);

    // Check if answering an active question during the survey
    if (questions.length > 0 && currentQuestionIndex < questions.length && !hasFinishedQuestions) {
      const currentQ = questions[currentQuestionIndex];
      handleAnswerQuestion(currentQ.field, text, text);
      setIsLoading(false);
      return;
    }

    // Call backend follow-up engine
    try {
      const activeProdId = recommendedPick?.id || 'offer_01';
      const followUpRes = await aiService.askFollowUp(activeProdId, text, requirements);

      // Check if user changed an important requirement (e.g. "What if I increase my budget to â‚¹80,000?")
      if (followUpRes.isRequirementChange) {
        const updatedReqs = { ...requirements, [followUpRes.field]: followUpRes.value };
        setRequirements(updatedReqs);

        logStep('Dynamic Recalibration', `Customer adjusted requirement via chat: [${followUpRes.field}] = ${followUpRes.value}`);

        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: followUpRes.answer }
        ]);

        // Live recalibrate & rebroadcast RFP
        broadcastRfpToMerchants(updatedReqs);
        return;
      }

      // Check for graceful failure (e.g. Delivery tomorrow failure)
      if (followUpRes.isDeliveryFailure) {
        setGracefulAlert({
          message: followUpRes.answer,
          actionLabel: followUpRes.actionLabel || 'View Next-Day Alternatives',
          onAction: () => {
            const updated = { ...requirements, delivery: 'express' };
            setRequirements(updated);
            broadcastRfpToMerchants(updated);
            setGracefulAlert(null);
          }
        });

        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: followUpRes.answer }
        ]);
        return;
      }

      // Standard follow-up response
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: followUpRes.answer }
      ]);
    } catch (err) {
      console.error('Follow up error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `I've noted your question: "${text}". Feel free to edit requirements above or explore evaluated offers.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Update requirements memory chip directly (HERO FEATURE)
  const handleUpdateRequirement = async (field, value) => {
    setIsUpdatingMemory(true);
    const updated = { ...requirements, [field]: value };
    setRequirements(updated);

    logStep('Memory Recalibrated', `Live requirement adjusted: [${field}] = ${value}`, updated);

    try {
      await broadcastRfpToMerchants(updated);
    } catch (err) {
      console.error('Error updating requirement:', err);
    } finally {
      setIsUpdatingMemory(false);
    }
  };

  // Open Merchant Passport Modal
  const handleOpenMerchantPassport = async (merchantId = 'merch_technova') => {
    try {
      const res = await merchantService.getMerchantPassport(merchantId);
      setSelectedMerchantPassport(res.passport);
      setModalType('passport');
    } catch (err) {
      console.error('Failed to load merchant passport:', err);
    }
  };

  // Trigger Demo Scenarios
  const triggerDemoScenario = (scenario) => {
    if (scenario === 'payment_failure') {
      const order = {
        product: recommendedPick || evaluatedOffers[0],
        total: recommendedPick?.finalTotal || 67610,
        simulateFailure: true
      };
      setOrderPayload(order);
      setModalType('checkout');
    } else if (scenario === 'budget_exceeded') {
      handleUpdateRequirement('budget', 55000);
    } else if (scenario === 'max_concession') {
      setActiveOffer(recommendedPick || evaluatedOffers[0]);
      setModalType('negotiate');
    }
  };

  // Filtered Offers List
  const displayOffers = evaluatedOffers.filter(offer => {
    if (offersFilter === 'PASS') return offer.policyCheck.status === 'PASS';
    if (offersFilter === 'BLOCKED') return offer.policyCheck.status !== 'PASS';
    return true;
  });

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Sticky/Visible Requirements Memory Bar (Hero Feature) */}
        {hasBroadcastRfp || Object.keys(requirements).length > 0 ? (
          <div className="mb-6 sticky top-20 z-30 shadow-xs">
            <RequirementsMemory
              requirements={requirements}
              onUpdateRequirement={handleUpdateRequirement}
              isUpdating={isUpdatingMemory}
            />
          </div>
        ) : null}

        {/* Graceful Failure Notification Banner */}
        {gracefulAlert && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  Graceful Failure Recovery
                </span>
                <p className="text-xs text-amber-900 mt-0.5 leading-relaxed font-medium">
                  {gracefulAlert.message}
                </p>
              </div>
            </div>
            <button
              onClick={gracefulAlert.onAction}
              className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{gracefulAlert.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Conversational Q/A Flow */}
        <div className="max-w-3xl mx-auto">
          <ConversationalFlow
            messages={messages}
            currentQuestion={currentQ}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onSendMessage={messages.length === 0 ? handleInitialPrompt : handleFreeMessage}
            onSelectOption={handleAnswerQuestion}
            isLoading={isLoading || isBroadcasting}
            hasFinishedQuestions={hasFinishedQuestions}
          />
        </div>

        {/* A2A Evaluated Offers & Recommended Pick Section */}
        {hasBroadcastRfp && (
          <div className="mt-12 pt-8 border-t border-slate-200/80 animate-fade-in space-y-10">

            {/* 1. HERO BANNER: Buyer Agent Recommended Pick */}
            {recommendedPick && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-900/50 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                  {/* Left Product Image & Title */}
                  <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
                    <div className="relative w-full sm:w-44 h-44 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                      <img
                        src={recommendedPick.image}
                        alt={recommendedPick.productName}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md">
                        Top AI Match
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Buyer Agent Recommended Pick</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          Utility Score: {recommendedPick.aiUtilityScore}/100
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
                          Risk: {recommendedPick.riskAssessment}
                        </span>
                      </div>

                      {/* Title & Merchant */}
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {recommendedPick.productName}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="font-semibold text-sky-300 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-sky-400" />
                          {recommendedPick.merchant}
                        </span>
                        <span>â€¢</span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {recommendedPick.merchantRating} / 5.0
                        </span>
                        <span>â€¢</span>
                        <span className="text-emerald-300 font-semibold flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          {recommendedPick.deliveryTime}
                        </span>
                      </div>

                      {/* Specs Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[11px] bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-md border border-slate-700">
                          {recommendedPick.specs?.processor}
                        </span>
                        <span className="text-[11px] bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-md border border-slate-700">
                          {recommendedPick.specs?.ram}
                        </span>
                        <span className="text-[11px] bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-md border border-slate-700">
                          {recommendedPick.specs?.storage}
                        </span>
                      </div>

                      {/* Bundled Benefits Callout */}
                      {recommendedPick.freeBundles && (
                        <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5 pt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Includes free: {recommendedPick.freeBundles.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Price & Authoritative Action Box */}
                  <div className="lg:text-right space-y-3 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 line-through block">
                        Original: â‚¹{recommendedPick.originalPrice?.toLocaleString('en-IN')}
                      </span>
                      <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                        â‚¹{recommendedPick.finalTotal?.toLocaleString('en-IN')}
                      </div>
                      <span className="text-xs font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full inline-block mt-1">
                        Total Saved: â‚¹{recommendedPick.negotiatedDiscount?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <button
                        onClick={() => {
                          setActiveOffer({
                            ...recommendedPick,
                            name: recommendedPick.name || recommendedPick.productName,
                            price: recommendedPick.price || recommendedPick.finalTotal
                          });
                          setModalType('ask');
                        }}
                        className="px-5 py-2.5 bg-sky-600/90 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-sky-500/50 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-sky-200" />
                        <span>Ask NEXA</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveOffer(recommendedPick);
                          setModalType('crossSell');
                        }}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Complete Your Setup</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveOffer(recommendedPick);
                          setModalType('negotiate');
                        }}
                        className="px-5 py-2.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-indigo-500/50 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Run Bounded Negotiation</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* WHY NEXA RECOMMENDS THIS OFFER Expandable / Callout */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why NEXA Recommends This Offer</span>
                    </span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-3xl">
                      {recommendedPick.whyNexaRecommends}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setModalType('tradeOff')}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                    >
                      <Layers className="w-3.5 h-3.5 text-sky-300" />
                      <span>Trade-Off Matrix</span>
                    </button>
                    <button
                      onClick={() => handleOpenMerchantPassport(recommendedPick.merchantId)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Merchant Passport</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Controls & Filter Bar for 10 Offers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-1 border border-sky-200">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span>A2A RFP Broadcast & Telemetry</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Evaluated Merchant Offers ({evaluatedOffers.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Autonomous policy engine evaluation across 5 verified merchants in the connected grid.
                </p>
              </div>

              {/* Filter Pills & Matrix Button */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setOffersFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      offersFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({evaluatedOffers.length})
                  </button>
                  <button
                    onClick={() => setOffersFilter('PASS')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      offersFilter === 'PASS' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Passed Policy ({evaluatedOffers.filter(o => o.policyCheck.status === 'PASS').length})
                  </button>
                  <button
                    onClick={() => setOffersFilter('BLOCKED')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      offersFilter === 'BLOCKED' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Policy Blocked ({evaluatedOffers.filter(o => o.policyCheck.status !== 'PASS').length})
                  </button>
                </div>

                <button
                  onClick={() => setModalType('tradeOff')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare in Trade-Off Matrix</span>
                </button>
              </div>
            </div>

            {/* 3. Grid of 10 Evaluated Merchant Offers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayOffers.map((offer, idx) => {
                const isPassed = offer.policyCheck.status === 'PASS';
                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-2xs hover:shadow-xl ${
                      isPassed ? 'border-slate-200/90 hover:border-sky-400' : 'border-rose-200/80 bg-rose-50/10'
                    }`}
                  >
                    {/* Top Status & Highlight Badges */}
                    <div className="p-5 pb-3">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {offer.isBestOverallValue && (
                            <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase">
                              Best Overall Value
                            </span>
                          )}
                          {offer.isLowestPrice && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                              Lowest Price
                            </span>
                          )}
                          {offer.isFastestDelivery && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                              Fastest Delivery
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-extrabold">
                            {offer.aiUtilityScore}/100
                          </span>
                        </div>
                      </div>

                      {/* Product Image & Title */}
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-100 mb-3.5 border border-slate-100">
                        <img
                          src={offer.image}
                          alt={offer.productName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {offer.negotiatedDiscount > 0 && (
                          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            Save â‚¹{offer.negotiatedDiscount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Merchant Name & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <button
                          onClick={() => handleOpenMerchantPassport(offer.merchantId)}
                          className="font-bold text-slate-700 hover:text-sky-600 flex items-center gap-1 transition-colors cursor-pointer truncate max-w-[65%]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{offer.merchant}</span>
                        </button>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{offer.merchantRating}</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-1">
                        {offer.productName}
                      </h4>

                      {/* Price & Delivery */}
                      <div className="mt-2 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-slate-900">
                            â‚¹{offer.finalTotal.toLocaleString('en-IN')}
                          </span>
                          {offer.originalPrice > offer.finalTotal && (
                            <span className="text-xs text-slate-400 line-through">
                              â‚¹{offer.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          {offer.deliveryTime}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {offer.specs?.processor}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {offer.specs?.ram}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {offer.specs?.storage}
                        </span>
                      </div>

                      {/* Policy Check Status Tag (Hero Security Feature) */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <div className={`p-2 rounded-xl text-xs font-semibold flex items-start gap-1.5 border ${
                          isPassed
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}>
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <span className="text-[11px] leading-tight">
                            {offer.policyCheck.reason}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                      <button
                        onClick={() => {
                          navigate('/product-details', { state: { product: offer, requirements } });
                        }}
                        disabled={!isPassed}
                        className={`w-full py-2.5 px-3 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                          isPassed
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{isPassed ? 'Select This Offer' : 'Policy Blocked'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            setActiveOffer(offer);
                            setModalType('negotiate');
                          }}
                          className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>Negotiate</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveOffer(offer);
                            setModalType('explain');
                          }}
                          className="py-1.5 px-2 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:text-sky-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-3 h-3 text-sky-500" />
                          <span>Why This?</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. Demo Scenarios Action Strip */}
            <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Agentic Commerce Demo Failure & Policy Controls</span>
                </span>
                <p className="text-xs text-slate-600">
                  Simulate real-world financial failure edge cases, budget blocks, and 3-round negotiation constraints.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerDemoScenario('payment_failure')}
                  className="px-3.5 py-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo: Payment Failure Recovery</span>
                </button>

                <button
                  onClick={() => triggerDemoScenario('budget_exceeded')}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Demo: Budget Policy Block</span>
                </button>

                <button
                  onClick={() => triggerDemoScenario('max_concession')}
                  className="px-3.5 py-2 bg-white hover:bg-purple-50 border border-purple-300 text-purple-900 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Demo: Max Concession Boundary</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Bounded Negotiation Modal */}
      {modalType === 'negotiate' && (
        <BoundedNegotiationModal
          offer={activeOffer || recommendedPick}
          requirements={requirements}
          onClose={() => setModalType(null)}
          onNegotiationComplete={(negotiatedResult) => {
            logStep('Negotiation Agreement', 'A2A Bounded Negotiation finalized within policy bounds', negotiatedResult);
            setActiveOffer({
              ...(activeOffer || recommendedPick),
              finalTotal: negotiatedResult.authoritativeFinalTotal,
              negotiatedDiscount: negotiatedResult.totalSavings
            });
            setModalType('crossSell');
          }}
        />
      )}

      {/* 2. Trade-Off Matrix Modal */}
      {modalType === 'tradeOff' && (
        <TradeOffMatrix
          offers={evaluatedOffers}
          onSelectOffer={(offer) => {
            setModalType(null);
            navigate('/product-details', { state: { product: offer, requirements } });
          }}
          onClose={() => setModalType(null)}
        />
      )}

      {/* 3. AI Commerce Passport Modal */}
      {modalType === 'passport' && selectedMerchantPassport && (
        <CommercePassportModal
          merchant={selectedMerchantPassport}
          onClose={() => setModalType(null)}
        />
      )}

      {/* 4. Complete Your Setup (Cross-Sell) Modal */}
      {modalType === 'crossSell' && (
        <CrossSellModal
          product={activeOffer || recommendedPick}
          requirements={requirements}
          onClose={() => setModalType(null)}
          onProceedToCheckout={(order) => {
            setOrderPayload(order);
            setModalType('checkout');
            logStep('Customer Approved Order', 'Customer approved companion bundle and authorized purchase', order);
          }}
        />
      )}

      {/* 5. Razorpay Checkout & Customer Authorization Modal */}
      {modalType === 'checkout' && (
        <CheckoutModal
          orderData={orderPayload}
          requirements={requirements}
          onClose={() => setModalType(null)}
          onOrderSuccess={() => {
            logStep('Razorpay Settlement Success', 'Payment captured and settled via Razorpay Test Gateway');
          }}
        />
      )}

      {/* 6. Explainability Modal */}
      {modalType === 'explain' && (
        <ExplainabilityModal
          product={activeOffer || recommendedPick}
          requirements={requirements}
          onClose={() => setModalType(null)}
          onSelectProduct={(product) => {
            setActiveOffer(product);
            setModalType('crossSell');
          }}
        />
      )}

      {/* 7. Product Follow-Up Chat Modal */}
      {modalType === 'ask' && (
        <ProductFollowUpChat
          product={activeOffer || recommendedPick}
          requirements={requirements}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
