import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { makeRows } from '../../data/random';

const driftData = makeRows(12, 900, (rnd, i) => ({
  week: `W${i + 1}`,
  accuracy: Number((0.92 - i * 0.004 + (rnd() - 0.5) * 0.01).toFixed(3)),
}));

export function ModelDriftSection() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Topbar title="Model Drift" description="Track how prediction quality decays over time across deployed models." />

      <div className="px-4 sm:px-8 py-6">
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-400">
          <CheckCircle2 size={15} /> No significant drift detected on the churn_risk model in the last 12 weeks.
        </div>

        <div className="h-72 rounded-2xl border border-(--border-soft) bg-(--surface-raised) p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={driftData}>
              <defs>
                <linearGradient id="driftFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.8, 0.95]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} fill="url(#driftFill)" animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
