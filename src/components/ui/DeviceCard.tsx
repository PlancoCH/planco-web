import { ChevronRight } from 'lucide-react';
import type { ComponentType } from 'react';

type Icon = ComponentType<{ className?: string }>;

interface DeviceCardDetail {
  label: string;
  value: string;
}

interface DeviceCardStatus {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'neutral';
}

const statusStyles: Record<DeviceCardStatus['variant'], { dot: string; text: string }> = {
  success: {
    dot: 'bg-forest-DEFAULT',
    text: 'text-forest-700',
  },
  warning: {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-700',
  },
  neutral: {
    dot: 'bg-forest-300',
    text: 'text-forest-500',
  },
};

interface DeviceCardProps {
  title: string;
  subtitle?: string;
  details?: DeviceCardDetail[];
  icon?: Icon;
  onClick?: () => void;
  displayMode?: 'big' | 'small';
  className?: string;
}

export default function DeviceCard({
  title,
  subtitle,
  details,
  icon: Icon,
  onClick,
  displayMode = 'big',
  className = '',
}: DeviceCardProps) {
  const isBig = displayMode === 'big';
  const isClickable = onClick !== undefined;

  return (
    <div
      onClick={onClick}
      className={`group overflow-hidden border border-beige-300 bg-beige-50 transition-all duration-300 rounded-2xl ${
        isClickable
          ? 'cursor-pointer hover:border-forest-300 hover:shadow-lg hover:shadow-forest-DEFAULT/10'
          : ''
      } ${className}`}
    >
      <div className={isBig ? 'p-6 sm:p-8' : 'p-4'}>
        <div className={`flex gap-4 ${isBig ? '' : 'flex-col'}`}>
          {Icon && (
            <div
              className={`shrink-0 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center ${
                isBig ? 'w-12 h-12' : 'w-10 h-10'
              }`}
            >
              <Icon
                className={`text-forest-DEFAULT ${isBig ? 'w-6 h-6' : 'w-5 h-5'}`}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className={`font-serif text-forest-800 truncate ${
                    isBig ? 'text-xl sm:text-2xl' : 'text-base'
                  }`}
                >
                  {title}
                </h3>
                {subtitle && (
                  <p
                    className={`text-forest-500 truncate ${
                      isBig ? 'text-sm mt-1' : 'text-xs mt-0.5'
                    }`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {isClickable && (
                  <ChevronRight className="w-5 h-5 text-forest-300 group-hover:text-forest-DEFAULT group-hover:translate-x-0.5 transition-all duration-300" />
                )}
              </div>
            </div>

            {isBig && details && details.length > 0 && (
              <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 pt-4 border-t border-beige-200">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <p className="text-xs text-forest-400 uppercase tracking-wide">
                      {detail.label}
                    </p>
                    <p className="text-sm font-medium text-forest-700 mt-0.5">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
