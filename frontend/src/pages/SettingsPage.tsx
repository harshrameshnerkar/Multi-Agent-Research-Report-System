import React, { useEffect, useState } from 'react';
import { 
  Sliders, 
  Key, 
  Cpu, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Zap,
  Info
} from 'lucide-react';
import { settingsApi } from '../services/api';
import { SystemSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [provider, setProvider] = useState('simulation');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [citationStyle, setCitationStyle] = useState('APA');
  
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    settingsApi.get().then((s) => {
      setSettings(s);
      setProvider(s.default_provider);
      setTemperature(s.temperature);
      setMaxTokens(s.max_tokens);
      setCitationStyle(s.citation_style);
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await settingsApi.update({
        default_provider: provider,
        temperature,
        max_tokens: maxTokens,
        citation_style: citationStyle,
        anthropic_api_key: anthropicKey || undefined,
        openai_api_key: openaiKey || undefined,
        gemini_api_key: geminiKey || undefined,
        tavily_api_key: tavilyKey || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            AI Model & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure default LLM providers, temperature parameters, API credentials, and citation formatting.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* LLM Provider Selection */}
        <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-brand-400" />
            <span>Primary LLM Execution Engine</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'simulation', name: 'Zero-Config Simulation Engine', desc: 'Instant demo execution, zero external API keys needed', badge: 'Fastest' },
              { id: 'claude', name: 'Anthropic Claude 3.5 Sonnet', desc: 'Industry benchmark for long-context research reasoning', badge: 'Recommended' },
              { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Multi-modal high throughput reasoning and synthesis', badge: 'High Speed' },
              { id: 'gemini', name: 'Google Gemini 2.0 Flash', desc: 'Ultra-low latency web research and citation fusion', badge: 'Low Latency' },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  provider === p.id
                    ? 'bg-brand-600/20 border-brand-500/50 text-white shadow-md shadow-brand-500/10'
                    : 'bg-dark-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-100">{p.name}</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Inference Hyperparameters */}
        <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>Inference Hyperparameters</span>
          </h3>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Sampling Temperature (Analytical Precision)</span>
              <span className="font-mono text-brand-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.0 (Strict Empirical)</span>
              <span>1.0 (Creative Exploratory)</span>
            </div>
          </div>

          {/* Max Tokens Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Max Generation Tokens</span>
              <span className="font-mono text-brand-400">{maxTokens} tokens</span>
            </div>
            <input
              type="range"
              min="1024"
              max="8192"
              step="512"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        </div>

        {/* API Credentials Card */}
        <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              <span>Custom API Credentials (Optional)</span>
            </h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Stored in secure runtime environment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Anthropic API Key</label>
              <input
                type="password"
                placeholder={settings?.has_anthropic_key ? '•••••••••••••••• (Configured)' : 'sk-ant-api03-...'}
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                className="w-full bg-dark-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">OpenAI API Key</label>
              <input
                type="password"
                placeholder={settings?.has_openai_key ? '•••••••••••••••• (Configured)' : 'sk-proj-...'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full bg-dark-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Google Gemini API Key</label>
              <input
                type="password"
                placeholder={settings?.has_gemini_key ? '•••••••••••••••• (Configured)' : 'AIzaSy...'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-dark-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tavily Search API Key</label>
              <input
                type="password"
                placeholder={settings?.has_tavily_key ? '•••••••••••••••• (Configured)' : 'tvly-...'}
                value={tavilyKey}
                onChange={(e) => setTavilyKey(e.target.value)}
                className="w-full bg-dark-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Configurations...' : 'Save System Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
