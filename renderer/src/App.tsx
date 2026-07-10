import React from 'react';
import { Background } from '@reactflow/background';
import ReactFlow, { Controls, MiniMap } from 'reactflow';

const initialNodes = [
  {
    id: 'root',
    type: 'input',
    data: { label: 'Projet' },
    position: { x: 0, y: 0 },
  },
];

const initialEdges: any[] = [];

export default function App() {
  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100">
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

