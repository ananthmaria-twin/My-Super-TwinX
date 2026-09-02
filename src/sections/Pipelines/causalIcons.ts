import { Tag, Star, ShieldAlert, Smile, Activity, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { CausalNode } from '../../types';

export const causalIcons: Record<CausalNode['icon'], LucideIcon> = {
  price: Tag,
  quality: Star,
  shield: ShieldAlert,
  smile: Smile,
  pulse: Activity,
  warning: TriangleAlert,
};
