import React, { useState } from 'react';
import { Share2, Copy, Check, Globe, Link2, X } from 'lucide-react';
import { reportsApi } from '../services/api';

interface ShareModalProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ reportId, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && !shareUrl) {
      setLoading(true);
      reportsApi.share(reportId)
        .then((res) => {
          const origin = window.location.origin;
          setShareUrl(`${origin}/share/${res.share_token}`);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, reportId, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-dark-900 border border-white/10 rounded-3xl shadow-2xl p-6 glass-panel space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share Public Report Link</h3>
              <p className="text-[11px] text-slate-400">Anyone with this link can view the read-only dossier</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Link Field */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-dark-950 border border-white/15 rounded-xl">
            <Link2 className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={loading ? 'Generating public link...' : shareUrl}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              disabled={loading || !shareUrl}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          Shared reports include verified citations, fact-check ratings, and source attributions.
        </div>

      </div>
    </div>
  );
};
