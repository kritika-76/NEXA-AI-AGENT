import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, ArrowRight, CornerDownLeft, CheckCircle2, User, Bot, HelpCircle, MessageSquare } from 'lucide-react';

export default function ConversationalFlow({
  messages,
  currentQuestion,
  questionIndex,
  totalQuestions,
  onSendMessage,
  onSelectOption,
  isLoading,
  hasFinishedQuestions
}) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    { label: 'Laptop for coding under ₹70,000', query: 'I need a laptop for coding under ₹70,000' },
    { label: 'Best headphones for travelling', query: 'Best headphones for travelling with noise cancellation' },
    { label: 'Phone with a great camera under ₹40,000', query: 'Phone with a great camera under ₹40,000' },
    { label: 'Comfortable laptop for college', query: 'Comfortable lightweight laptop for college under ₹60,000' }
  ];

  const followUpSuggestions = [
    'Is this suitable for Python and VS Code?',
    'Is there a cheaper alternative?',
    'What if I increase my budget to ₹80,000?',
    'Which one has better battery life?'
  ];

  // Auto scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentQuestion, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch (err) {
        console.log('Speech recognition not available:', err);
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInputText('I need a laptop for coding under ₹70,000');
        setIsListening(false);
      }, 1200);
    }
  };

  return (
    <div className="w-full">
      {/* 1. If no initial query yet, show Hero Conversational Prompt */}
      {messages.length === 0 ? (
        <div className="text-center py-6 sm:py-10 max-w-3xl mx-auto">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Razorpay Buildathon Track 01 — AI Agentic Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            What are you looking for?
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-xl mx-auto">
            Tell NEXA what you need. Answer a few questions, and we’ll help you find what actually fits.
          </p>

          {/* Large Hero Input Card */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 relative max-w-2xl mx-auto bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-slate-200/60 border border-slate-200/90 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. I need a laptop for coding under ₹70,000"
                className="w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
                disabled={isLoading}
                autoFocus
              />

              {/* Mic Icon */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2.5 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={isListening ? 'Listening...' : 'Use Voice Input'}
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 sm:py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                <span>Ask NEXA</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-slate-700 mr-1">Try asking:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(p.query)}
                className="text-xs font-medium text-slate-700 hover:text-sky-700 bg-slate-100/90 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/80 rounded-lg px-3 py-1.5 transition-all duration-150 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 2. Active Conversational Flow (Question by Question + Continuous Follow-up) */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm mb-6 transition-all">
          <div className="space-y-4">
            {/* Render conversation message stream */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 animate-fade-in ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-xs font-medium shadow-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* If currently asking a dynamic question */}
            {currentQuestion && !hasFinishedQuestions && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-up">
                {/* Progress Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                    Question {questionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs text-slate-700">Select an option or type below</span>
                </div>

                {/* Question Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                  {currentQuestion.question}
                </h3>

                {/* Option Chips Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectOption(currentQuestion.field, opt.value, opt.label)}
                      disabled={isLoading}
                      className="group text-left p-3 rounded-xl border border-slate-200 hover:border-sky-400 bg-slate-50/70 hover:bg-sky-50/60 transition-all duration-150 flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-sky-900">
                          {opt.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      {opt.description && (
                        <p className="text-xs text-slate-700 mt-1 leading-normal">
                          {opt.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 py-2 text-sky-600 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  NEXA is evaluating requirements and querying A2A merchant catalog...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up Quick Suggestions (Active after recommendation) */}
          {hasFinishedQuestions && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                  <span>The conversation doesn't end — Ask Follow-Up:</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to ask or type custom below</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {followUpSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSendMessage(sug)}
                    className="shrink-0 text-xs font-semibold text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up / Custom Answer Input Box */}
          <form onSubmit={handleSubmit} className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                hasFinishedQuestions
                  ? "Ask NEXA follow-up (e.g. 'Is this suitable for Python and VS Code?' or 'Is there a cheaper alternative?')..."
                  : "Type custom answer or clarify something..."
              }
              className="w-full px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-hidden"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Send response"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
