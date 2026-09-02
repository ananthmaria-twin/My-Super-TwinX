import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Topbar } from '../../components/Topbar';
import { mulberry32 } from '../../data/random';
import { CountUp } from '../../components/CountUp';

const rnd = mulberry32(42);

function nextPoint(prev: number) {
  const delta = (rnd() - 0.5) * 8;
  return Math.min(98, Math.max(20, prev + delta));
}

const STREAMS = [
  { id: 'engagement', label: 'Engagement Score', color: '#3b82f6', seed: 62 },
  { id: 'satisfaction', label: 'Satisfaction Score', color: '#14b8a6', seed: 71 },
  { id: 'watchtime', label: 'Watch Time Index', color: '#a855f7', seed: 55 },
];

export function LiveFeaturesSection() {
  const [series, setSeries] = useState(() =>
    STREAMS.reduce<Record<string, number[]>>((acc, s) => {
      acc[s.id] = Array.from({ length: 16 }, () => s.seed);
      return acc;
    }, {}),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeries((prev) => {
        const next: Record<string, number[]> = {};
        for (const s of STREAMS) {
          const arr = prev[s.id];
          next[s.id] = [...arr.slice(1), nextPoint(arr[arr.length - 1])];
        }
        return next;
      });
    }, 1400);
    return () => window.clearInterval(interval);
  }, []);

  const chartData = series.engagement.map((_, i) => ({
    t: i,
    engagement: series.engagement[i],
    satisfaction: series.satisfaction[i],
    watchtime: series.watchtime[i],
  }));

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Topbar title="Live Features" description="Synthetic real-time data streams from the twin layer, updating continuously." />

      <div className="grid grid-cols-1 gap-4 px-4 sm:px-8 py-6 sm:grid-cols-3">
        {STREAMS.map((s) => {
          const value = series[s.id][series[s.id].length - 1];
          return (
            <div key={s.id} className="card-hover rounded-2xl border border-(--border-soft) bg-(--surface-raised) p-4">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2 rounded-full" style={{ backgroundColor: s.color }}>
                  <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ backgroundColor: s.color }} />
                </span>
                <p className="text-xs font-medium text-(--text-secondary)">{s.label}</p>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-(--text-primary)">
                <CountUp value={value} decimals={1} />
              </p>
            </div>
          );
        })}
      </div>

      <div className="mx-8 mb-8 h-72 rounded-2xl border border-(--border-soft) bg-(--surface-raised) p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="satisfaction" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="watchtime" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
