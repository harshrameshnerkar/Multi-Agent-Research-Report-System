import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  Zap, 
  FileText, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Network, 
  ExternalLink,
  Code,
  Lock,
  BarChart3,
  TrendingUp,
  Search,
  BookOpen,
  Award,
  ChevronDown,
  Globe,
  Sliders,
  Check,
  X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePreviewTab, setActivePreviewTab] = useState<'semicon' | 'agents' | 'health'>('semicon');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sampleTopics = [
    { title: "India's Semiconductor Industry & FAB 2026", cat: "Deep Tech", tag: "Hot" },
    { title: "Autonomous AI Agents vs RAG Architectures", cat: "AI Engineering", tag: "Featured" },
    { title: "Artificial Intelligence in Healthcare Diagnostics", cat: "Biotech", tag: "Trending" },
    { title: "Tesla Financial Analysis & Autonomous Robotics", cat: "Finance", tag: "New" },
    { title: "Quantum Computing Scalability & Quantum Supremacy", cat: "Quantum", tag: "Popular" }
  ];

  const agentSteps = [
    { num: 1, title: '1. Orchestrator Agent', desc: 'Deconstructs topic into 4-8 parallel subtasks & multi-domain search plan', color: 'from-brand-500 to-indigo-500', latency: '650ms' },
    { num: 2, title: '2. Research Agent Swarm', desc: 'Parallel deep web search across Tavily, arXiv & vector documents', color: 'from-cyan-500 to-blue-500', latency: '1,420ms' },
    { num: 3, title: '3. Source Validation Agent', desc: 'Ranks domain credibility (.gov, .edu, Nature, IEEE) & purges spam', color: 'from-emerald-500 to-teal-500', latency: '480ms' },
    { num: 4, title: '4. Quantitative Analyzer', desc: 'Extracts market CAGR numbers, empirical statistics & SWOT matrix', color: 'from-amber-500 to-orange-500', latency: '1,150ms' },
    { num: 5, title: '5. Adversarial Fact Checker', desc: 'Cross-validates claims against primary sources & generates confidence score', color: 'from-rose-500 to-pink-500', latency: '760ms' },
    { num: 6, title: '6. Report Writer Agent', desc: 'Generates 10-section publication-grade Markdown dossier with data tables', color: 'from-purple-500 to-indigo-500', latency: '2,840ms' },
    { num: 7, title: '7. Citation Agent', desc: 'Standardizes APA, MLA, Chicago, IEEE & verified inline source links', color: 'from-blue-500 to-cyan-500', latency: '380ms' },
    { num: 8, title: '8. Editorial Reviewer Agent', desc: 'Audits grammar, logic coherence, and structural depth (0-100 score)', color: 'from-emerald-500 to-green-500', latency: '590ms' },
    { num: 9, title: '9. Human Approval Gate', desc: 'State checkpoint enabling one-click publishing or custom agent rewrites', color: 'from-amber-500 to-yellow-500', latency: 'Interactive' },
  ];

  const comparisonFeatures = [
    { feature: "Research Decomposition", traditional: "Manual keyword search", singleAgent: "Single monolithic prompt", multiAgent: "Dynamic 4–8 subtask graph orchestration" },
    { feature: "Source Verification Rigor", traditional: "Manual human check", singleAgent: "None (Hallucination prone)", multiAgent: "Adversarial 0-100 Domain Trust Validation" },
    { feature: "Quantitative & Benchmark Tables", traditional: "Hours of manual Excel entry", singleAgent: "Generic text bullets", multiAgent: "Automated empirical Markdown comparison tables" },
    { feature: "Academic Citation Integrity", traditional: "Manual copy-paste URLs", singleAgent: "Broken or invented links", multiAgent: "Standardized APA/MLA/Chicago with live URL checks" },
    { feature: "Human-in-the-Loop Revision", traditional: "N/A", singleAgent: "Restart conversation from scratch", multiAgent: "Stateful checkpoint loop with targeted agent rewrites" },
    { feature: "Multi-Format Export Readiness", traditional: "Manual formatting", singleAgent: "Plain text copy", multiAgent: "One-click PDF, Word DOCX, Markdown, HTML, JSON, CSV" },
  ];

  const faqs = [
    { q: "How does the multi-agent system differ from ChatGPT or Perplexity?", a: "Traditional LLM chats use a single prompt execution or simple search-then-answer pipeline. NexusResearch utilizes LangGraph to instantiate 9 specialized intelligent agents that execute parallel subtasks, adversarial fact-checking loops, domain credibility scoring (0-100), and a stateful human approval gate." },
    { q: "Do I need API keys to test the platform?", a: "No! The system includes a Zero-Config Smart Simulation Engine that generates authentic, data-dense, real-time research outputs out of the box so you can evaluate the complete multi-agent workflow immediately without setup friction." },
    { q: "Can I upload my own internal PDF, DOCX, or research papers?", a: "Yes. The Research Workspace includes a built-in ChromaDB vector ingestion engine. Upload your files and the Research Agent will seamlessly synthesize insights across both internal documents and live web search." },
    { q: "Which LLM models are supported?", a: "The architecture features an abstraction layer supporting Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, Google Gemini 2.0 Flash, DeepSeek-V3, and local Ollama models." }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 overflow-hidden relative selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Ambient Lighting & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-brand-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-8 shadow-lg shadow-brand-500/10 animate-fadeIn">
          <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-spin-slow" />
          <span>Next-Generation Autonomous Multi-Agent StateGraph Architecture</span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] sm:leading-[1.1]">
          Deep Autonomous Research <br className="hidden sm:block" />
          <span className="gradient-text-brand">Orchestrated by 9 AI Agents</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Input any complex inquiry. Our synchronized multi-agent swarm decomposes the topic into parallel subtasks, conducts deep literature search, fact-checks claims, standardizes academic citations, and compiles publication-grade strategic dossiers.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/workspace"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-brand-500/30 transition-all scale-100 hover:scale-105 group"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>Launch Research Swarm</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/history"
            className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-dark-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold text-sm transition-all shadow-md"
          >
            <FileText className="h-4 w-4 text-brand-400" />
            <span>Browse Sample Reports</span>
          </Link>
        </div>

        {/* Quick Launch Carousel */}
        <div className="mt-14 max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span>Trending Research Inquiries:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleTopics.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(`/workspace?topic=${encodeURIComponent(item.title)}`)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900/80 hover:bg-slate-850 border border-white/[0.08] hover:border-brand-500/40 text-slate-300 hover:text-white text-xs transition-all shadow-sm group"
              >
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-500/20 text-brand-300">
                  {item.tag}
                </span>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* 9-Agent StateGraph Architecture Pipeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-3">
            <Network className="h-3.5 w-3.5" />
            <span>LangGraph Multi-Agent Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            9 Specialized Agents in Continuous Symphony
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Every node in the graph is an autonomous specialist communicating through a shared typed state with state checkpointing, branch retries, and human authorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {agentSteps.map((agent) => (
            <div
              key={agent.num}
              className="p-6 rounded-3xl bg-dark-900/70 border border-white/[0.08] glass-card flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${agent.color} flex items-center justify-center font-black text-white text-sm shadow-md`}>
                  {agent.num}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5">
                  <span>Latency:</span>
                  <span className="text-brand-300 font-semibold">{agent.latency}</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  {agent.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {agent.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Stateful Transition</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">Verified Node</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Matrix: Traditional vs Single-Agent vs NexusResearch Swarm */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>Benchmarked Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why Multi-Agent Swarms Outperform Monolithic LLMs
          </h2>
          <p className="mt-4 text-slate-400 text-sm">
            Evaluating research quality, factual integrity, and auditability across architectures.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 glass-panel shadow-2xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-slate-300 font-semibold">
                <th className="p-4 sm:p-5">Capability Dimension</th>
                <th className="p-4 sm:p-5 text-slate-400">Traditional Search</th>
                <th className="p-4 sm:p-5 text-slate-400">Single-Agent LLM Chain</th>
                <th className="p-4 sm:p-5 text-brand-300 bg-brand-950/40 font-bold border-l border-brand-500/30">
                  NexusResearch Swarm
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0" />
                    <span>{row.feature}</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400">{row.traditional}</td>
                  <td className="p-4 sm:p-5 text-slate-400">{row.singleAgent}</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-300 bg-brand-950/20 border-l border-brand-500/20">
                    {row.multiAgent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Dossier Sample Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 font-mono">
            Publication-Grade Output Preview
          </h3>
          <h4 className="text-3xl font-black text-white tracking-tight">
            Every Dossier Includes 10 Standard Sections
          </h4>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'semicon', title: "India's Semiconductor FABs" },
            { id: 'agents', title: "AI Agents vs RAG" },
            { id: 'health', title: "AI in Clinical Diagnostics" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePreviewTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePreviewTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-dark-900 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Sample Card */}
        <div className="p-8 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-6 shadow-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Confidence: 97.2%
              </span>
              <span className="text-slate-400 font-mono">6 Peer-Reviewed Sources</span>
            </div>
            <span className="text-slate-400 font-mono">Standardized APA Citations</span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            <h5 className="text-lg font-black text-white">Executive Summary</h5>
            <p>
              This empirical dossier analyzes the technological architecture, market capitalization trajectory, and strategic roadmap for {activePreviewTab === 'semicon' ? "India's Semiconductor Industry" : activePreviewTab === 'agents' ? "Autonomous AI Agents vs RAG" : "Artificial Intelligence in Healthcare Diagnostics"}. Cross-validated across Nature Portfolio, IEEE Xplore, and official policy portals with zero detected contradictions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <p className="text-[10px] text-slate-400">CAGR Projections</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">34.8%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <p className="text-[10px] text-slate-400">Efficiency Scaling</p>
                <p className="text-base font-bold text-brand-300 mt-0.5">4.2x</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <p className="text-[10px] text-slate-400">Cost Reduction</p>
                <p className="text-base font-bold text-cyan-300 mt-0.5">58%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                <p className="text-[10px] text-slate-400">Fact-Check Score</p>
                <p className="text-base font-bold text-purple-300 mt-0.5">96.5%</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end">
            <Link
              to="/history"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
            >
              <span>View Full 10-Section Strategic Dossier</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 font-mono">
            Frequently Asked Questions
          </h3>
          <h4 className="text-3xl font-black text-white tracking-tight">
            Understanding the Multi-Agent Platform
          </h4>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-dark-900/80 border border-white/10 glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-brand-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-brand-950/80 to-dark-900 border border-brand-500/30 glass-panel shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Launch Your First Autonomous Multi-Agent Research Swarm
          </h3>
          
          <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Zero configuration needed. Jump directly into the workspace to experience real-time LangGraph agent orchestration.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/workspace"
              className="flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-brand-500/30 transition-all scale-100 hover:scale-105"
            >
              <Zap className="h-4 w-4 fill-white" />
              <span>Enter Research Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Master Footer */}
      <footer className="py-10 border-t border-white/[0.08] text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">NexusResearch AI | Enterprise Multi-Agent Deep Research Platform © 2026</p>
        <p className="text-[11px] text-slate-400">Engineered with LangGraph, FastAPI, Claude, Tavily Search, PostgreSQL & React 19</p>
      </footer>

    </div>
  );
};
