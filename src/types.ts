export type NavModuleId =
  | 'catalog'
  | 'configuration'
  | 'pipelines'
  | 'studio'
  | 'datasources'
  | 'digitaltwins'
  | 'livefeatures'
  | 'notebooks'
  | 'operations';

export type TwinTabId =
  | 'overview'
  | 'ontology'
  | 'storage_sync'
  | 'lineage'
  | 'usage'
  | 'sql_query'
  | 'pipelines'
  | 'simulation';

export type EntityTypeId =
  | 'AccountTwin'
  | 'AnalyzerPacket'
  | 'AnalyzerScenarioBid'
  | 'Bill_to_accountTwin'
  | 'BusinessDays'
  | 'DataPersistentMessageInput'
  | 'SyntheticTwins';

export interface TwinAttributeSchema {
  name: string;
  type: 'float' | 'integer' | 'string' | 'boolean' | 'timestamp' | 'array';
  description: string;
  sourcePipeline: string;
  updateFrequency: 'real-time (streaming)' | 'hourly' | 'daily' | 'micro-batch (5m)';
  isPrimaryKey?: boolean;
  isSensitivePII?: boolean;
  driftMonitored: boolean;
  onlineStoreCache: boolean;
  exampleValue: string | number | boolean;
}

export interface DigitalTwinEntity {
  id: string;
  name: string;
  entityType: EntityTypeId;
  displayName: string;
  category: 'Enterprise CRM' | 'Inference Engine' | 'Pricing Optimizer' | 'Billing & ERP' | 'Temporal Model' | 'Message Bus' | 'Counterfactual Cohort';
  description: string;
  version: string;
  status: 'active' | 'syncing' | 'degraded' | 'stale';
  lastSyncedAt: string;
  syncLatencyMs: number;
  totalInstances: number;
  syncFreshness: string;
  tags: string[];
  attributes: Record<string, any>;
  attributeSchemas: TwinAttributeSchema[];
  onlineStore: {
    engine: string;
    ttl: string;
    hitRate: number;
    p99LatencyMs: number;
    keyFormat: string;
  };
  offlineStore: {
    format: string;
    table: string;
    partitionKey: string;
    compactionStrategy: string;
    retentionDays: number;
  };
  lineage: {
    upstream: Array<{ name: string; type: 'source' | 'stream' | 'table'; latency: string }>;
    transformations: Array<{ name: string; engine: 'Flink' | 'Spark' | 'dbt'; cost: string }>;
    downstream: Array<{ name: string; type: 'model' | 'api' | 'dashboard' | 'stream'; sla: string }>;
  };
}

export interface ScenarioSimulationParams {
  discount_rate: number; // 0 - 0.5
  feature_utilization_ratio: number; // 0 - 1
  support_tickets_90d: number; // 0 - 50
  onboarding_intensity: 'Low' | 'Medium' | 'High' | 'Ultra';
  competitor_id: string;
  active_users_30d: number;
  login_count_30d: number;
}

export interface SimulationResult {
  baselineChurn: number;
  simulatedChurn: number;
  churnDelta: number;
  baselineArr: number;
  simulatedArr: number;
  arrDelta: number;
  nrrProjected: number;
  riskCategory: 'Critical Risk' | 'Moderate Risk' | 'Stable Growth' | 'High Expansion';
  aiRecommendations: string[];
  sensitivityFactors: Array<{ factor: string; impact: number; direction: 'positive' | 'negative' }>;
}

export interface PipelineDAGNode {
  id: string;
  label: string;
  type: 'source' | 'transform' | 'twin_sync' | 'validation' | 'export';
  status: 'completed' | 'running' | 'queued' | 'failed';
  executionTime: string;
  throughput: string;
  recordsProcessed: number;
}

export interface PipelineRun {
  id: string;
  name: string;
  entityTarget: string;
  schedule: string;
  status: 'running' | 'succeeded' | 'failed' | 'queued';
  startedAt: string;
  duration: string;
  recordsCount: string;
  errorRate: number;
  dagNodes: PipelineDAGNode[];
  logs: string[];
}

export interface DataSourceConnector {
  id: string;
  name: string;
  type: 'Snowflake' | 'BigQuery' | 'Apache Kafka' | 'PostgreSQL' | 'Amazon S3' | 'Salesforce CRM' | 'Segment Stream';
  status: 'healthy' | 'syncing' | 'degraded' | 'offline';
  throughputMBs: number;
  recordsIngested24h: string;
  lastHeartbeat: string;
  syncMode: 'CDC (Debezium)' | 'Event Stream' | 'Micro-batch' | 'Full Snapshot';
  schemaDriftCount: number;
  activeTwinsBound: number;
}

export interface LiveFeatureMetric {
  featureName: string;
  entity: string;
  dataType: string;
  p99LatencyMs: number;
  qps: number;
  lastUpdated: string;
  cacheHitRatio: number;
  driftStatus: 'Normal' | 'Drift Detected' | 'High Variance';
  sparkline: number[];
}

