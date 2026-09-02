import type { PipelineDefinition, PipelineNode } from '../../types';
import { PipelineEdges } from './PipelineEdges';
import { PipelineNodeCard } from './PipelineNodeCard';

interface PipelineGraphProps {
  pipeline: PipelineDefinition;
  selectedNodeId: string | null;
  onSelectNode: (node: PipelineNode) => void;
}

export function PipelineGraph({ pipeline, selectedNodeId, onSelectNode }: PipelineGraphProps) {
  const width = Math.max(...pipeline.nodes.map((n) => n.x)) + 260;
  const height = Math.max(...pipeline.nodes.map((n) => n.y)) + 90;

  return (
    <div className="bg-mesh overflow-x-auto rounded-2xl border border-(--border-soft) bg-(--surface-raised)/40 p-2">
      <div className="relative" style={{ width, height }}>
        <PipelineEdges nodes={pipeline.nodes} edges={pipeline.edges} width={width} height={height} />
        {pipeline.nodes.map((node) => (
          <PipelineNodeCard key={node.id} node={node} selected={node.id === selectedNodeId} onSelect={onSelectNode} />
        ))}
      </div>
    </div>
  );
}
