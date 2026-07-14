import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowInstance } from 'reactflow';
import type { Node, Edge } from 'reactflow';

// NOTE: Do not recreate `nodeTypes` / `edgeTypes` objects inside render.
// Keeping them undefined avoids React Flow warning when no custom types are provided.

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
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => {
          if (node?.id && onNodeClick) onNodeClick(String(node.id));
        }}
      >
        <Background gap={32} size={1} color="#334155" />
        <MiniMap
          nodeStrokeColor="#0b1220"
          nodeColor="#0b1220"
          maskColor="#0b1220"
          pannable
          zoomable
        />
        <Controls showInteractive={false} />
      </ReactFlow>

    </div>
  );
}

