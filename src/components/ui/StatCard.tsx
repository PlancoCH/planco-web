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
  forest: 'border-forest-200 bg-forest-50/50',
  sage: 'border-sage-200 bg-sage-100/40',
  amber: 'border-amber-200 bg-amber-50/50',
  red: 'border-red-200 bg-red-50/50',
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
      className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between ${accentStyles[accent]} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-forest-DEFAULT/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-forest-DEFAULT" />
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
