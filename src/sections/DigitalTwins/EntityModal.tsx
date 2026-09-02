import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Entity } from '../../types';
import { entityIcons } from './entityIcons';
import { CountUp } from '../../components/CountUp';

interface EntityModalProps {
  entity: Entity | null;
  onClose: () => void;
}

export function EntityModal({ entity, onClose }: EntityModalProps) {
  return (
    <AnimatePresence>
      {entity && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel glow-ring max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--border-soft) p-6"
          >
            <ModalContent entity={entity} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalContent({ entity, onClose }: { entity: Entity; onClose: () => void }) {
  const Icon = entityIcons[entity.category];
  const numericAttr = entity.attributes.find((a) => a.type === 'number');
  const chartData = numericAttr
    ? entity.sampleData.slice(0, 8).map((row, i) => ({
        name: `#${i + 1}`,
        value: Number(row[numericAttr.name]) || 0,
      }))
    : [];

  return (
    <>
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-twin-blue/20 via-twin-teal/20 to-twin-purple/20">
            <Icon size={22} className="text-twin-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-(--text-primary)">{entity.name}</h3>
            <p className="text-sm text-(--text-muted)">
              <CountUp value={entity.rows} /> rows &middot; {entity.attributes.length} attributes
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-(--text-muted) transition-colors hover:bg-white/10 hover:text-(--text-primary)"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {entity.attributes.map((attr) => (
          <span
            key={attr.name}
            className="rounded-full border border-(--border-soft) bg-white/5 px-2.5 py-1 text-[11px] font-medium text-(--text-secondary)"
          >
            {attr.name} <span className="text-(--text-muted)">· {attr.type}</span>
          </span>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="mb-5 h-40 animate-fade-up rounded-xl border border-(--border-soft) bg-white/[0.03] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)', borderRadius: 8, fontSize: 12 }}
              />
              <defs>
                <linearGradient id="entityBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <Bar dataKey="value" fill="url(#entityBar)" radius={[6, 6, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-(--border-soft)">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-(--border-soft) bg-white/[0.04] text-(--text-muted)">
              {entity.attributes.map((attr) => (
                <th key={attr.name} className="whitespace-nowrap px-3 py-2 font-medium">
                  {attr.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entity.sampleData.map((row, i) => (
              <tr key={i} className="animate-fade-up border-b border-(--border-soft) last:border-0" style={{ animationDelay: `${i * 40}ms` }}>
                {entity.attributes.map((attr) => (
                  <td key={attr.name} className="whitespace-nowrap px-3 py-2 tabular-nums text-(--text-secondary)">
                    {row[attr.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-(--text-muted)">
        Sample rows are synthetic, seeded for MVP preview. Production tables are loaded by upstream data pipelines.
      </p>
    </>
  );
}
