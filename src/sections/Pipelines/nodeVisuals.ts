import { UserRound, Sigma, BarChart3, BrainCircuit, Waves, type LucideIcon } from 'lucide-react';
import type { NodeKind, NodeStatus } from '../../types';

export const nodeIcons: Record<NodeKind, LucideIcon> = {
  input: UserRound,
  calculation: Sigma,
  kpi: BarChart3,
  model: BrainCircuit,
  rollup: Waves,
};

export const nodeAccent: Record<NodeKind, string> = {
  input: 'from-blue-500/20 to-blue-500/5 text-blue-400',
  calculation: 'from-purple-500/20 to-purple-500/5 text-purple-400',
  kpi: 'from-teal-500/20 to-teal-500/5 text-teal-400',
  model: 'from-pink-500/20 to-pink-500/5 text-pink-400',
  rollup: 'from-amber-500/20 to-amber-500/5 text-amber-400',
};

export const statusLabel: Record<NodeStatus, string> = {
  'not-run': 'NOT RUN',
  running: 'RUNNING',
  complete: 'COMPLETE',
};

export const statusDot: Record<NodeStatus, string> = {
  'not-run': 'bg-slate-400',
  running: 'bg-blue-400',
  complete: 'bg-emerald-400',
};
