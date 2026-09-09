import React from 'react';
import { ExternalLink, ShieldCheck, Globe, Calendar, X } from 'lucide-react';
import { Source } from '../types';

interface SourcePanelProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({ sources, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-dark-900 border-l border-white/10 shadow-2xl p-6 overflow-y-auto glass-panel animate-slideInRight">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Verified Evidentiary Sources</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {sources.length} primary references cross-checked by Validation Agent
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Sources List */}
      <div className="space-y-4">
        {sources.map((source, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-dark-950/80 border border-white/10 hover:border-brand-500/40 transition-all space-y-2.5 group"
          >
            {/* Top row: Category & Trust Score */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {source.category}
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {source.trust_score}% Trust
              </span>
            </div>

            {/* Title & Link */}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 transition-colors flex items-start gap-1.5"
            >
              <span className="flex-1 line-clamp-2">{source.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-brand-300 mt-0.5" />
            </a>

            {/* Snippet */}
            {source.snippet && (
              <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                {source.snippet}
              </p>
            )}

            {/* Domain & Date */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {source.domain}
              </span>
              {source.published_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {source.published_date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
