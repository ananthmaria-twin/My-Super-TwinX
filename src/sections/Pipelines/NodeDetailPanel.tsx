import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Database, ArrowRightLeft, Box } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PipelineNode } from '../../types';
import { nodeIcons, nodeAccent } from './nodeVisuals';
import { CountUp } from '../../components/CountUp';
import { buildDistributionCurve } from './distributionCurve';

type Tab = 'Details' | 'Execution' | 'Metrics';

interface NodeDetailPanelProps {
  node: PipelineNode | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const [tab, setTab] = useState<Tab>('Details');
  const Icon = node ? nodeIcons[node.kind] : Box;

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="glass-panel glow-ring flex h-full w-[340px] shrink-0 flex-col rounded-2xl border border-(--border-soft) p-5"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${nodeAccent[node.kind]}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">Node Detail</p>
                <h3 className="text-sm font-semibold text-(--text-primary)">{node.label}</h3>
              </div>
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-1.5 text-(--text-muted) hover:bg-white/10">
              <X size={16} />
            </button>
          </div>

          <div className="mb-4 flex gap-1 rounded-xl bg-white/5 p-1">
            {(['Details', 'Execution', 'Metrics'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                  tab === t ? 'bg-gradient-to-r from-twin-blue to-twin-purple text-white shadow' : 'text-(--text-muted) hover:text-(--text-primary)'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === 'Details' && <DetailsTab node={node} />}
            {tab === 'Execution' && <ExecutionTab node={node} />}
            {tab === 'Metrics' && <MetricsTab node={node} />}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function DetailsTab({ node }: { node: PipelineNode }) {
  const rows = [
    { icon: Database, label: 'Source', value: node.source ?? '—' },
    { icon: ArrowRightLeft, label: 'Alignment', value: node.alignment ?? '—' },
    { icon: Box, label: 'Base entity', value: node.baseEntity ?? '—' },
  ];
  return (
    <div className="space-y-3">
      {node.formula && (
        <div className="rounded-xl border border-(--border-soft) bg-white/[0.03] p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-twin-purple">Formula</p>
          <code className="block break-words font-mono text-[11px] leading-relaxed text-(--text-secondary)">{node.formula}</code>
        </div>
      )}
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-2.5 rounded-xl border border-(--border-soft) bg-white/[0.02] p-3">
          <row.icon size={14} className="mt-0.5 shrink-0 text-twin-blue" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-(--text-muted)">{row.label}</p>
            <p className="break-words text-xs text-(--text-secondary)">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExecutionTab({ node }: { node: PipelineNode }) {
  const metrics = node.metrics;
  if (!metrics) {
    return <p className="text-xs text-(--text-muted)">No execution metrics available — run the pipeline to populate this node.</p>;
  }
  const curve = buildDistributionCurve(metrics.mean, metrics.ciLow, metrics.ciHigh);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Mean (μ)" value={metrics.mean} decimals={3} />
        <Stat label="CVaR 5%" value={metrics.cvar} decimals={metrics.cvar > 100 ? 1 : 3} />
        <Stat label="CI Low" value={metrics.ciLow} decimals={3} />
        <Stat label="CI High" value={metrics.ciHigh} decimals={3} />
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">Outcome Distribution</p>
        <div className="h-32 rounded-xl border border-(--border-soft) bg-white/[0.03] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curve}>
              <defs>
                <linearGradient id="distFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="density" stroke="#14b8a6" strokeWidth={2} fill="url(#distFill)" animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricsTab({ node }: { node: PipelineNode }) {
  const rows = node.sampleRows ?? [];
  const keys = rows[0] ? Object.keys(rows[0]) : [];
  const numericKey = keys.find((k) => typeof rows[0][k] === 'number');
  const chartData = numericKey ? rows.map((r, i) => ({ name: `#${i + 1}`, value: Number(r[numericKey]) })) : [];

  return (
    <div className="space-y-4">
      {chartData.length > 0 && (
        <div className="h-28 rounded-xl border border-(--border-soft) bg-white/[0.03] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={26} />
              <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-(--border-soft)">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-(--border-soft) bg-white/[0.04] text-(--text-muted)">
              {keys.map((k) => (
                <th key={k} className="whitespace-nowrap px-2.5 py-1.5 font-medium">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-(--border-soft) last:border-0">
                {keys.map((k) => (
                  <td key={k} className="whitespace-nowrap px-2.5 py-1.5 tabular-nums text-(--text-secondary)">
                    {row[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-3 text-[11px] text-(--text-muted)">No synthetic sample rows for this node.</p>}
      </div>
    </div>
  );
}

function Stat({ label, value, decimals }: { label: string; value: number; decimals: number }) {
  return (
    <div className="animate-count rounded-xl border border-(--border-soft) bg-white/[0.02] p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-(--text-muted)">{label}</p>
      <p className="mt-0.5 text-base font-semibold tabular-nums text-(--text-primary)">
        <CountUp value={value} decimals={decimals} />
      </p>
    </div>
  );
}
