import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, CornerDownLeft, HelpCircle } from 'lucide-react';
import { aiService } from '../services/api';

export default function ProductFollowUpChat({
  product,
  requirements,
  onClose
}) {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Is this good for Python, Docker & coding?',
    'How long does the battery last in real use?',
    'Can I upgrade RAM or storage later?',
    'What warranty is included by the merchant?'
  ];

  useEffect(() => {
    if (product) {
      setMessages([
        {
          sender: 'ai',
          text: `Hi! I'm NEXA. You're asking about the **${product.name}** (₹${product.price.toLocaleString('en-IN')}). What would you like to know about its performance, battery, or real-world use?`
        }
      ]);
    }
  }, [product]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async (questionText) => {
    const q = questionText || inputQuestion;
    if (!q.trim() || loading) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await aiService.askFollowUp(product.id, q, requirements);
      setMessages(prev => [...prev, { sender: 'ai', text: res.answer }]);
    } catch (err) {
      console.error('Follow-up error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `The ${product.name} is well suited for your requirements. Let me know if you have specific hardware or delivery questions!`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[85vh] max-h-[640px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-sky-700">Ask NEXA about</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate max-w-[280px]">
                {product.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#fbfcfd]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white font-medium rounded-tr-xs shadow-2xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sky-600 animate-pulse text-xs font-medium py-1">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>NEXA is evaluating product specifications...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="font-semibold text-slate-400 shrink-0">Suggestions:</span>
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(sq)}
              className="shrink-0 px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask anything about this product..."
            className="w-full px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-hidden"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
