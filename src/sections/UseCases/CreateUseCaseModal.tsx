import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, UploadCloud, X, Wand2 } from 'lucide-react';

const KEYWORD_BANK = ['subscription', 'engagement', 'pricing', 'competitor_pressure', 'churn_risk', 'retention', 'satisfaction', 'watch_time'];

interface CreateUseCaseModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateUseCaseModal({ open, onClose }: CreateUseCaseModalProps) {
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);

  const suggestedKeywords = useMemo(() => {
    if (!description.trim()) return [];
    const words = description.toLowerCase();
    const matched = KEYWORD_BANK.filter((k) => words.includes(k.split('_')[0]));
    const fallback = KEYWORD_BANK.slice(0, 5);
    return (matched.length ? matched : fallback).slice(0, 5);
  }, [description]);

  const handleBuild = () => {
    setBuilding(true);
    window.setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
    }, 1400);
  };

  const handleClose = () => {
    setDescription('');
    setBuilt(false);
    setBuilding(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel glow-ring w-full max-w-lg rounded-2xl border border-(--border-soft) p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-twin-blue to-twin-purple">
                  <Wand2 size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-(--text-primary)">Create New Use Case</h3>
                  <p className="text-[11px] text-(--text-muted)">Assistant-guided rebuild from a plain-language description</p>
                </div>
              </div>
              <button type="button" onClick={handleClose} className="rounded-full p-1.5 text-(--text-muted) hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setBuilt(false);
              }}
              placeholder="e.g. Optimize subscription churn for streaming customers"
              rows={3}
              className="w-full resize-none rounded-xl border border-(--border-soft) bg-white/[0.03] px-3 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-twin-blue focus:outline-none"
            />

            <AnimatePresence>
              {suggestedKeywords.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-twin-teal">
                    <Sparkles size={12} /> AI-suggested keywords
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {suggestedKeywords.map((kw) => (
                      <span key={kw} className="rounded-full bg-gradient-to-r from-twin-blue/15 to-twin-purple/15 px-2.5 py-1 text-[11px] text-(--text-secondary) ring-1 ring-(--border-soft)">
                        {kw}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              disabled={!description.trim() || building}
              onClick={handleBuild}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-twin-blue via-twin-teal to-twin-purple py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <UploadCloud size={16} />
              {building ? 'Building pipeline skeleton…' : 'Generate Pipeline Skeleton'}
            </button>

            <AnimatePresence>
              {built && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-400"
                >
                  Pipeline skeleton generated with synthetic placeholders 🎉 Open it from Pipelines to review nodes.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
