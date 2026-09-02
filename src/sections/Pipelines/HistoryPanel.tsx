import { AnimatePresence, motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { pipelines } from '../../data/pipelines';
import { makeRows } from '../../data/random';

const history = makeRows(6, 555, (rnd, i) => {
  const pipeline = pipelines[Math.floor(rnd() * pipelines.length)];
  const daysAgo = Math.floor(rnd() * 14) + 1;
  const date = new Date(Date.now() - daysAgo * 86400000);
  return {
    id: `run-${i}`,
    pipeline: pipeline.name,
    pipelineId: pipeline.id,
    date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    mean: Number((rnd() * 0.5 + 0.1).toFixed(3)),
  };
});

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onSelectRun: (pipelineId: string) => void;
}

export function HistoryPanel({ open, onClose, onSelectRun }: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-panel glow-ring fixed right-4 top-20 z-50 w-80 rounded-2xl border border-(--border-soft) p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-(--text-primary)">
                <Clock size={15} className="text-twin-blue" /> Execution History
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-1 text-(--text-muted) hover:bg-white/10">
                <X size={14} />
              </button>
            </div>
            <ul className="space-y-1.5">
              {history.map((run) => (
                <li key={run.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRun(run.pipelineId);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-(--border-soft) bg-white/[0.02] px-3 py-2 text-left transition-colors hover:border-twin-blue/50"
                  >
                    <div>
                      <p className="text-xs font-medium text-(--text-primary)">{run.pipeline}</p>
                      <p className="text-[10px] text-(--text-muted)">{run.date}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] tabular-nums text-twin-teal">μ {run.mean}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
