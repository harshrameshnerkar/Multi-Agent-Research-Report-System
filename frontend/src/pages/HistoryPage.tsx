import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Trash2, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Plus,
  RefreshCw,
  FileCode,
  CheckCircle2,
  Loader2,
  ArrowUpDown
} from 'lucide-react';
import { apiClient, reportsApi } from '../services/api';
import { Report } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'words'>('date');
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [search]);

  const loadReports = () => {
    setLoading(true);
    reportsApi.list(search)
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this research dossier?')) {
      await reportsApi.delete(id);
      loadReports();
    }
  };

  const handleDirectDownload = async (report: Report, format: string, ext: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${report.id}_${format}`;
    try {
      setDownloadingId(key);
      const url = `/reports/${report.id}/export/${format}`;
      const response = await apiClient.get(url, { responseType: 'blob' });
      
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanTitle = (report.title || 'report').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
      link.download = `${cleanTitle}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      window.open(reportsApi.getExportUrl(report.id, format), '_blank');
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'confidence') return (b.confidence_score || 0) - (a.confidence_score || 0);
    if (sortBy === 'words') return (b.word_count || 0) - (a.word_count || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Research Reports & History
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-mono font-bold">
              {reports.length} Dossiers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, export directly in Word (.docx) & PDF, or review past multi-agent investigations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadReports}
            className="p-2.5 rounded-xl bg-dark-900 border border-white/10 hover:border-brand-500/40 text-slate-300 hover:text-white transition-all shadow-sm"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/workspace')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Research</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-dark-900/80 border border-white/10 glass-panel">
        <div className="flex items-center gap-3 w-full sm:w-2/3">
          <Search className="h-4 w-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Filter reports by keyword, topic, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-white px-2">
              Clear
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
            <ArrowUpDown className="h-3 w-3" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-dark-950 text-xs text-slate-200 border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none focus:border-brand-500/50"
          >
            <option value="date">Most Recent</option>
            <option value="confidence">Highest Confidence</option>
            <option value="words">Longest Content</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-4">
          <div className="h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono">Synchronizing research library...</p>
        </div>
      ) : sortedReports.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-3xl bg-dark-900/40 border border-white/5 p-8">
          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No research reports found</h3>
          <p className="text-xs text-slate-400">Launch a new autonomous research job to populate your library.</p>
          <button
            onClick={() => navigate('/workspace')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors"
          >
            Start Research
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReports.map((r) => {
            const isDocxLoading = downloadingId === `${r.id}_docx`;
            const isPdfLoading = downloadingId === `${r.id}_pdf`;

            return (
              <div
                key={r.id}
                onClick={() => navigate(`/report/${r.id}`)}
                className="p-6 rounded-3xl bg-dark-900/80 border border-white/10 hover:border-brand-500/40 glass-card cursor-pointer transition-all flex flex-col justify-between space-y-4 group shadow-xl relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-3">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {r.confidence_score}% Confidence
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                    {r.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {r.executive_summary}
                  </p>
                </div>

                {/* Footer Actions & Export Buttons */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  
                  {/* Word & PDF Quick Export Pill Bar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDirectDownload(r, 'docx', '.docx', e)}
                      disabled={isDocxLoading}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-[11px] text-blue-300 font-semibold transition-colors disabled:opacity-50"
                      title="Download Microsoft Word (.docx)"
                    >
                      {isDocxLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3 text-blue-400" />
                      )}
                      <span>Word .DOCX</span>
                    </button>

                    <button
                      onClick={(e) => handleDirectDownload(r, 'pdf', '.pdf', e)}
                      disabled={isPdfLoading}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-[11px] text-rose-300 font-semibold transition-colors disabled:opacity-50"
                      title="Download Adobe PDF (.pdf)"
                    >
                      {isPdfLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3 text-rose-400" />
                      )}
                      <span>PDF</span>
                    </button>
                  </div>

                  {/* Reading Time & Controls */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {r.reading_time_minutes}m read • {r.word_count || 1200} words
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(r.id, e)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-brand-400 font-semibold group-hover:underline flex items-center gap-1">
                        View <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
