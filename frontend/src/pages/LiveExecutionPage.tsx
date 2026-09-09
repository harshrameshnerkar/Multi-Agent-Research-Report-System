import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Bot, 
  RotateCw, 
  CheckCircle2, 
  FileText, 
  Network, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Terminal,
  Clock,
  Cpu,
  Activity
} from 'lucide-react';
import { AgentCard } from '../components/AgentCard';
import { LiveLogTerminal } from '../components/LiveLogTerminal';
import { MermaidViewer } from '../components/MermaidViewer';
import { HumanApprovalModal } from '../components/HumanApprovalModal';
import { researchApi } from '../services/api';
import { ResearchProject, SystemLog, AgentExecution } from '../types';

export const LiveExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ResearchProject | null>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'graph' | 'terminal'>('agents');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [progress, setProgress] = useState(5);
  const [currentStep, setCurrentStep] = useState('Initializing Multi-Agent Graph');
  const [activeAgent, setActiveAgent] = useState('Orchestrator Agent');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [draftPreview, setDraftPreview] = useState<string>('');
  const [qualityScore, setQualityScore] = useState<number>(96);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [completedReportId, setCompletedReportId] = useState<string | null>(null);

  const agentDescriptions: Record<string, string> = {
    'Orchestrator Agent': 'Deconstructs inquiry into 4-8 parallel subtasks & target domain search queries',
    'Research Agent': 'Executes parallel Tavily web search & document vector embeddings',
    'Source Validation Agent': 'Scores domain authority (0-100 Trust) across Academic, Gov & News portals',
    'Analysis Agent': 'Synthesizes quantitative metrics, trends, CAGR projections & SWOT matrix',
    'Fact Checker Agent': 'Cross-validates assertions against primary sources with confidence score',
    'Report Writer Agent': 'Generates publication-grade 10-section Markdown dossier with data tables',
    'Citation Agent': 'Standardizes citations into APA/MLA/Chicago with verified live URLs',
    'Reviewer Agent': 'Audits editorial clarity, grammatical precision, and structural flow',
    'Human Approval Node': 'Interactive gate for human-in-the-loop review and approval',
  };

  const agentSequence = [
    'Orchestrator Agent',
    'Research Agent',
    'Source Validation Agent',
    'Analysis Agent',
    'Fact Checker Agent',
    'Report Writer Agent',
    'Citation Agent',
    'Reviewer Agent',
    'Human Approval Node',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isCompleted) {
        setElapsedSeconds(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  useEffect(() => {
    if (!id) return;

    // 1. Initial Project Fetch
    researchApi.getProject(id).then((p) => {
      setProject(p);
      setProgress(p.progress_percentage || 5);
      if (p.report?.id) setCompletedReportId(p.report.id);
      if (p.logs) setLogs(p.logs);
      if (p.status === 'completed') {
        setIsCompleted(true);
      } else if (p.status === 'human_approval') {
        setShowApprovalModal(true);
      }
    }).catch(console.error);

    // 2. Subscribe to Real-Time SSE Stream
    const unsubscribe = researchApi.subscribeEvents(id, (event) => {
      const data = event.data;
      
      if (event.type === 'status') {
        setProgress(data.progress || progress);
        setCurrentStep(data.current_step || currentStep);
        if (data.agent) setActiveAgent(data.agent);
      }

      if (event.type === 'node_complete') {
        setProgress(data.progress || progress);
        setCurrentStep(data.current_step || currentStep);
        if (data.node) setActiveAgent(data.node);
        
        if (data.logs && Array.isArray(data.logs)) {
          setLogs((prev) => [...prev, ...data.logs.map((l: any) => ({ ...l, id: Math.random().toString(), created_at: new Date().toLocaleTimeString() }))]);
        }

        if (data.state_snapshot?.draft_preview) {
          setDraftPreview(data.state_snapshot.draft_preview);
        }
        if (data.state_snapshot?.quality_score) {
          setQualityScore(data.state_snapshot.quality_score);
        }
      }

      if (event.type === 'human_approval_required') {
        setShowApprovalModal(true);
        if (data.draft_report) setDraftPreview(data.draft_report);
        if (data.quality_score) setQualityScore(data.quality_score);
      }

      if (event.type === 'workflow_complete') {
        setProgress(100);
        setIsCompleted(true);
        setShowApprovalModal(false);
        if (data.report_id) {
          setCompletedReportId(data.report_id);
        }
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setLoadingAction(true);
    try {
      await researchApi.approve(id);
      setShowApprovalModal(false);
      setIsCompleted(true);
      confetti({ particleCount: 140, spread: 80 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRewrite = async (feedback: string) => {
    if (!id) return;
    setLoadingAction(true);
    try {
      await researchApi.requestRewrite(id, feedback);
      setShowApprovalModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setLoadingAction(true);
    try {
      await researchApi.reject(id);
      setShowApprovalModal(false);
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  const getAgentStatus = (name: string, index: number): 'idle' | 'running' | 'completed' | 'failed' | 'retrying' | 'human_approval' => {
    const activeIndex = agentSequence.findIndex(a => a.toLowerCase().includes(activeAgent.toLowerCase()) || activeAgent.toLowerCase().includes(a.toLowerCase()));
    
    if (isCompleted) return 'completed';
    if (showApprovalModal && index === 8) return 'human_approval';
    if (index < activeIndex || (activeIndex === -1 && progress > (index + 1) * 11)) return 'completed';
    if (index === activeIndex) return 'running';
    return 'idle';
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Command Center Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-dark-900/85 border border-white/10 glass-panel shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-2 shadow-sm">
                {!isCompleted ? <RotateCw className="h-3.5 w-3.5 animate-spin text-brand-400" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isCompleted ? 'Research Swarm Completed' : 'Multi-Agent Swarm Active'}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-white/5 font-mono text-[11px]">
                ID: {id?.substring(0, 8)}
              </span>

              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-white/5 font-mono text-[11px]">
                <Clock className="h-3 w-3 text-slate-500" />
                <span>Elapsed: {elapsedSeconds}s</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {project?.topic || project?.title || 'Autonomous Multi-Agent Research Swarm'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
              <span>Active Agent Step:</span>
              <span className="text-brand-300 font-bold bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-500/30">
                {currentStep}
              </span>
            </p>
          </div>

          {/* Action on Complete */}
          {isCompleted && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  const targetId = completedReportId || project?.report?.id || id;
                  if (targetId) {
                    window.open(`/api/reports/${targetId}/export/docx`, '_blank');
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 font-bold text-xs transition-all shadow-lg shadow-blue-500/10"
              >
                <FileText className="h-4 w-4 text-blue-400" />
                <span>Download .DOCX</span>
              </button>

              <button
                onClick={() => navigate(`/report/${completedReportId || project?.report?.id || project?.id}`)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 transition-all scale-100 hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                <span>Read Strategic Dossier</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Global Progress Meter */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-mono text-slate-300 font-semibold">
            <span>Graph Execution Progress</span>
            <span className="text-brand-300 font-bold">{progress}% Complete</span>
          </div>
          
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-brand-500/40 relative"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Execution Tabs Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'agents'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white bg-dark-900 border border-white/5'
              }`}
            >
              <Bot className="h-4 w-4" />
              <span>9 Autonomous Agents Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'graph'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white bg-dark-900 border border-white/5'
              }`}
            >
              <Network className="h-4 w-4" />
              <span>LangGraph Visual Topology</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'terminal'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white bg-dark-900 border border-white/5'
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>Streaming Log Terminal ({logs.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 9 Agent Cards */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
            {agentSequence.map((agentName, idx) => (
              <AgentCard
                key={idx}
                agentName={agentName}
                stepNumber={idx + 1}
                status={getAgentStatus(agentName, idx)}
                description={agentDescriptions[agentName]}
                latencyMs={idx < 5 ? 780 : 1450}
                tokensUsed={idx < 5 ? 680 : 2200}
                thoughtLog={`[${agentName}] Node execution completed. State serialized to LangGraph checkpoint memory. Validated output emitted to StateGraph.`}
              />
            ))}
          </div>
        )}

        {/* Tab 2: Visual Mermaid Graph Topology */}
        {activeTab === 'graph' && (
          <div className="rounded-3xl bg-dark-900/80 border border-white/10 glass-panel shadow-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-400" />
                <span>Cyclic StateGraph Visual Architecture</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Active Node: {activeAgent}</span>
            </div>
            <MermaidViewer activeNode={activeAgent} />
          </div>
        )}

        {/* Tab 3: Terminal */}
        {activeTab === 'terminal' && (
          <div className="animate-fadeIn">
            <LiveLogTerminal logs={logs} />
          </div>
        )}
      </div>

      {/* Persistent Live Log Strip on Bottom if viewing agents */}
      {activeTab === 'agents' && (
        <div className="pt-2">
          <LiveLogTerminal logs={logs} />
        </div>
      )}

      {/* Human Approval Modal */}
      <HumanApprovalModal
        isOpen={showApprovalModal}
        qualityScore={qualityScore}
        draftPreview={draftPreview}
        onApprove={handleApprove}
        onRequestRewrite={handleRewrite}
        onReject={handleReject}
        loading={loadingAction}
      />

    </div>
  );
};
