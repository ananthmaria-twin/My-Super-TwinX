import type { Entity } from '../types';
import { makeRows } from './random';

export const entities: Entity[] = [
  {
    id: 'accessorial-eligibility-rule',
    name: 'AccessorialEligibilityRule',
    rows: 8,
    category: 'logistics',
    attributes: [
      { name: 'rule_id', type: 'string' },
      { name: 'country_code', type: 'string' },
      { name: 'inclusion_exclusion_code', type: 'string' },
      { name: 'service_level', type: 'string' },
    ],
    sampleData: makeRows(6, 101, (rnd, i) => ({
      rule_id: `RULE-${1000 + i}`,
      country_code: ['US', 'CA', 'MX', 'DE', 'IN'][Math.floor(rnd() * 5)],
      inclusion_exclusion_code: rnd() > 0.5 ? 'INCLUDE' : 'EXCLUDE',
      service_level: ['Standard', 'Express', 'Freight'][Math.floor(rnd() * 3)],
    })),
  },
  {
    id: 'accessorial-rate',
    name: 'AccessorialRate',
    rows: 210,
    category: 'logistics',
    attributes: [
      { name: 'rate_id', type: 'string' },
      { name: 'surcharge_type', type: 'string' },
      { name: 'rate_amount', type: 'number' },
      { name: 'currency', type: 'string' },
    ],
    sampleData: makeRows(6, 202, (rnd, i) => ({
      rate_id: `RATE-${2000 + i}`,
      surcharge_type: ['Fuel', 'Residential', 'Liftgate', 'Oversize'][Math.floor(rnd() * 4)],
      rate_amount: Number((5 + rnd() * 95).toFixed(2)),
      currency: 'USD',
    })),
  },
  {
    id: 'accessorial-surcharge',
    name: 'AccessorialSurcharge',
    rows: 6,
    category: 'logistics',
    attributes: [
      { name: 'surcharge_id', type: 'string' },
      { name: 'applies_to', type: 'string' },
      { name: 'pct_uplift', type: 'number' },
    ],
    sampleData: makeRows(6, 303, (rnd, i) => ({
      surcharge_id: `SUR-${3000 + i}`,
      applies_to: ['Base Rate', 'Total Shipment', 'Weight Tier'][Math.floor(rnd() * 3)],
      pct_uplift: Number((rnd() * 12).toFixed(1)),
    })),
  },
  {
    id: 'bank-account',
    name: 'BankAccount',
    rows: 600,
    category: 'banking',
    attributes: [
      { name: 'account_id', type: 'string' },
      { name: 'balance', type: 'number' },
      { name: 'fees', type: 'number' },
      { name: 'churn_flag', type: 'boolean' },
    ],
    sampleData: makeRows(8, 404, (rnd, i) => ({
      account_id: `ACC-${40000 + i}`,
      balance: Number((rnd() * 5000).toFixed(2)),
      fees: Number((rnd() * 45).toFixed(2)),
      churn_flag: rnd() > 0.82 ? 'true' : 'false',
    })),
  },
  {
    id: 'customer',
    name: 'Customer',
    rows: 1600,
    category: 'customer',
    attributes: [
      { name: 'customer_id', type: 'string' },
      { name: 'age', type: 'number' },
      { name: 'satisfaction_score', type: 'number' },
      { name: 'churn_risk', type: 'number' },
    ],
    sampleData: makeRows(8, 505, (rnd, i) => ({
      customer_id: `CUST-${50000 + i}`,
      age: 18 + Math.floor(rnd() * 60),
      satisfaction_score: Number((rnd() * 100).toFixed(1)),
      churn_risk: Number((rnd() * 0.9 + 0.05).toFixed(3)),
    })),
  },
  {
    id: 'dealer',
    name: 'Dealer',
    rows: 40,
    category: 'automotive',
    attributes: [
      { name: 'dealer_id', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'sales_volume', type: 'number' },
      { name: 'satisfaction_score', type: 'number' },
    ],
    sampleData: makeRows(6, 606, (rnd, i) => ({
      dealer_id: `DLR-${600 + i}`,
      region: ['Northeast', 'Midwest', 'South', 'West'][Math.floor(rnd() * 4)],
      sales_volume: Math.floor(rnd() * 400),
      satisfaction_score: Number((rnd() * 100).toFixed(1)),
    })),
  },
  {
    id: 'connected-vehicle',
    name: 'ConnectedVehicle',
    rows: 500,
    category: 'automotive',
    attributes: [
      { name: 'vehicle_id', type: 'string' },
      { name: 'mileage', type: 'number' },
      { name: 'service_events', type: 'number' },
      { name: 'risk_score', type: 'number' },
    ],
    sampleData: makeRows(8, 707, (rnd, i) => ({
      vehicle_id: `VIN-${70000 + i}`,
      mileage: Math.floor(rnd() * 120000),
      service_events: Math.floor(rnd() * 12),
      risk_score: Number((rnd() * 100).toFixed(1)),
    })),
  },
  {
    id: 'loan-592',
    name: 'Loan592',
    rows: 1000,
    category: 'lending',
    attributes: [
      { name: 'loan_id', type: 'string' },
      { name: 'principal', type: 'number' },
      { name: 'apr', type: 'number' },
      { name: 'delinquency_flag', type: 'boolean' },
    ],
    sampleData: makeRows(8, 808, (rnd, i) => ({
      loan_id: `LOAN-${8000 + i}`,
      principal: Math.floor(2000 + rnd() * 48000),
      apr: Number((3 + rnd() * 18).toFixed(2)),
      delinquency_flag: rnd() > 0.88 ? 'true' : 'false',
    })),
  },
  {
    id: 'reduce-churn-subscription',
    name: 'ReduceChurnForSubscriptionCustomersSystem',
    rows: 860,
    category: 'subscription',
    attributes: [
      { name: 'subscription_id', type: 'string' },
      { name: 'watch_time_hrs', type: 'number' },
      { name: 'subscription_fee', type: 'number' },
      { name: 'churn_flag', type: 'boolean' },
    ],
    sampleData: makeRows(8, 909, (rnd, i) => ({
      subscription_id: `SUB-${9000 + i}`,
      watch_time_hrs: Number((rnd() * 40).toFixed(1)),
      subscription_fee: Number((5 + rnd() * 15).toFixed(2)),
      churn_flag: rnd() > 0.8 ? 'true' : 'false',
    })),
  },
];

export const entityGroups = {
  core: entities.slice(0, 3),
  ontology: entities.slice(3),
};
