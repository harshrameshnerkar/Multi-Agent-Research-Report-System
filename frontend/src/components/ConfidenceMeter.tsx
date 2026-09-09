import React from 'react';
import { ShieldCheck, CheckCircle, Database, Award } from 'lucide-react';

interface ConfidenceMeterProps {
  confidenceScore: number;
  factCheckScore: number;
  qualityScore: number;
  sourcesCount: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidenceScore,
  factCheckScore,
  qualityScore,
  sourcesCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-dark-900/90 border border-white/10 glass-panel shadow-lg">
      
      {/* Confidence Score */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/5">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Confidence Score</p>
          <p className="text-lg font-bold text-white">{confidenceScore}%</p>
        </div>
      </div>

      {/* Fact Check Score */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/5">
        <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
          <CheckCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Fact-Check Score</p>
          <p className="text-lg font-bold text-white">{factCheckScore}%</p>
        </div>
      </div>

      {/* Quality Score */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/5">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Editorial Quality</p>
          <p className="text-lg font-bold text-white">{qualityScore}/100</p>
        </div>
      </div>

      {/* Verified Sources */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/5">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Verified Sources</p>
          <p className="text-lg font-bold text-white">{sourcesCount} Authorities</p>
        </div>
      </div>

    </div>
  );
};