export interface NotebookCell {
  id: string;
  type: 'code' | 'markdown' | 'query';
  language: 'python' | 'sql' | 'markdown';
  content: string;
  output?: {
    type: 'dataframe' | 'chart' | 'json' | 'text';
    data: any;
    executionTimeMs: number;
    executedAt: string;
  };
  isExecuting?: boolean;
}

export interface NotebookDocument {
  id: string;
  title: string;
  author: string;
  lastRun: string;
  cells: NotebookCell[];
  attachedTwins: string[];
}

export interface DriftMetric {
  id: string;
  feature: string;
  entity: string;
  metricType: 'Kolmogorov-Smirnov' | 'Population Stability Index (PSI)' | 'Wasserstein Distance';
  currentScore: number;
  threshold: number;
  status: 'safe' | 'warning' | 'breach';
  distributionBaseline: number[];
  distributionProduction: number[];
  bins: string[];
  historicalTrend: { date: string; score: number }[];
}

export interface PlatformAlert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  entityRef?: string;
  timestamp: string;
  acknowledged: boolean;
  detail: string;
}

export interface UseCaseItem {
  id: string;
  title: string;
  domainBadge: 'BFSI' | 'Telecom' | 'Automotive' | 'Retail' | 'Energy' | 'Healthcare';
  tags: string[];
  derivedCount: number;
  scenarioCount: number;
  status: 'Published' | 'Draft' | 'Deprecated';
  version?: string;
  creator: string;
  createdDate: string;
  description: string;
  targetTwin: EntityTypeId | string;
  derivedFeatures: string[];
  scenarioPipeline: string;
  coverageScore: number;
  isFavorite?: boolean;
}

export interface UseCaseConfigData {
  useCaseId: string;
  useCaseName: string;
  targetTwin: string;
  fieldMappings: Array<{
    targetField: string;
    targetType: string;
    twinAttribute: string;
    status: 'mapped' | 'unmapped' | 'fallback';
    freshness: string;
    sampleVal: string;
  }>;
  sufficiencyScore: number;
  freshnessScore: number;
  completenessScore: number;
  coverageScore: number;
  warnings: string[];
  validationStatus: 'ready' | 'validating' | 'passed' | 'failed';
  isActivated: boolean;
}

export interface StudioCustomNode {
  id: string;
  name: string;
  category: 'Transformation' | 'Inference' | 'Decision' | 'Ingress' | 'Sink';
  version: string;
  author: string;
  description: string;
  inputContract: Array<{ port: string; type: string; required: boolean }>;
  outputContract: Array<{ port: string; type: string }>;
  codeYaml: string;
  pythonLogic: string;
  contractStatus: 'PASS' | 'WARN' | 'FAIL';
  lastValidated: string;
}

export type WidgetPaletteType =
  | 'kpi-card'
  | 'kpi-trend'
  | 'kpi-gauge'
  | 'kpi-multimetric'
  | 'kpi-twin-health'
  | 'kpi-active-simulations'
  | 'progress'
  | 'line'
  | 'line-step'
  | 'area'
  | 'area-stacked'
  | 'bar'
  | 'stacked-bar'
  | 'pie'
  | 'donut'
  | 'funnel'
  | 'radar'
  | 'table'
  | 'heatmap'
  | 'telemetry-stream'
  | 'anomaly-radar'
  | 'pipeline-throughput'
  | 'scenario-sensitivity'
  | 'sla-compliance'
  | 'twin-feature-vector'
  | 'mini-map-navigator';

export interface CrossFilterState {
  sourceWidgetId: string;
  sourceWidgetTitle: string;
  dimension: string;
  value: string;
  countLabel?: string;
  percentage?: number;
  color?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
  color?: string;
}

export interface FunnelStageData {
  stage: string;
  count: string;
  pct: number;
  color?: string;
}

export interface DonutSegmentData {
  name: string;
  pct: number;
  count: string;
  color: string;
}

export interface DashboardWidget {
  id: string;
  type: WidgetPaletteType;
  title: string;
  subtitle?: string;
  tag: string;
  sourceTwin: string;
  attribute: string;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'P95';
  refreshRate: string;
  value: string;
  secondaryValue?: string;
  secondaryText?: string;
  change: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  colorTheme?: 'indigo' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  width?: 'half' | 'full';
  gridColSpan?: 1 | 2 | 3 | 4;
  visualMode?: 'compact' | 'detailed';
  thresholdWarning?: number;
  thresholdCritical?: number;
  thresholdTarget?: number;
  thresholdUnit?: string;
  dataPoints?: ChartDataPoint[];
  funnelStages?: FunnelStageData[];
  donutSegments?: DonutSegmentData[];
  gaugeScore?: number;
  gaugeTarget?: number;
  tableHeaders?: string[];
  tableRows?: Array<Record<string, string | number>>;
}

export interface DashboardDefinition {
  id: string;
  title: string;
  description: string;
  useCaseId: string;
  showInMenu: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  widgets: DashboardWidget[];
  isDefault?: boolean;
}

