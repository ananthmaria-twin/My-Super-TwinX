import { Radio, Landmark, Car, Truck, Package, Layers, type LucideIcon } from 'lucide-react';
import type { UseCase } from '../../types';

export const industryIcons: Record<UseCase['industry'], LucideIcon> = {
  Telecom: Radio,
  Banking: Landmark,
  Automotive: Car,
  Logistics: Truck,
  'Supply Chain': Package,
  'Cross-industry': Layers,
};
