import type { CausalNode, CausalEdge, CausalEffect } from '../types';

export const causalNodes: CausalNode[] = [
  { id: 'price_level', label: 'Price Level', icon: 'price', x: 60, y: 60 },
  { id: 'service_quality', label: 'Service Quality', icon: 'quality', x: 60, y: 220 },
  { id: 'competitor_pressure', label: 'Competitor Pressure', icon: 'shield', x: 60, y: 380 },
  { id: 'satisfaction', label: 'Satisfaction', icon: 'smile', x: 380, y: 220 },
  { id: 'engagement', label: 'Engagement', icon: 'pulse', x: 700, y: 120 },
  { id: 'churn_risk', label: 'Churn Risk', icon: 'warning', x: 700, y: 320 },
];

export const causalEdges: CausalEdge[] = [
  { from: 'price_level', to: 'satisfaction', coefficient: -0.663 },
  { from: 'service_quality', to: 'satisfaction', coefficient: 0.742 },
  { from: 'competitor_pressure', to: 'satisfaction', coefficient: 0.429 },
  { from: 'satisfaction', to: 'engagement', coefficient: 0.636 },
  { from: 'satisfaction', to: 'churn_risk', coefficient: -0.39 },
];

const round = (n: number) => Number(n.toFixed(3));

export const causalEffects: CausalEffect[] = [
  { factor: 'price_level → engagement', direct: 0, mediated: round(-0.663 * 0.636), total: round(-0.663 * 0.636) },
  { factor: 'service_quality → engagement', direct: 0, mediated: round(0.742 * 0.636), total: round(0.742 * 0.636) },
  { factor: 'competitor_pressure → engagement', direct: 0, mediated: round(0.429 * 0.636), total: round(0.429 * 0.636) },
  { factor: 'satisfaction → engagement', direct: 0.636, mediated: 0, total: 0.636 },
  { factor: 'price_level → churn_risk', direct: 0, mediated: round(-0.663 * -0.39), total: round(-0.663 * -0.39) },
  { factor: 'satisfaction → churn_risk', direct: -0.39, mediated: 0, total: -0.39 },
];
