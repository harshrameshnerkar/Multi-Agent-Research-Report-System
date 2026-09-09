import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Zap, 
  Bot, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  ExternalLink,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { user, logout, loginDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/dashboard') return 'Dashboard';
    if (p === '/workspace') return 'Research Workspace';
    if (p.startsWith('/execution')) return 'Live Agent Swarm';
    if (p.startsWith('/report')) return 'Strategic Dossier';
    if (p === '/history') return 'Reports Library';
    if (p === '/sources') return 'Domain Credibility';
    if (p === '/analytics') return 'Telemetry & Costs';
    if (p === '/settings') return 'Model Settings';
    if (p === '/admin') return 'Swarm Admin';
    return '';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/50 transition-all duration-300">
              <div className="h-full w-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-brand-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">NexusResearch</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono -mt-0.5 hidden sm:block">Autonomous Multi-Agent Intelligence</p>
            </div>
          </Link>

          {/* Breadcrumb Trail */}
          {!isLanding && pageTitle && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10 text-xs font-medium text-slate-400">
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-slate-200">{pageTitle}</span>
            </div>
          )}
        </div>

        {/* Global Quick Search / Command Palette Trigger */}
        {!isLanding && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 text-xs text-slate-400 bg-slate-900/90 border border-white/10 rounded-xl hover:border-brand-500/40 hover:text-slate-200 transition-all shadow-inner group"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
            <span className="font-sans">Search topics, agents & reports...</span>
            <kbd className="ml-3 px-1.5 py-0.5 text-[10px] bg-slate-950 border border-white/10 rounded-md text-slate-300 font-mono shadow-sm">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          
          {/* Swarm Live Heartbeat Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 shadow-sm shadow-emerald-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-semibold">9 Agents Online</span>
          </div>

          {/* Quick Launch CTA */}
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all scale-100 hover:scale-[1.02]"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>New Research</span>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600/30 to-cyan-500/30 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-brand-200 shadow-inner">
                {user.full_name?.charAt(0) || 'A'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight line-clamp-1">{user.full_name || 'AI Architect'}</p>
                <p className="text-[10px] text-slate-400 font-mono capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={loginDemo}
              className="text-xs px-3 py-1.5 rounded-xl border border-brand-500/30 text-brand-300 hover:bg-brand-500/10 transition-colors font-semibold"
            >
              Demo Access
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
