import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCw, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Sparkles,
  Search,
  ShieldCheck,
  BarChart,
  FileCheck,
  PenTool,
  BookOpen,
  Eye,
  Zap,
  Activity
} from 'lucide-react';
import { AgentExecution } from '../types';

interface AgentCardProps {
  agentName: string;
  stepNumber: number;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'retrying' | 'human_approval';
  latencyMs?: number;
  tokensUsed?: number;
  thoughtLog?: string;
  description: string;
}

const getAgentIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('orchestrator')) return Sparkles;
  if (n.includes('research')) return Search;
  if (n.includes('validator') || n.includes('source')) return ShieldCheck;
  if (n.includes('analy')) return BarChart;
  if (n.includes('fact')) return FileCheck;
  if (n.includes('writer') || n.includes('report')) return PenTool;
  if (n.includes('citation')) return BookOpen;
  if (n.includes('reviewer')) return Eye;
  return UserCheck;
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agentName,
  stepNumber,
  status,
  latencyMs,
  tokensUsed,
  thoughtLog,
  description
}) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = getAgentIcon(agentName);

  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/50 shadow-sm shadow-brand-500/30 animate-pulse">
            <RotateCw className="h-3.5 w-3.5 animate-spin text-brand-400" />
            Executing
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Complete
          </span>
        );
      case 'human_approval':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            <UserCheck className="h-3.5 w-3.5 text-amber-400" />
            Human Approval Gate
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-900 text-slate-500 border border-white/5">
            <Clock className="h-3 w-3" />
            Standby
          </span>
        );
    }
  };

  return (
    <div className={`
      rounded-3xl p-5 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden
      ${status === 'running' 
        ? 'bg-gradient-to-b from-brand-950/60 to-dark-900 border-brand-500/60 shadow-2xl shadow-brand-500/20 ring-1 ring-brand-500/40 scanline-effect' 
        : status === 'completed'
        ? 'bg-dark-900/80 border-emerald-500/20 hover:border-emerald-500/40 shadow-lg'
        : 'bg-dark-900/40 border-white/[0.06] opacity-75'
      }
    `}>
      <div className="space-y-3">
        
        {/* Top Agent Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`
              h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 transition-colors shadow-inner
              ${status === 'running'
                ? 'bg-gradient-to-tr from-brand-600/40 to-cyan-500/30 border-brand-500/60 text-brand-200 shadow-brand-500/30'
                : status === 'completed'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-950 border-white/10 text-slate-500'
              }
            `}>
              <Icon className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-white/5 font-bold">
                  Node 0{stepNumber}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 leading-tight">{agentName}</h4>
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge()}</div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed font-normal">
          {description}
        </p>

      </div>

      {/* Metrics Row */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          {latencyMs !== undefined && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" />
              <span>{latencyMs}ms</span>
            </span>
          )}
          {tokensUsed !== undefined && (
            <span className="flex items-center gap-1 text-slate-300">
              <Cpu className="h-3 w-3 text-brand-400" />
              <span>{tokensUsed} t</span>
            </span>
          )}
        </div>

        {thoughtLog && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors font-sans font-semibold"
          >
            <span>{expanded ? 'Hide Trace' : 'Inspect Trace'}</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Expandable Agent Reasoning Trace */}
      {expanded && thoughtLog && (
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 text-xs font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap animate-fadeIn shadow-inner">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-brand-400" />
            <span>Node Reasoning Trace & Output</span>
          </p>
          {thoughtLog}
        </div>
      )}

    </div>
  );
};
