interface HealthGaugeProps {
  score: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ARC_START = 135;
const ARC_SWEEP = 270;

function scoreToColor(score: number): string {
  if (score >= 7) return '#1A5C32'; // forest-DEFAULT
  if (score >= 4) return '#D97706'; // amber-600
  return '#DC2626'; // red-600
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function HealthGauge({
  score,
  size = 140,
  strokeWidth = 10,
  className = '',
}: HealthGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - strokeWidth - 4;

  const normalized = score !== null ? Math.max(0, Math.min(10, score)) : 0;
  const fillAngle = ARC_START + (normalized / 10) * ARC_SWEEP;

  const trackPath = describeArc(cx, cy, r, ARC_START, ARC_START + ARC_SWEEP);
  const fillPath = describeArc(cx, cy, r, ARC_START, fillAngle);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
      >
        <path
          d={trackPath}
          fill="none"
          stroke="#E8DCC4"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {score !== null && (
          <path
            d={fillPath}
            fill="none"
            stroke={scoreToColor(normalized)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        )}
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-2xl font-bold text-forest-800 font-serif leading-none">
          {score !== null ? score.toFixed(1) : '—'}
        </span>
        <span className="text-xs text-forest-400 mt-0.5">/ 10</span>
      </div>
    </div>
  );
}
