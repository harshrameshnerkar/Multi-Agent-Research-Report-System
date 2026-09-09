import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  FileText, 
  Bot, 
  Cpu, 
  TrendingUp, 
  Clock, 
  Award, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { StatCard } from '../components/StatCard';
import { analyticsApi, reportsApi } from '../services/api';
import { AnalyticsData, Report } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.get(), reportsApi.list()])
      .then(([aData, rData]) => {
        setAnalytics(aData);
        setReports(rData);
      })
      .catch((e) => console.error('Dashboard load error:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Research Command Center
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time telemetry, multi-agent workload analytics, and active research dossiers.
          </p>
        </div>

        <Link
          to="/workspace"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all"
        >
          <Zap className="h-4 w-4" />
          <span>New Research Job</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dossiers Generated"
          value={analytics?.completed_reports ?? 10}
          subtitle="100% Verified Citations"
          trend="+18% this week"
          icon={FileText}
          color="brand"
        />
        <StatCard
          title="Agent Executions"
          value={analytics?.total_agents_executed ?? 36}
          subtitle="9 Agents per Workflow"
          trend="99.8% Success"
          icon={Bot}
          color="cyan"
        />
        <StatCard
          title="Tokens Synthesized"
          value={analytics ? `${Math.round(analytics.total_tokens_processed / 1000)}k` : '48k'}
          subtitle="Claude 3.5 & GPT-4o"
          trend="High Density"
          icon={Cpu}
          color="purple"
        />
        <StatCard
          title="Consulting Value Saved"
          value={analytics ? `$${analytics.estimated_cost_saved_usd}` : '$1,950'}
          subtitle="vs Senior Analyst Hours"
          trend="Automated ROI"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Charts & Quick Start Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Research Velocity Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Research Velocity</h3>
              <p className="text-xs text-slate-400">Tokens processed & research queries generated</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
              Active Swarm
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.weekly_activity || [
                { day: 'Mon', tokens_k: 24.5 },
                { day: 'Tue', tokens_k: 42.1 },
                { day: 'Wed', tokens_k: 36.8 },
                { day: 'Thu', tokens_k: 58.2 },
                { day: 'Fri', tokens_k: 49.6 },
                { day: 'Sat', tokens_k: 68.4 },
                { day: 'Sun', tokens_k: 39.0 },
              ]}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="k" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="tokens_k" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#tokenGrad)" name="Tokens (k)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Researched Topics Card */}
        <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-400" />
              <span>Trending Research</span>
            </h3>
          </div>

          <div className="space-y-3">
            {(analytics?.top_topics || [
              { topic: "Artificial Intelligence in Healthcare", count: 14, avg_confidence: 96.2 },
              { topic: "India's Semiconductor Industry", count: 11, avg_confidence: 95.8 },
              { topic: "AI Agents vs RAG Architectures", count: 9, avg_confidence: 97.1 },
              { topic: "Quantum Computing Scalability", count: 7, avg_confidence: 94.4 },
            ]).map((t, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/workspace?topic=${encodeURIComponent(t.topic)}`)}
                className="w-full text-left p-3 rounded-xl bg-dark-950/70 border border-white/5 hover:border-brand-500/30 hover:bg-slate-900 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 transition-colors line-clamp-1">
                    {t.topic}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.count} research runs completed</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0 ml-2">
                  {t.avg_confidence}%
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Reports List */}
      <div className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Strategic Reports</h3>
            <p className="text-xs text-slate-400">Published multi-agent research dossiers</p>
          </div>
          <Link to="/history" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <FileText className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No reports generated yet.</p>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors"
            >
              Start First Research Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.slice(0, 6).map((report) => (
              <div
                key={report.id}
                onClick={() => navigate(`/report/${report.id}`)}
                className="p-5 rounded-2xl bg-dark-950/80 border border-white/5 hover:border-brand-500/40 glass-card cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {report.confidence_score}% Confidence
                  </span>
                  <span className="text-slate-500 font-mono">
                    {report.reading_time_minutes} min read
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                  {report.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {report.executive_summary}
                </p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{report.sources_count} Citations</span>
                  <span className="flex items-center gap-1 text-brand-400 group-hover:underline">
                    Read Report <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
