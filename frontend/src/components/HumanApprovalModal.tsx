import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  Sparkles, 
  FileText,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

interface HumanApprovalModalProps {
  isOpen: boolean;
  qualityScore: number;
  draftPreview?: string;
  onApprove: () => void;
  onRequestRewrite: (feedback: string) => void;
  onReject: () => void;
  loading?: boolean;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  qualityScore,
  draftPreview,
  onApprove,
  onRequestRewrite,
  onReject,
  loading = false
}) => {
  const [showRewriteInput, setShowRewriteInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-3xl bg-dark-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500/20 via-brand-500/10 to-transparent border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Human Approval Gate</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Graph Paused
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All 8 autonomous agents have drafted and audited the research report. Please review and authorize publication.
              </p>
            </div>
          </div>

          {/* Quality Score Gauge */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-medium">Reviewer Score</span>
            <div className="text-xl font-black text-emerald-400">{qualityScore}/100</div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <FileText className="h-4 w-4 text-brand-400" />
              <span>Draft Executive Summary & Highlights</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
              {draftPreview || "The autonomous agents have synthesized a 10-section empirical dossier with quantitative comparisons, benchmark matrices, and standardized citations."}
            </p>
          </div>

          {/* Rewrite Input Drawer */}
          {showRewriteInput && (
            <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-300">
                <MessageSquare className="h-4 w-4 text-brand-400" />
                <span>Custom Revision Instructions for Report Writer Agent:</span>
              </div>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Please deepen section 5 with more comparative benchmarks and emphasize market opportunities for 2026..."
                className="w-full bg-dark-950 border border-white/15 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRewriteInput(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onRequestRewrite(feedback)}
                  disabled={!feedback.trim() || loading}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 transition-colors"
                >
                  Submit Revision Directive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onReject}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject Draft</span>
          </button>

          <div className="flex items-center gap-3">
            {!showRewriteInput && (
              <button
                onClick={() => setShowRewriteInput(true)}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Request Rewrite</span>
              </button>
            )}

            <button
              onClick={onApprove}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all scale-100 hover:scale-[1.02]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve & Finalize Publication</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
