import { useMemo, useState } from 'react';
import type { PlantData } from '../../types/plant';

interface SeriesConfig {
  key: keyof PlantData;
  label: string;
  color: string;
  unit: string;
  enabled: boolean;
}

const SERIES: SeriesConfig[] = [
  { key: 'temperature', label: 'Temperature', color: '#D97706', unit: '°C', enabled: true },
  { key: 'humidity', label: 'Humidity', color: '#2563EB', unit: '%', enabled: true },
  { key: 'soil_moisture', label: 'Soil Moisture', color: '#92400E', unit: '%', enabled: true },
  { key: 'light_intensity', label: 'Light', color: '#CA8A04', unit: ' lux', enabled: true },
  { key: 'plant_score', label: 'Health Score', color: '#1A5C32', unit: '/100', enabled: false },
];

interface SensorTimeChartProps {
  data: PlantData[];
  className?: string;
}

const PADDING = { top: 10, right: 20, bottom: 50, left: 55 };
const CHART_WIDTH = 800;
const CHART_HEIGHT = 300;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-CH', { day: 'numeric', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });
}

export default function SensorTimeChart({ data, className = '' }: SensorTimeChartProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(SERIES.map((s) => [s.key, s.enabled])),
  );

  const toggle = (key: string) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeSeries = SERIES.filter((s) => visible[s.key]);

  const { points, yMin, yMax, xTicks } = useMemo(() => {
    if (data.length === 0) return { points: [], yMin: 0, yMax: 100, xTicks: [] };

    const sorted = [...data].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    let min = Infinity;
    let max = -Infinity;

    for (const s of activeSeries) {
      for (const d of sorted) {
        const v = d[s.key] as number | null;
        if (v !== null && v !== undefined) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }

    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 100;
    const padding = (max - min) * 0.1 || 10;
    const yMinCalc = Math.max(0, min - padding);
    const yMaxCalc = max + padding;

    const maxTicks = 6;
    const tickCount = Math.min(maxTicks, sorted.length);
    const step = Math.max(1, Math.floor(sorted.length / tickCount));
    const ticks: { index: number; label: string }[] = [];
    for (let i = 0; i < sorted.length; i += step) {
      ticks.push({ index: i, label: formatDate(sorted[i].created_at) });
    }
    if (ticks.length === 0 || ticks[ticks.length - 1].index !== sorted.length - 1) {
      ticks.push({ index: sorted.length - 1, label: formatDate(sorted[sorted.length - 1].created_at) });
    }

    return { points: sorted, yMin: yMinCalc, yMax: yMaxCalc, xTicks: ticks };
  }, [data, activeSeries]);

  const plotW = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const scaleX = (i: number) =>
    PADDING.left + (points.length > 1 ? (i / (points.length - 1)) * plotW : plotW / 2);

  const scaleY = (v: number) =>
    PADDING.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = useMemo(() => {
    const range = yMax - yMin;
    const rough = range / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    const normalized = rough / magnitude;
    let step: number;
    if (normalized <= 1.5) step = magnitude;
    else if (normalized <= 3) step = 2 * magnitude;
    else if (normalized <= 7) step = 5 * magnitude;
    else step = 10 * magnitude;
    const start = Math.ceil(yMin / step) * step;
    const ticks: number[] = [];
    for (let v = start; v <= yMax; v += step) {
      ticks.push(v);
    }
    return ticks;
  }, [yMin, yMax]);

  if (data.length === 0) {
    return (
      <div className={`bg-beige-50 rounded-2xl border border-beige-300 p-6 ${className}`}>
        <p className="text-sm text-forest-400 text-center">No sensor data available yet.</p>
      </div>
    );
  }

  return (
    <div className={`bg-beige-50 rounded-2xl border border-beige-300 p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => toggle(s.key)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-opacity ${
              visible[s.key] ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </button>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={PADDING.left}
              y1={scaleY(tick)}
              x2={CHART_WIDTH - PADDING.right}
              y2={scaleY(tick)}
              stroke="#E8DCC4"
              strokeDasharray="4 4"
              strokeWidth={0.5}
            />
            <text
              x={PADDING.left - 8}
              y={scaleY(tick) + 4}
              textAnchor="end"
              className="text-xs fill-forest-400"
              fontSize={10}
            >
              {Number.isInteger(tick) ? tick : tick.toFixed(1)}
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <text
            key={`x-${tick.index}`}
            x={scaleX(tick.index)}
            y={CHART_HEIGHT - PADDING.bottom + 16}
            textAnchor="middle"
            className="text-xs fill-forest-400"
            fontSize={9}
          >
            {tick.label}
          </text>
        ))}
        {/* X axis line */}
        <line
          x1={PADDING.left}
          y1={PADDING.top + plotH}
          x2={PADDING.left + plotW}
          y2={PADDING.top + plotH}
          stroke="#D4C8A8"
          strokeWidth={1}
        />

        {activeSeries.map((series) => {
          const validPoints = points
            .map((d, i) => ({ x: scaleX(i), y: scaleY(d[series.key] as number), raw: d }))
            .filter((p) => p.raw[series.key] !== null && p.raw[series.key] !== undefined);

          if (validPoints.length < 2) return null;

          const pathD = validPoints
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');

          return (
            <g key={series.key}>
              <path
                d={pathD}
                fill="none"
                stroke={series.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {validPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={2.5}
                  fill={series.color}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
