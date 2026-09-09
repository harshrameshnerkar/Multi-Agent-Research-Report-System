import React, { useState, useEffect } from 'react';
import { ListTree, BookOpen, Clock, BarChart2 } from 'lucide-react';

interface TableOfContentsProps {
  markdownContent: string;
  readingProgress: number; // 0 to 100
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ markdownContent, readingProgress }) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const lines = markdownContent.split('\n');
    const parsed: TocItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const level = trimmed.startsWith('### ') ? 3 : 2;
        const text = trimmed.replace(/^#{2,3}\s+/, '').replace(/\*\*/g, '');
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        parsed.push({ id, text, level });
      }
    });

    setItems(parsed);
  }, [markdownContent]);

  const scrollToSection = (text: string) => {
    // Find heading element by text
    const headings = document.querySelectorAll('h2, h3');
    for (const h of Array.from(headings)) {
      if (h.textContent?.toLowerCase().includes(text.toLowerCase())) {
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-white/10 bg-dark-900/80 backdrop-blur-xl p-5 space-y-4 shadow-xl">
      
      {/* Header & Reading Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <ListTree className="h-4 w-4 text-brand-400" />
            <span>Table of Contents</span>
          </div>
          <span className="text-[11px] font-mono text-brand-300 font-semibold">{readingProgress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {/* Sections List */}
      <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSection(item.text)}
            className={`
              w-full text-left rounded-lg py-1.5 px-2.5 transition-all block text-xs leading-snug
              ${item.level === 3 ? 'pl-5 text-[11px] text-slate-400 hover:text-slate-200' : 'font-medium text-slate-300 hover:text-white hover:bg-white/5'}
            `}
          >
            {item.text}
          </button>
        ))}
      </nav>

    </div>
  );
};
