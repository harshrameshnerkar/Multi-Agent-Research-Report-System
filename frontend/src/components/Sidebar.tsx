import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  FileText,
  Database,
  BarChart3,
  Sliders,
  ShieldCheck,
  Bot,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu,
  Workflow
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const mainNav = [
    { to: '/workspace', label: 'Research Workspace', icon: Zap, highlight: true },
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { to: '/history', label: 'Dossiers & History', icon: FileText },
    { to: '/sources', label: 'Domain Credibility', icon: Database },
  ];

  const secondaryNav = [
    { to: '/analytics', label: 'Telemetry & Costs', icon: BarChart3 },
    { to: '/settings', label: 'Model Settings', icon: Sliders },
    { to: '/admin', label: 'Swarm Diagnostics', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-dark-900/60 backdrop-blur-2xl flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none">
      
      {/* Navigation Groups */}
      <div className="space-y-6">
        
        {/* Core Intelligence Group */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5 font-mono">
            Agent Intelligence
          </p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-gradient-to-r from-brand-600/25 to-brand-500/10 text-white border border-brand-500/40 shadow-sm shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${item.highlight ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.highlight && (
                    <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider rounded bg-brand-500/30 text-brand-200 border border-brand-500/40">
                      Core
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Infrastructure & Settings */}
        <div>
          <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5 font-mono">
            Platform & Engine
          </p>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-to-r from-brand-600/25 to-brand-500/10 text-white border border-brand-500/40 shadow-sm shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live LangGraph Swarm Status Card */}
        <div className="p-4 rounded-2xl bg-dark-950/90 border border-white/10 space-y-2.5 shadow-xl glass-panel relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-brand-500/15 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Workflow className="h-3.5 w-3.5 text-cyan-400" />
              StateGraph v0.2
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
              CYCLIC
            </span>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed">
            9 Autonomous Agents active with checkpoint memory & human verification loops.
          </p>

          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-1.5 flex-1 rounded-full bg-brand-500 shadow-sm shadow-brand-500/50" />
            <div className="h-1.5 flex-1 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <div className="h-1.5 flex-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </div>
        </div>

      </div>

      {/* Footer Docs Link */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <a
          href="/docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-brand-500/30 rounded-xl transition-all group"
        >
          <span className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-brand-400 group-hover:scale-110 transition-transform" />
            <span>FastAPI OpenAPI Specs</span>
          </span>
          <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-brand-300" />
        </a>

        <div className="text-[10px] text-slate-400 font-mono text-center">
          NexusResearch AI Architecture © 2026
        </div>
      </div>

    </aside>
  );
};
