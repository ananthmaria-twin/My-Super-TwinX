import { Landmark, UserRound, Car, HandCoins, Tv, Truck, type LucideIcon } from 'lucide-react';
import type { Entity } from '../../types';

export const entityIcons: Record<Entity['category'], LucideIcon> = {
  logistics: Truck,
  banking: Landmark,
  customer: UserRound,
  automotive: Car,
  lending: HandCoins,
  subscription: Tv,
};
