import type { Distribution } from '../../types/stats';

interface DistributionBarProps {
  distribution: Distribution;
  className?: string;
}

const SEGMENTS: { key: keyof Distribution; label: string; color: string; textColor: string }[] = [
  { key: 'good', label: 'Good', color: 'bg-forest-DEFAULT', textColor: 'text-forest-700' },
  { key: 'fair', label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-700' },
  { key: 'poor', label: 'Poor', color: 'bg-red-500', textColor: 'text-red-700' },
  { key: 'unknown', label: 'Unknown', color: 'bg-beige-300', textColor: 'text-forest-400' },
];

export default function DistributionBar({ distribution, className = '' }: DistributionBarProps) {
  const total =
    distribution.good + distribution.fair + distribution.poor + distribution.unknown;

  if (total === 0) {
    return (
      <div className={`${className}`}>
        <p className="text-sm text-forest-400">No plant health data yet.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex h-3 rounded-full overflow-hidden mb-4">
        {SEGMENTS.map(({ key, color }) => {
          const pct = (distribution[key] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={key}
              className={`${color} transition-all duration-700 ease-out`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 sm:gap-6">
        {SEGMENTS.map(({ key, label, color, textColor }) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color} shrink-0`} />
            <span className={`text-sm ${textColor}`}>
              <span className="font-medium">{distribution[key]}</span>{' '}
              <span className="text-forest-400">{label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
