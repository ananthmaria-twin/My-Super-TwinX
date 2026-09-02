import type { PipelineEdge, PipelineNode } from '../../types';

const NODE_WIDTH = 212;

interface PipelineEdgesProps {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  width: number;
  height: number;
}

export function PipelineEdges({ nodes, edges, width, height }: PipelineEdgesProps) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg className="pointer-events-none absolute inset-0" width={width} height={height}>
      <defs>
        <linearGradient id="edgeActive" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {edges.map((edge, i) => {
        const from = byId[edge.from];
        const to = byId[edge.to];
        if (!from || !to) return null;
        const x1 = from.x + NODE_WIDTH;
        const y1 = from.y;
        const x2 = to.x;
        const y2 = to.y;
        const midX = (x1 + x2) / 2;
        const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        const active = from.status === 'complete' && to.status !== 'not-run';

        return (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <path d={path} fill="none" stroke="var(--border-soft)" strokeWidth={2} />
            {active && (
              <path
                d={path}
                fill="none"
                stroke="url(#edgeActive)"
                strokeWidth={2.5}
                strokeDasharray="6 10"
                className="animate-flow"
                opacity={0.9}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
