import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, Copy, Check, Info, AlertTriangle, Lightbulb, Bookmark } from 'lucide-react';
import { Citation } from '../types';

interface MarkdownReportRendererProps {
  content: string;
  citations?: Citation[];
  onCitationClick?: (index: number) => void;
}

export const MarkdownReportRenderer: React.FC<MarkdownReportRendererProps> = ({
  content,
  citations = [],
  onCitationClick
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <article className="prose prose-invert prose-indigo max-w-none space-y-6 text-slate-200 text-sm md:text-base leading-relaxed selection:bg-brand-500/30 selection:text-brand-200">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight border-b border-white/10 pb-5 mt-6 mb-8 gradient-text-brand leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight border-b border-white/[0.08] pb-3 mt-10 mb-5 flex items-center gap-2.5 text-slate-100">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-8 mb-3 flex items-center gap-2 text-cyan-300">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base font-normal">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-500 bg-brand-950/30 rounded-r-2xl py-4 px-6 my-6 text-slate-200 italic shadow-md glass-card">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                <div className="font-medium text-slate-200">{children}</div>
              </div>
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-8 rounded-3xl border border-white/10 shadow-2xl glass-panel">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900/90 text-white font-bold border-b border-white/10">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-4 border-r border-white/5 last:border-r-0 text-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-4 border-t border-white/5 border-r last:border-r-0 text-slate-300">
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 space-y-2.5 mb-5 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 space-y-2.5 mb-5 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          hr: () => (
            <hr className="border-t border-white/10 my-10" />
          ),
          code: ({ children, className }) => {
            const codeString = String(children).replace(/\n$/, '');
            const isMultiLine = codeString.includes('\n');
            const codeId = Math.random().toString(36).substring(2, 9);

            if (isMultiLine) {
              return (
                <div className="relative my-6 rounded-2xl overflow-hidden border border-white/10 bg-dark-950 font-mono text-xs shadow-2xl">
                  <div className="px-4 py-2 bg-slate-900 border-b border-white/10 flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-mono">CODE SNIPPET</span>
                    <button
                      onClick={() => handleCopySnippet(codeString, codeId)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      {copiedCodeId === codeId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCodeId === codeId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-brand-200 leading-relaxed">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code className="px-2 py-0.5 rounded-md bg-slate-900 text-brand-300 text-xs font-mono border border-white/10 font-medium">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
