import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileCode, 
  Globe, 
  FileSpreadsheet, 
  Code, 
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { apiClient, reportsApi } from '../services/api';

interface ExportModalProps {
  reportId: string;
  reportTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  reportId,
  reportTitle,
  isOpen,
  onClose
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const formats = [
    {
      format: 'docx',
      name: 'Microsoft Word Document',
      extension: '.docx',
      description: 'Standard .docx format with styled tables, headings, and citations.',
      icon: FileText,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      format: 'pdf',
      name: 'Adobe PDF Document',
      extension: '.pdf',
      description: 'Executive print-ready PDF layout with cover header and data tables.',
      icon: FileText,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      format: 'md',
      name: 'Markdown Source',
      extension: '.md',
      description: 'Clean Markdown with full frontmatter, code blocks, and references.',
      icon: FileCode,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20'
    },
    {
      format: 'html',
      name: 'Standalone Webpage',
      extension: '.html',
      description: 'Self-contained HTML5 file with dark-mode CSS and printable view.',
      icon: Globe,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      format: 'json',
      name: 'Structured JSON Dossier',
      extension: '.json',
      description: 'Raw API dataset including confidence metrics and verified citations.',
      icon: Code,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      format: 'csv',
      name: 'Citations & Sources CSV',
      extension: '.csv',
      description: 'Tabular spreadsheet of all bibliographic references and URLs.',
      icon: FileSpreadsheet,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  const handleDownload = async (format: string, ext: string) => {
    try {
      setDownloadingFormat(format);
      const url = `/reports/${reportId}/export/${format}`;
      const response = await apiClient.get(url, { responseType: 'blob' });
      
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanTitle = (reportTitle || 'research_report').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
      link.download = `${cleanTitle}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadedFormat(format);
      setTimeout(() => setDownloadedFormat(null), 2500);
    } catch (err) {
      console.error('Export error:', err);
      // Fallback to window.open
      const fallbackUrl = reportsApi.getExportUrl(reportId, format);
      window.open(fallbackUrl, '_blank');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-dark-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-brand-400" />
              <span>Export Research Dossier</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{reportTitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {formats.map((item) => {
            const Icon = item.icon;
            const isDownloading = downloadingFormat === item.format;
            const isDone = downloadedFormat === item.format;

            return (
              <button
                key={item.format}
                disabled={isDownloading}
                onClick={() => handleDownload(item.format, item.extension)}
                className="flex items-start gap-3 p-4 rounded-2xl bg-dark-950/80 border border-white/10 hover:border-brand-500/40 hover:bg-slate-900/90 text-left transition-all group disabled:opacity-50 relative overflow-hidden"
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${item.color}`}>
                  {isDownloading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
                  ) : isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-brand-300">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.extension}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Downloads include formatted bibliography & tables.</span>
          <button onClick={onClose} className="text-xs font-semibold text-slate-400 hover:text-white">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
