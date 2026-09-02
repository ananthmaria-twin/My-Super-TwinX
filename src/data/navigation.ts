import type { NavItem } from '../types';

export const navItems: NavItem[] = [
  { id: 'digital-twins', label: 'Digital Twins', group: 'Platform' },
  { id: 'live-features', label: 'Live Features', group: 'Platform' },
  { id: 'use-cases', label: 'Use Cases', group: 'Platform' },
  { id: 'pipelines', label: 'Pipelines', group: 'Platform' },
  { id: 'studio', label: 'Studio', group: 'Platform' },
  { id: 'model-drift', label: 'Model Drift', group: 'Operations' },
  { id: 'monitoring', label: 'Monitoring', group: 'Operations', soon: true },
];
