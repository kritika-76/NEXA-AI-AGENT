import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShoppingBag, Network, BarChart3, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

export default function Navbar({ onToggleTrace, isTraceOpen, onResetChat }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-sky-200" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                    NEXA
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 rounded-full">
                    A2A Commerce
                  </span>
                </div>
                <span className="text-[11px] text-slate-700 font-medium hidden sm:inline">
                  Your AI Shopping Agent
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (4 Pages) */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/')
                    ? 'bg-sky-50 text-sky-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Shop with NEXA
              </Link>
              <Link
                to="/merchants"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/merchants')
                    ? 'bg-sky-50 text-sky-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Network className="w-4 h-4" />
                Merchant Network
              </Link>
              <Link
                to="/merchant-analytics"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/merchant-analytics')
                    ? 'bg-sky-50 text-sky-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Merchant Analytics
              </Link>
              <Link
                to="/audit"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive('/audit')
                    ? 'bg-sky-50 text-sky-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Audit Trail
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {location.pathname === '/' && onResetChat && (
              <button
                onClick={onResetChat}
                title="Start new shopping search"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Search</span>
              </button>
            )}

            {/* AI Reasoning Activity Button */}
            <button
              onClick={onToggleTrace}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                isTraceOpen
                  ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isTraceOpen ? 'text-purple-600 animate-spin' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">AI Activity</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar (4 Pages) */}
        <div className="grid grid-cols-4 md:hidden py-2 border-t border-slate-100 text-[11px] text-center">
          <Link
            to="/"
            className={`py-1 rounded-md flex flex-col items-center gap-0.5 ${
              isActive('/') ? 'text-sky-700 font-bold' : 'text-slate-600'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop
          </Link>
          <Link
            to="/merchants"
            className={`py-1 rounded-md flex flex-col items-center gap-0.5 ${
              isActive('/merchants') ? 'text-sky-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Network
          </Link>
          <Link
            to="/merchant-analytics"
            className={`py-1 rounded-md flex flex-col items-center gap-0.5 ${
              isActive('/merchant-analytics') ? 'text-sky-700 font-bold' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </Link>
          <Link
            to="/audit"
            className={`py-1 rounded-md flex flex-col items-center gap-0.5 ${
              isActive('/audit') ? 'text-sky-700 font-bold' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit
          </Link>
        </div>
      </div>
    </header>
  );
}
