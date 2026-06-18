import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,

  ResponsiveContainer,
} from 'recharts';
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
  { key: 'humidity', label: 'Humidity', color: '#3B82F6', unit: '%', enabled: true },
  { key: 'soil_moisture', label: 'Soil Moisture', color: '#92400E', unit: '%', enabled: true },
  { key: 'light_intensity', label: 'Light', color: '#CA8A04', unit: ' lux', enabled: true },
  { key: 'plant_score', label: 'Health Score', color: '#1A5C32', unit: '/100', enabled: true },
];

const VISIBLE_SERIES = SERIES.filter((s) => s.enabled);

interface SensorTimeChartProps {
  data: PlantData[];
  className?: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-CH', { day: 'numeric', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });
}

interface ChartPoint {
  time: string;
  timestamp: number;
  temperature?: number;
  humidity?: number;
  soil_moisture?: number;
  light_intensity?: number;
  plant_score?: number;
}

function toChartData(raw: PlantData[]): ChartPoint[] {
  return [...raw]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((d) => ({
      time: formatTime(d.created_at),
      timestamp: new Date(d.created_at).getTime(),
      temperature: d.temperature,
      humidity: d.humidity,
      soil_moisture: d.soil_moisture,
      light_intensity: d.light_intensity,
      plant_score: d.plant_score ?? undefined,
    }));
}

export default function SensorTimeChart({ data, className = '' }: SensorTimeChartProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const chartData = toChartData(data);

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
              hidden.has(s.key) ? 'opacity-30' : 'opacity-100'
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
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC4" strokeWidth={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#8B7E6A' }}
            tickLine={false}
            axisLine={{ stroke: '#D4C8A8' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8B7E6A' }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FBF8F1',
              border: '1px solid #E8DCC4',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#3C4A3A',
              boxShadow: '0 4px 12px rgba(26,92,50,0.08)',
            }}
            labelStyle={{ fontWeight: 600, color: '#1A5C32', marginBottom: 4 }}
          />
          {VISIBLE_SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              unit={s.unit}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: s.color, stroke: '#FBF8F1', strokeWidth: 2 }}
              hide={hidden.has(s.key)}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
