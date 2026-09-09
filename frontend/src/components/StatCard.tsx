import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand'
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10';
      case 'cyan':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10';
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10';
      default:
        return 'text-brand-400 bg-brand-500/10 border-brand-500/20 shadow-brand-500/10';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-dark-900/70 border border-white/10 glass-card shadow-xl flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-wide">{title}</p>
          <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl border shadow-lg ${getColorClasses()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-semibold text-emerald-400 font-mono">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
