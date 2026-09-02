export type SectionId =
  | 'digital-twins'
  | 'live-features'
  | 'use-cases'
  | 'pipelines'
  | 'studio'
  | 'model-drift'
  | 'monitoring';

export interface NavItem {
  id: SectionId;
  label: string;
  group: 'Platform' | 'Operations';
  soon?: boolean;
}

export type NodeStatus = 'not-run' | 'running' | 'complete';

export type NodeKind = 'input' | 'calculation' | 'kpi' | 'model' | 'rollup';

export interface PipelineNode {
  id: string;
  kind: NodeKind;
  label: string;
  sublabel?: string;
  status: NodeStatus;
  x: number;
  y: number;
  source?: string;
  alignment?: string;
  baseEntity?: string;
  formula?: string;
  metrics?: {
    mean: number;
    ciLow: number;
    ciHigh: number;
    cvar: number;
  };
  sampleRows?: Record<string, string | number>[];
}

export interface PipelineEdge {
  from: string;
  to: string;
}

export interface PipelineDefinition {
  id: string;
  name: string;
  dataSource: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

export interface CausalNode {
  id: string;
  label: string;
  icon: 'price' | 'quality' | 'shield' | 'smile' | 'pulse' | 'warning';
  x: number;
  y: number;
}

export interface CausalEdge {
  from: string;
  to: string;
  coefficient: number;
}

export interface CausalEffect {
  factor: string;
  direct: number;
  mediated: number;
  total: number;
}

export interface UseCase {
  id: string;
  name: string;
  industry: 'Telecom' | 'Banking' | 'Automotive' | 'Logistics' | 'Supply Chain' | 'Cross-industry';
  description: string;
  derivedFeatures: number;
  scenarios: number;
  pipelineId?: string;
}

export interface EntityAttribute {
  name: string;
  type: string;
}

export interface Entity {
  id: string;
  name: string;
  rows: number;
  attributes: EntityAttribute[];
  category: 'logistics' | 'banking' | 'customer' | 'automotive' | 'lending' | 'subscription';
  sampleData: Record<string, string | number>[];
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  suggestions?: string[];
}

export type ChatContext =
  | { type: 'section'; section: SectionId }
  | { type: 'node'; node: PipelineNode; pipelineName: string }
  | { type: 'entity'; entity: Entity }
  | { type: 'use-case'; useCase: UseCase }
  | { type: 'causal'; label: string }
  | { type: 'run'; pipelineName: string; mean: number };
