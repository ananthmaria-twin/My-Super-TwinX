import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { causalNodes, causalEdges, causalEffects } from '../../data/causalGraph';
import { causalIcons } from './causalIcons';
import type { CausalNode } from '../../types';

const CARD_W = 168;

interface CausalGraphSectionProps {
  onNodeFocus?: (node: CausalNode, edgeLabel?: string) => void;
}

export function CausalGraphSection({ onNodeFocus }: CausalGraphSectionProps) {
  const [activeEdge, setActiveEdge] = useState<string | null>(null);
  const byId = Object.fromEntries(causalNodes.map((n) => [n.id, n]));
  const width = Math.max(...causalNodes.map((n) => n.x)) + CARD_W + 40;
  const height = Math.max(...causalNodes.map((n) => n.y)) + 70;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-(--text-primary)">Causal approximation of engagement</h2>
      <p className="mt-1 text-sm text-(--text-muted)">
        Visualize causal relationships between variables and their effects on engagement and churn risk.
      </p>

      <div className="bg-mesh mt-5 overflow-x-auto rounded-2xl border border-(--border-soft) bg-(--surface-raised)/40 p-2">
        <div className="relative" style={{ width, height }}>
          <svg className="pointer-events-none absolute inset-0" width={width} height={height}>
            <defs>
              <linearGradient id="causalPos" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="causalNeg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            {causalEdges.map((edge) => {
              const from = byId[edge.from];
              const to = byId[edge.to];
              const x1 = from.x + CARD_W;
              const y1 = from.y + 22;
              const x2 = to.x;
              const y2 = to.y + 22;
              const midX = (x1 + x2) / 2;
              const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
              const key = `${edge.from}-${edge.to}`;
              const positive = edge.coefficient >= 0;
              return (
                <g key={key}>
                  <path d={path} fill="none" stroke="var(--border-soft)" strokeWidth={2} />
                  <path
                    d={path}
                    fill="none"
                    stroke={positive ? 'url(#causalPos)' : 'url(#causalNeg)'}
                    strokeWidth={activeEdge === key ? 3.5 : 2.2}
                    strokeDasharray="5 9"
                    className="animate-flow transition-all duration-300"
                    opacity={0.9}
                  />
                </g>
              );
            })}
          </svg>

          {causalEdges.map((edge) => {
            const from = byId[edge.from];
            const to = byId[edge.to];
            const key = `${edge.from}-${edge.to}`;
            const midX = (from.x + CARD_W + to.x) / 2;
            const midY = (from.y + 22 + to.y + 22) / 2;
            const positive = edge.coefficient >= 0;
            return (
              <button
                key={key}
                type="button"
                onMouseEnter={() => setActiveEdge(key)}
                onMouseLeave={() => setActiveEdge(null)}
                onClick={() => onNodeFocus?.(to, `${from.label} → ${to.label}`)}
                style={{ left: midX, top: midY }}
                className={clsx(
                  'absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums shadow-md ring-1 ring-(--border-soft) transition-all',
                  positive ? 'bg-teal-500/15 text-teal-400' : 'bg-pink-500/15 text-pink-400',
                  activeEdge === key && 'scale-110 shadow-[0_0_16px_-2px_rgba(20,184,166,0.7)]',
                )}
              >
                {edge.coefficient > 0 ? '+' : ''}
                {edge.coefficient.toFixed(3)}
              </button>
            );
          })}

          {causalNodes.map((node, i) => {
            const Icon = causalIcons[node.icon];
            return (
              <motion.button
                type="button"
                key={node.id}
                onClick={() => onNodeFocus?.(node)}
                style={{ left: node.x, top: node.y, width: CARD_W }}
                className="glass-panel card-hover absolute rounded-xl border border-(--border-soft) px-3 py-2.5 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-twin-blue/20 to-twin-purple/20 text-twin-purple">
                    <Icon size={14} />
                  </div>
                  <p className="text-xs font-semibold text-(--text-primary)">{node.label}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-(--border-soft)">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-(--border-soft) bg-white/[0.04] text-(--text-muted)">
              <th className="px-4 py-2.5 font-medium">Factor</th>
              <th className="px-4 py-2.5 font-medium">Direct</th>
              <th className="px-4 py-2.5 font-medium">Mediated</th>
              <th className="px-4 py-2.5 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {causalEffects.map((effect) => (
              <tr key={effect.factor} className="border-b border-(--border-soft) last:border-0 hover:bg-white/[0.03]">
                <td className="px-4 py-2.5 font-medium text-(--text-primary)">{effect.factor}</td>
                <td className="px-4 py-2.5 tabular-nums text-(--text-secondary)">{effect.direct.toFixed(3)}</td>
                <td className="px-4 py-2.5 tabular-nums text-(--text-secondary)">{effect.mediated.toFixed(3)}</td>
                <td
                  className={clsx(
                    'px-4 py-2.5 font-semibold tabular-nums',
                    effect.total >= 0 ? 'text-teal-400' : 'text-pink-400',
                  )}
                >
                  {effect.total.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
