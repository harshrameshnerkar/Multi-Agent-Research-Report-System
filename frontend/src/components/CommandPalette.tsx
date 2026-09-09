import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Zap, 
  FileText, 
  BarChart3, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Start Research: India\'s Semiconductor Industry',
      category: 'Preset Topic',
      icon: Sparkles,
      action: () => {
        navigate('/workspace?topic=India%27s%20Semiconductor%20Industry');
        onClose();
      }
    },
    {
      title: 'Start Research: AI Agents vs RAG Architectures',
      category: 'Preset Topic',
      icon: Sparkles,
      action: () => {
        navigate('/workspace?topic=AI%20Agents%20vs%20RAG%20Architectures');
        onClose();
      }
    },
    {
      title: 'Start Research: Artificial Intelligence in Healthcare',
      category: 'Preset Topic',
      icon: Sparkles,
      action: () => {
        navigate('/workspace?topic=Artificial%20Intelligence%20in%20Healthcare');
        onClose();
      }
    },
    {
      title: 'Go to Research Workspace',
      category: 'Navigation',
      icon: Zap,
      action: () => {
        navigate('/workspace');
        onClose();
      }
    },
    {
      title: 'View Generated Reports Library',
      category: 'Navigation',
      icon: FileText,
      action: () => {
        navigate('/history');
        onClose();
      }
    },
    {
      title: 'View Token Consumption & Latency Analytics',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        navigate('/analytics');
        onClose();
      }
    },
    {
      title: 'Configure LLM Providers (Claude, GPT-4o, Gemini)',
      category: 'Settings',
      icon: Sliders,
      action: () => {
        navigate('/settings');
        onClose();
      }
    },
    {
      title: 'Inspect Swarm Health & Worker Queues',
      category: 'Admin',
      icon: ShieldCheck,
      action: () => {
        navigate('/admin');
        onClose();
      }
    },
  ];

  const filtered = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-dark-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-dark-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="h-5 w-5 text-brand-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, search topic, or navigate..."
            className="w-full bg-transparent border-none text-slate-100 text-sm focus:outline-none placeholder:text-slate-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-brand-600/20 hover:border-brand-500/30 border border-transparent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-white/10 text-brand-400 group-hover:text-brand-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-200 group-hover:text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with arrows, select with Enter</span>
          <span className="font-mono">ESC to close</span>
        </div>

      </div>
    </div>
  );
};
