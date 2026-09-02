import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Workflow, ChevronDown } from 'lucide-react';
import type { UseCase } from '../../types';
import { industryIcons } from './industryIcons';
import { industryAccent } from '../../data/useCases';

interface UseCaseCardProps {
  useCase: UseCase;
  index: number;
  onOpen: (useCase: UseCase) => void;
  onOpenPipeline: (pipelineId: string) => void;
}

export function UseCaseCard({ useCase, index, onOpen, onOpenPipeline }: UseCaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = industryIcons[useCase.industry];

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) onOpen(useCase);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="card-hover overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-raised)"
    >
      <button type="button" onClick={toggle} className="flex w-full items-start gap-3 p-5 text-left">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${industryAccent[useCase.industry]} shadow-md ring-1 ring-(--border-soft)`}
        >
          <Icon size={19} className="text-white drop-shadow" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-(--text-primary)">{useCase.name}</h3>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="shrink-0 text-(--text-muted)">
              <ChevronDown size={16} />
            </motion.span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-(--text-muted)">{useCase.industry}</p>
          <div className="mt-3 flex gap-4 text-[11px] text-(--text-muted)">
            <span>
              <span className="font-semibold text-twin-blue">{useCase.derivedFeatures}</span> derived
            </span>
            <span>
              <span className="font-semibold text-twin-purple">{useCase.scenarios}</span> scenario{useCase.scenarios !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-(--border-soft) px-5 py-4">
              <p className="text-xs leading-relaxed text-(--text-secondary)">{useCase.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-soft) px-3 py-1.5 text-[11px] font-medium text-(--text-secondary) transition-colors hover:border-twin-blue hover:text-twin-blue"
                >
                  <Download size={13} /> Download
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-soft) px-3 py-1.5 text-[11px] font-medium text-(--text-secondary) transition-colors hover:border-red-400 hover:text-red-400"
                >
                  <Trash2 size={13} /> Delete
                </button>
                {useCase.pipelineId && (
                  <button
                    type="button"
                    onClick={() => onOpenPipeline(useCase.pipelineId!)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-twin-blue to-twin-purple px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-blue-500/20 transition-transform hover:scale-105"
                  >
                    <Workflow size={13} /> Open Pipeline
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
