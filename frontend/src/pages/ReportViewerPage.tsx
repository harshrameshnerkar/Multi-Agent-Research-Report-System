import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Share2, 
  Database, 
  FileText, 
  Copy, 
  Check, 
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  BookOpen,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TableOfContents } from '../components/TableOfContents';
import { MarkdownReportRenderer } from '../components/MarkdownReportRenderer';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { SourcePanel } from '../components/SourcePanel';
import { ExportModal } from '../components/ExportModal';
import { ShareModal } from '../components/ShareModal';
import { SpeechReader } from '../components/SpeechReader';
import { apiClient, reportsApi, researchApi } from '../services/api';
import { Report, Source } from '../types';

export const ReportViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    reportsApi.get(id)
      .then((r) => {
        setReport(r);
        if (r.project_id) {
          researchApi.getProject(r.project_id).then((p) => {
            if (p.sources) setSources(p.sources);
          }).catch(console.error);
        }
      })
      .catch(() => {
        researchApi.getProject(id).then((p) => {
          if (p.report) setReport(p.report);
          if (p.sources) setSources(p.sources);
        }).catch(console.error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));
        setReadingProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyMarkdown = () => {
    if (report?.full_markdown) {
      navigator.clipboard.writeText(report.full_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-slate-400 space-y-4">
        <div className="h-10 w-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-brand-500/20" />
        <p className="text-xs font-mono">Retrieving strategic research dossier...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-20 text-center text-slate-400 space-y-4 max-w-md mx-auto">
        <FileText className="h-12 w-12 mx-auto text-slate-600" />
        <h2 className="text-xl font-bold text-white">Dossier Not Found</h2>
        <p className="text-xs text-slate-400">The requested research report does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/history')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20"
        >
          Return to Reports Archive
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dossiers Archive</span>
        </button>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Audio Reader */}
          <SpeechReader text={report.full_markdown} />

          {/* Sources Drawer Toggle */}
          <button
            onClick={() => setShowSources(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-900 border border-white/10 hover:border-brand-500/40 text-xs text-slate-200 font-semibold transition-colors shadow-sm"
          >
            <Database className="h-4 w-4 text-emerald-400" />
            <span>Verified Sources ({sources.length || report.sources_count})</span>
          </button>

          {/* Copy Raw Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-900 border border-white/10 hover:border-brand-500/40 text-xs text-slate-200 font-semibold transition-colors shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-brand-400" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>

          {/* Share Public Link */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-900 border border-white/10 hover:border-brand-500/40 text-xs text-slate-200 font-semibold transition-colors shadow-sm"
          >
            <Share2 className="h-4 w-4 text-cyan-400" />
            <span>Share Link</span>
          </button>

          {/* Quick Word DOCX Download */}
          <button
            onClick={() => {
              if (report?.id) {
                const url = `/reports/${report.id}/export/docx`;
                apiClient.get(url, { responseType: 'blob' }).then((res) => {
                  const blob = new Blob([res.data]);
                  const blobUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = blobUrl;
                  const cleanTitle = (report.title || 'report').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
                  a.download = `${cleanTitle}.docx`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(blobUrl);
                }).catch(() => {
                  window.open(reportsApi.getExportUrl(report.id, 'docx'), '_blank');
                });
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-xs text-blue-300 font-bold transition-all shadow-sm"
            title="Download Word Document"
          >
            <Download className="h-4 w-4 text-blue-400" />
            <span>Download .DOCX</span>
          </button>

          {/* Single-Click Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all scale-100 hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" />
            <span>All Formats</span>
          </button>

        </div>
      </div>

      {/* Confidence Score & Quality Metrics Gauge */}
      <ConfidenceMeter
        confidenceScore={report.confidence_score}
        factCheckScore={report.fact_check_score}
        qualityScore={report.quality_score}
        sourcesCount={report.sources_count || sources.length}
      />

      {/* Main Dossier Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Table of Contents Column */}
        <div className="hidden lg:block lg:col-span-1">
          <TableOfContents
            markdownContent={report.full_markdown}
            readingProgress={readingProgress}
          />
        </div>

        {/* Markdown Reader Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-dark-900/85 border border-white/10 glass-panel shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <MarkdownReportRenderer
              content={report.full_markdown}
              citations={report.citations}
            />
          </div>
        </div>

      </div>

      {/* Sources Drawer */}
      <SourcePanel
        sources={sources}
        isOpen={showSources}
        onClose={() => setShowSources(false)}
      />

      {/* Export Modal */}
      <ExportModal
        reportId={report.id}
        reportTitle={report.title}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Share Modal */}
      <ShareModal
        reportId={report.id}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

    </div>
  );
};
