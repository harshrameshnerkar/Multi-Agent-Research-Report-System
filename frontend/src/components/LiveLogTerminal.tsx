import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, Filter, Trash2 } from 'lucide-react';
import { SystemLog } from '../types';

interface LiveLogTerminalProps {
  logs: SystemLog[];
}

export const LiveLogTerminal: React.FC<LiveLogTerminalProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'ALL') return true;
    return log.level === filterLevel;
  });

  const handleCopy = () => {
    const text = logs.map(l => `[${l.created_at || 'LOG'}] [${l.level}] ${l.agent_name ? `(${l.agent_name}) ` : ''}${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'WARNING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'ERROR':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-dark-950/90 overflow-hidden flex flex-col h-full shadow-2xl font-mono text-xs">
      
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Terminal className="h-4 w-4 text-brand-400" />
          <span>Live Agent Streaming Terminal</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-white/5">
            {logs.length} events
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/5 text-[10px]">
            {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filterLevel === lvl 
                    ? 'bg-brand-600 text-white font-medium' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy Logs"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 overflow-y-auto flex-1 space-y-2 min-h-[220px] max-h-[380px]">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-600 italic">
            Connecting to LangGraph agent stream...
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 leading-relaxed hover:bg-white/[0.02] p-1 rounded">
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border shrink-0 ${getLevelColor(log.level)}`}>
                {log.level}
              </span>
              {log.agent_name && (
                <span className="text-brand-300 font-semibold shrink-0">
                  [{log.agent_name}]:
                </span>
              )}
              <span className="text-slate-300 break-words flex-1">
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

    </div>
  );
};
