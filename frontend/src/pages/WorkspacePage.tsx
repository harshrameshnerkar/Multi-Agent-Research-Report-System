import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Zap, 
  Sparkles, 
  Sliders, 
  UploadCloud, 
  Globe, 
  BookOpen, 
  Layers, 
  Cpu, 
  Tag, 
  X, 
  FileText, 
  AlertCircle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Info
} from 'lucide-react';
import { VoiceInput } from '../components/VoiceInput';
import { researchApi, filesApi } from '../services/api';
import { ResearchOptions } from '../types';

export const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState<'quick' | 'standard' | 'deep' | 'comprehensive'>('standard');
  const [modelProvider, setModelProvider] = useState<'claude' | 'openai' | 'gemini' | 'deepseek' | 'simulation'>('simulation');
  const [language, setLanguage] = useState('English');
  const [citationStyle, setCitationStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Markdown Links'>('APA');
  
  const [focusAreaInput, setFocusAreaInput] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; filename: string; size: number }>>([]);
  const [uploading, setUploading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);

  useEffect(() => {
    const initialTopic = searchParams.get('topic');
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [searchParams]);

  const presetTopics = [
    { title: "India's Semiconductor Industry & FAB Ecosystem 2026", cat: "Deep Tech", tag: "Strategic" },
    { title: "Autonomous AI Agents vs RAG Architectures: Performance & Scalability", cat: "AI Engineering", tag: "Benchmark" },
    { title: "Artificial Intelligence in Healthcare: Diagnostics & Clinical Trials", cat: "Biotech", tag: "Clinical" },
    { title: "Tesla Financial Analysis & Autonomous Robotics Roadmap", cat: "Finance", tag: "Valuation" },
    { title: "Quantum Computing: Fault-Tolerant Hardware & Quantum Supremacy", cat: "Physics", tag: "Frontier" }
  ];

  const handleAddFocusArea = () => {
    if (focusAreaInput.trim() && !focusAreas.includes(focusAreaInput.trim())) {
      setFocusAreas([...focusAreas, focusAreaInput.trim()]);
      setFocusAreaInput('');
    }
  };

  const handleRemoveFocusArea = (tag: string) => {
    setFocusAreas(focusAreas.filter(t => t !== tag));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const res = await filesApi.upload(file);
        setUploadedFiles(prev => [...prev, { id: res.id, filename: res.filename, size: res.file_size }]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleStartResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a research topic or select a preset.');
      return;
    }

    setLaunching(true);
    setError(null);

    const options: ResearchOptions = {
      depth,
      language,
      citation_style: citationStyle,
      model_provider: modelProvider,
      focus_areas: focusAreas,
      uploaded_file_ids: uploadedFiles.map(f => f.id),
      include_uploaded_files: uploadedFiles.length > 0,
      temperature,
      max_tokens: maxTokens,
    };

    try {
      const project = await researchApi.start(topic, options);
      navigate(`/execution/${project.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initialize multi-agent research workflow');
      setLaunching(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Autonomous Agentic Research Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Configure & Launch Research Swarm
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Define your target inquiry, customize multi-agent depth parameters, attach private reference documents, and let the 9 LangGraph agents autonomously execute the research.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleStartResearch} className="space-y-8">
        
        {/* Main Research Topic Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span>Research Inquiry or Core Question</span>
              <span className="text-brand-400">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Real-time Tavily & Web Search</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              placeholder="e.g. India's Semiconductor Industry, AI Agents vs RAG, Tesla Financial Analysis..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-dark-950/90 border border-white/15 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 shadow-inner font-medium transition-all"
            />
            <VoiceInput onTranscript={(text) => setTopic(text)} />
          </div>

          {/* Presets Grid */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Preset Inquiries:</span>
            <div className="flex flex-wrap gap-2">
              {presetTopics.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTopic(p.title)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/[0.08] hover:border-brand-500/40 text-slate-300 hover:text-white text-xs transition-all shadow-sm group"
                >
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-500/20 text-brand-300">
                    {p.tag}
                  </span>
                  <span className="font-medium line-clamp-1">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Depth Level & Model Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Depth Level Selector */}
          <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-brand-400" />
                <span>Research Depth & Scrutiny Level</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Controls the number of decomposed subtasks and evidence harvesting iterations.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'quick', label: 'Quick Scan', subtasks: '4 Subtasks', sources: '~8 Sources', time: '~20s' },
                { id: 'standard', label: 'Standard Deep', subtasks: '5 Subtasks', sources: '~15 Sources', time: '~35s' },
                { id: 'deep', label: 'Rigorous Deep', subtasks: '6 Subtasks', sources: '~25 Sources', time: '~50s' },
                { id: 'comprehensive', label: '360° Comprehensive', subtasks: '8 Subtasks', sources: '~40 Sources', time: '~75s' },
              ].map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDepth(d.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    depth === d.id
                      ? 'bg-gradient-to-r from-brand-600/25 to-brand-500/10 border-brand-500/50 text-white shadow-md shadow-brand-500/15'
                      : 'bg-dark-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-slate-100">{d.label}</p>
                    {depth === d.id && <CheckCircle2 className="h-3.5 w-3.5 text-brand-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>{d.subtasks}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{d.sources}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* LLM Provider Selection */}
          <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <span>Autonomous LLM Engine</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Select your primary reasoning and synthesis provider.</p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'simulation', name: '⚡ Zero-Config Simulation Engine', desc: 'Instant demo execution, zero external API keys needed', badge: 'Active' },
                { id: 'claude', name: 'Anthropic Claude 3.5 Sonnet', desc: 'Benchmark for deep long-context reasoning & analysis', badge: 'Recommended' },
                { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Multi-modal high throughput reasoning and synthesis', badge: 'Fast' },
                { id: 'gemini', name: 'Google Gemini 2.0 Flash', desc: 'Ultra-low latency web research and citation fusion', badge: 'Low Latency' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setModelProvider(m.id as any)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    modelProvider === m.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-dark-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-100">{m.name}</p>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-300">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                  </div>
                  {modelProvider === m.id && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Citation Style, Language & Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Citation Format & Language */}
          <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Academic Formatting & Language</span>
            </h3>

            {/* Citation Style Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Bibliographic Citation Standard</label>
              <div className="grid grid-cols-3 gap-2">
                {['APA', 'MLA', 'Chicago', 'IEEE', 'Markdown Links'].map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCitationStyle(c as any)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                      citationStyle === c
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm'
                        : 'bg-dark-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Report Publication Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-dark-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="English">English</option>
                <option value="German">German (Deutsch)</option>
                <option value="French">French (Français)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>

          {/* Focus Areas & Document Ingestion */}
          <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-400" />
              <span>Target Focus Pillars (Optional)</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Market Size, Regulatory Risks, Architecture..."
                value={focusAreaInput}
                onChange={(e) => setFocusAreaInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFocusArea(); } }}
                className="w-full bg-dark-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddFocusArea}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[36px]">
              {focusAreas.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic">No custom focus areas specified (Full 360° coverage applied)</span>
              ) : (
                focusAreas.map((fa, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30"
                  >
                    {fa}
                    <button type="button" onClick={() => handleRemoveFocusArea(fa)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Private Knowledge Ingestion Dropzone */}
        <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-cyan-400" />
              <span>Attach Private Knowledge Documents (PDF, DOCX, TXT)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">ChromaDB Vector Ingestion</span>
          </div>

          <label className="block p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-brand-500/50 bg-dark-950/60 cursor-pointer text-center transition-all group">
            <UploadCloud className="h-7 w-7 text-slate-400 group-hover:text-brand-400 mx-auto mb-1.5 transition-colors" />
            <p className="text-xs text-slate-200 font-semibold">Click to upload research files or drag & drop</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, Word DOCX, Markdown & Plain Text (Auto-chunked into Vector Store)</p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploading && (
            <div className="flex items-center gap-2 text-xs text-brand-300 font-mono">
              <div className="h-3.5 w-3.5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              <span>Vectorizing and chunking document into ChromaDB...</span>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {uploadedFiles.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 text-xs text-slate-300 border border-white/10">
                  <span className="flex items-center gap-2 line-clamp-1 font-medium">
                    <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f.filename}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{Math.round(f.size / 1024)} KB</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Advanced Inference Hyperparameters */}
        <div className="rounded-3xl bg-dark-900/60 border border-white/[0.08] overflow-hidden glass-card">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-slate-400" />
              <span>Advanced Inference Settings (Sampling Temperature & Max Tokens)</span>
            </span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180 text-brand-400' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="p-6 pt-2 border-t border-white/5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Sampling Temperature</span>
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
                    <span>1.0 (Exploratory)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Max Tokens per Node</span>
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
            </div>
          )}
        </div>

        {/* Master Launch CTA */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={launching || !topic.trim()}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-brand-500/35 transition-all disabled:opacity-50 scale-100 hover:scale-[1.02] group"
          >
            <Zap className="h-5 w-5 fill-white group-hover:rotate-12 transition-transform" />
            <span>{launching ? 'Instantiating Multi-Agent StateGraph...' : 'Launch Multi-Agent Research Swarm'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
