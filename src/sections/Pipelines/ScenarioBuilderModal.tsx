import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, SlidersHorizontal, Play } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { buildDistributionCurve } from './distributionCurve';
import { CountUp } from '../../components/CountUp';

interface ScenarioBuilderModalProps {
  open: boolean;
  pipelineName: string;
  onClose: () => void;
}

export function ScenarioBuilderModal({ open, pipelineName, onClose }: ScenarioBuilderModalProps) {
  const [fees, setFees] = useState(25);
  const [deposit, setDeposit] = useState(true);
  const [competitor, setCompetitor] = useState(45);

  const mean = useMemo(() => {
    const raw = 0.5 + fees * 0.01 - (deposit ? 1 : 0) * 0.3 - competitor / 100 * 0.05;
    return Math.min(0.99, Math.max(0.01, Number(raw.toFixed(3))));
  }, [fees, deposit, competitor]);

  const curve = useMemo(() => buildDistributionCurve(mean, mean - 0.08, mean + 0.08), [mean]);

  return (
    <AnimatePresence>
      {open && (
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
            className="glass-panel glow-ring w-full max-w-lg rounded-2xl border border-(--border-soft) p-6"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-twin-teal to-twin-blue">
                  <SlidersHorizontal size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-(--text-primary)">Scenario Builder</h3>
                  <p className="text-[11px] text-(--text-muted)">{pipelineName}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-1.5 text-(--text-muted) hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <SliderRow label="Fees charged range" value={fees} onChange={setFees} min={0} max={80} suffix="/mo" />
              <SliderRow label="Competitor pressure index" value={competitor} onChange={setCompetitor} min={0} max={100} />
              <label className="flex items-center justify-between rounded-xl border border-(--border-soft) bg-white/[0.02] px-3 py-2.5 text-xs text-(--text-secondary)">
                Has direct deposit
                <input type="checkbox" checked={deposit} onChange={(e) => setDeposit(e.target.checked)} className="accent-blue-500" />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <MiniStat label="Mean" value={mean} />
              <MiniStat label="Variance" value={Number((mean * (1 - mean)).toFixed(3))} />
              <MiniStat label="CVaR 5%" value={Number((mean + 0.15).toFixed(3))} />
            </div>

            <div className="mt-4 h-28 rounded-xl border border-(--border-soft) bg-white/[0.03] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={curve}>
                  <defs>
                    <linearGradient id="scenarioFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="density" stroke="#a855f7" strokeWidth={2} fill="url(#scenarioFill)" animationDuration={600} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-twin-blue via-twin-teal to-twin-purple py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              <Play size={15} /> Run Scenario
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-(--text-secondary)">
        <span>{label}</span>
        <span className="font-semibold tabular-nums text-twin-blue">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-(--border-soft) bg-white/[0.02] p-2.5 text-center">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-(--text-muted)">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-(--text-primary)">
        <CountUp value={value} decimals={3} />
      </p>
    </div>
  );
}
