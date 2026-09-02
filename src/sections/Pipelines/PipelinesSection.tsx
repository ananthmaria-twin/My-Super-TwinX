import { useEffect, useMemo, useState } from 'react';
import { Hammer, Play, SlidersHorizontal, Clock } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { pipelines, getPipeline } from '../../data/pipelines';
import type { ChatContext, NodeStatus, PipelineNode } from '../../types';
import { PipelineGraph } from './PipelineGraph';
import { NodeDetailPanel } from './NodeDetailPanel';
import { CausalGraphSection } from './CausalGraphSection';
import { ScenarioBuilderModal } from './ScenarioBuilderModal';
import { HistoryPanel } from './HistoryPanel';

interface PipelinesSectionProps {
  pipelineId: string;
  onPipelineChange: (id: string) => void;
  onContext: (context: ChatContext) => void;
}

export function PipelinesSection({ pipelineId, onPipelineChange, onContext }: PipelinesSectionProps) {
  const pipeline = getPipeline(pipelineId);
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [statusOverride, setStatusOverride] = useState<Record<string, NodeStatus>>({});
  const [running, setRunning] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setSelectedNode(null);
    setStatusOverride({});
  }, [pipelineId]);

  const nodesWithStatus = useMemo(
    () => pipeline.nodes.map((n) => ({ ...n, status: statusOverride[n.id] ?? n.status })),
    [pipeline.nodes, statusOverride],
  );

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    const order = pipeline.nodes.map((n) => n.id);
    order.forEach((id, i) => {
      window.setTimeout(() => setStatusOverride((prev) => ({ ...prev, [id]: 'running' })), i * 160);
      window.setTimeout(() => setStatusOverride((prev) => ({ ...prev, [id]: 'complete' })), i * 160 + 500);
    });
    window.setTimeout(() => {
      setRunning(false);
      const kpi = pipeline.nodes.find((n) => n.kind === 'kpi');
      onContext({ type: 'run', pipelineName: pipeline.name, mean: kpi?.metrics?.mean ?? 0.28 });
    }, order.length * 160 + 600);
  };

  const handleSelectNode = (node: PipelineNode) => {
    const withStatus = { ...node, status: statusOverride[node.id] ?? node.status };
    setSelectedNode(withStatus);
    onContext({ type: 'node', node: withStatus, pipelineName: pipeline.name });
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Topbar
        title="Pipelines"
        description="Design, run and review decision pipelines. Run a pipeline to see execution metrics."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScenarioOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-(--border-soft) px-3 py-2 text-xs font-medium text-(--text-secondary) transition-colors hover:border-twin-blue hover:text-twin-blue"
            >
              <Hammer size={14} /> Build
            </button>
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-twin-blue via-twin-teal to-twin-purple px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 disabled:opacity-60"
            >
              <Play size={14} className={running ? 'animate-pulse' : ''} /> {running ? 'Running…' : 'Run'}
            </button>
            <button
              type="button"
              onClick={() => setScenarioOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-(--border-soft) px-3 py-2 text-xs font-medium text-(--text-secondary) transition-colors hover:border-twin-purple hover:text-twin-purple"
            >
              <SlidersHorizontal size={14} /> Scenario
            </button>
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-(--border-soft) px-3 py-2 text-xs font-medium text-(--text-secondary) transition-colors hover:border-twin-teal hover:text-twin-teal"
            >
              <Clock size={14} /> History
            </button>
          </div>
        }
      />

      <div className="px-4 sm:px-8 py-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Dropdown label="Data Source" value="Platform DT" options={['Platform DT']} onChange={() => {}} />
          <Dropdown
            label="Pipeline"
            value={pipeline.id}
            options={pipelines.map((p) => p.id)}
            optionLabels={Object.fromEntries(pipelines.map((p) => [p.id, p.name]))}
            onChange={onPipelineChange}
          />
        </div>

        <div className="flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <PipelineGraph pipeline={{ ...pipeline, nodes: nodesWithStatus }} selectedNodeId={selectedNode?.id ?? null} onSelectNode={handleSelectNode} />
          </div>
          <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>

        <CausalGraphSection onNodeFocus={(node, edgeLabel) => onContext({ type: 'causal', label: edgeLabel ?? node.label })} />
      </div>

      <ScenarioBuilderModal open={scenarioOpen} pipelineName={pipeline.name} onClose={() => setScenarioOpen(false)} />
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} onSelectRun={onPipelineChange} />
    </div>
  );
}

function Dropdown({
  label,
  value,
  options,
  optionLabels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-(--border-soft) bg-(--surface-raised) px-3 py-2 text-xs">
      <span className="text-(--text-muted)">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-medium text-(--text-primary) focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-(--surface-raised) text-(--text-primary)">
            {optionLabels?.[opt] ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}
