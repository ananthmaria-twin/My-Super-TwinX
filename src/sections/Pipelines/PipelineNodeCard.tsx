import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { PipelineNode } from '../../types';
import { nodeIcons, nodeAccent, statusLabel, statusDot } from './nodeVisuals';

interface PipelineNodeCardProps {
  node: PipelineNode;
  selected: boolean;
  onSelect: (node: PipelineNode) => void;
}

export function PipelineNodeCard({ node, selected, onSelect }: PipelineNodeCardProps) {
  const Icon = nodeIcons[node.kind];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(node)}
      style={{ left: node.x, top: node.y }}
      className="absolute w-[212px] -translate-y-1/2 text-left"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.035 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div
        className={clsx(
          'glass-panel relative rounded-2xl border p-3.5 transition-all duration-300',
          selected
            ? 'border-twin-blue shadow-[0_0_28px_-6px_rgba(59,130,246,0.65)]'
            : 'border-(--border-soft) hover:border-twin-teal/60',
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className={clsx('flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br', nodeAccent[node.kind])}>
            <Icon size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight text-(--text-primary)">{node.label}</p>
            {node.sublabel && <p className="mt-0.5 text-[10px] leading-tight text-(--text-muted)">{node.sublabel}</p>}
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span className={clsx('relative flex size-1.5 rounded-full', statusDot[node.status])}>
            {node.status !== 'not-run' && (
              <span className={clsx('absolute inset-0 animate-ping rounded-full opacity-75', statusDot[node.status])} />
            )}
            {node.status === 'not-run' && (
              <span className="absolute inset-0 animate-pulse-slow rounded-full bg-slate-400 opacity-60" />
            )}
          </span>
          <span className="text-[9px] font-semibold tracking-wider text-(--text-muted)">{statusLabel[node.status]}</span>
        </div>
      </div>
    </motion.button>
  );
}
