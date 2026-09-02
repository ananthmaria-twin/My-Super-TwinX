import type { UseCase } from '../types';

export const useCases: UseCase[] = [
  {
    id: 'telecom-competitive-strategy',
    name: 'Telecom Competitive Strategy',
    industry: 'Telecom',
    description: 'Simulate market response to pricing and plan changes against competitor moves.',
    derivedFeatures: 6,
    scenarios: 2,
  },
  {
    id: 'telecom-customer-retention',
    name: 'Telecom Customer Retention',
    industry: 'Telecom',
    description: 'Predict subscriber churn risk from usage, satisfaction and competitor pressure signals.',
    derivedFeatures: 5,
    scenarios: 3,
    pipelineId: 'telecom-retention',
  },
  {
    id: 'banking-fraud-detection',
    name: 'Banking Fraud Detection',
    industry: 'Banking',
    description: 'Score transactions in real time using device, location and velocity features.',
    derivedFeatures: 7,
    scenarios: 4,
    pipelineId: 'banking-fraud',
  },
  {
    id: 'auto-after-sales-driving-risk',
    name: 'Auto After-Sales & Driving Risk',
    industry: 'Automotive',
    description: 'Blend telematics and service history to price after-sales offers and driving risk.',
    derivedFeatures: 4,
    scenarios: 1,
  },
  {
    id: 'logistics-deal-pricing',
    name: 'Logistics Deal Pricing',
    industry: 'Logistics',
    description: 'Optimize freight deal pricing across accessorial rules, lanes and surcharges.',
    derivedFeatures: 5,
    scenarios: 2,
    pipelineId: 'ups-logistics',
  },
  {
    id: 'inventory-optimization',
    name: 'Inventory Optimization',
    industry: 'Supply Chain',
    description: 'Balance stockout and holding cost risk across the distribution network.',
    derivedFeatures: 3,
    scenarios: 1,
  },
  {
    id: 'customer-intelligence-clv',
    name: 'Customer Intelligence & CLV',
    industry: 'Cross-industry',
    description: 'Unify behavioral and transactional signals into a lifetime value score.',
    derivedFeatures: 8,
    scenarios: 2,
  },
  {
    id: 'usbank-wallet-d-lifecycle',
    name: 'US Bank Wallet D Customer Lifecycle',
    industry: 'Banking',
    description:
      'U.S. Bank has a large base of Wallet D customers with average deposit balances below $1,000. This use case models churn risk across the account lifecycle.',
    derivedFeatures: 1,
    scenarios: 1,
    pipelineId: 'usbank-churn',
  },
];

export const industryAccent: Record<UseCase['industry'], string> = {
  Telecom: 'from-blue-500 to-teal-400',
  Banking: 'from-purple-500 to-pink-400',
  Automotive: 'from-teal-500 to-emerald-400',
  Logistics: 'from-blue-500 to-indigo-400',
  'Supply Chain': 'from-amber-500 to-orange-400',
  'Cross-industry': 'from-purple-500 to-blue-400',
};
