import type { ComponentType, ReactNode } from 'react';

interface StatCardProps {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  subtitle?: string;
  accent?: 'forest' | 'sage' | 'amber' | 'red';
  className?: string;
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  forest: 'bg-forest-DEFAULT/10',
  sage: 'bg-sage-100',
  amber: 'bg-amber-100',
  red: 'bg-red-100',
};

const accentIconColors: Record<NonNullable<StatCardProps['accent']>, string> = {
  forest: 'text-forest-DEFAULT',
  sage: 'text-sage-DEFAULT',
  amber: 'text-amber-600',
  red: 'text-red-600',
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent = 'forest',
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-beige-300 bg-beige-50 p-5 sm:p-6 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[accent]}`}>
            <Icon className={`w-5 h-5 ${accentIconColors[accent]}`} />
          </div>
        )}
        <p className="text-xs text-forest-400 uppercase tracking-wide">{label}</p>
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold text-forest-800 font-serif">
          {value}
        </div>
        {subtitle && (
          <p className="text-sm text-forest-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
