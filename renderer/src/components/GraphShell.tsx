import React, { memo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Handle, Position } from 'reactflow';
import type { Node, Edge, NodeProps } from 'reactflow';
import { FolderIcon, FileIcon } from './Icons';

// Noeuds "plan d'architecte" : cartouche avec coins de repérage, façon
// symboles techniques sur un plan de bâtiment — c'est la signature
// visuelle du graphe (cohérente avec le nom "Git Architect").
const FolderNode = memo(({ data, selected }: NodeProps) => (
  <div
    className={`corner-ticks inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1.5 border text-[11px] font-medium
      bg-signal/10 border-signal/50 text-ash-bright transition-shadow whitespace-nowrap w-fit
      ${selected ? 'shadow-[0_0_0_2px_rgba(226,165,66,0.5)]' : ''}`}
  >
    <Handle type="target" position={Position.Left} className="!bg-blueprint !border-0 !w-1.5 !h-1.5" />
    <FolderIcon size={12} className="text-signal shrink-0" />
    <span className="truncate max-w-[140px]">{data.label}</span>
    <Handle type="source" position={Position.Right} className="!bg-blueprint !border-0 !w-1.5 !h-1.5" />
  </div>
));

const FileNode = memo(({ data, selected }: NodeProps) => (
  <div
    className={`corner-ticks inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1.5 border text-[11px]
      bg-ink-100 border-blueprint/30 text-ash-bright hover:border-blueprint/60 cursor-pointer transition-colors whitespace-nowrap w-fit
      ${selected ? 'shadow-[0_0_0_2px_rgba(79,180,199,0.5)]' : ''}`}
  >
    <Handle type="target" position={Position.Left} className="!bg-blueprint/60 !border-0 !w-1.5 !h-1.5" />
    <FileIcon size={12} className="text-ash shrink-0" />
    <span className="truncate max-w-[140px]">{data.label}</span>
  </div>
));

const nodeTypes = { folderNode: FolderNode, fileNode: FileNode };
const defaultEdgeOptions = {
  type: 'smoothstep' as const,
  style: { stroke: 'rgba(79,180,199,0.4)', strokeWidth: 1.2 },
};

export default function GraphShell({
  nodes,
  edges,
  onNodeClick,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
}) {
  return (
    <div className="relative w-full h-full blueprint-grid">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.05}
        maxZoom={2}
        panOnDrag
        zoomOnScroll
        nodesDraggable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => {
          if (node?.id && onNodeClick) onNodeClick(String(node.id));
        }}
      >
        <Background gap={16} size={1} color="rgba(79,180,199,0.06)" />
        <MiniMap
          nodeStrokeColor="#0c1013"
          nodeColor={(n) => (n.type === 'folderNode' ? '#e2a542' : '#4fb4c7')}
          maskColor="rgba(12,16,19,0.75)"
          pannable
          zoomable
          className="!bg-ink-50 !border !border-white/10 !rounded-lg"
        />
        <Controls showInteractive={false} className="!shadow-none [&>button]:!bg-ink-50 [&>button]:!border-white/10 [&>button]:!text-ash-bright" />
      </ReactFlow>
    </div>
  );
}
