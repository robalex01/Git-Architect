import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useRepoStore } from './state/repoStore';
import { TreeNode } from './lib/api';
import Toolbar from './components/Toolbar';
import CommitDialog from './components/CommitDialog';

// Layout très simple : chaque profondeur = une colonne, empilement vertical.
// (Suffisant pour une première version ; à remplacer par un vrai algorithme
// de layout — ex. dagre — quand l'arborescence deviendra volumineuse.)
function buildGraph(tree: TreeNode | null): { nodes: Node[]; edges: Edge[] } {
  if (!tree) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const colWidth = 220;
  const rowHeight = 70;
  const colCounters: Record<number, number> = {};

  function visit(node: TreeNode, depth: number, parentId: string | null) {
    const id = node.path || '__root__';
    const row = colCounters[depth] ?? 0;
    colCounters[depth] = row + 1;

    nodes.push({
      id,
      position: { x: depth * colWidth, y: row * rowHeight },
      data: { label: node.name || '(racine)' },
      type: depth === 0 ? 'input' : undefined,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: node.type === 'folder' ? '#1d4ed8' : '#27272a',
        color: 'white',
        border: '1px solid #3f3f46',
        borderRadius: 6,
        fontSize: 12,
        padding: 6,
      },
    });

    if (parentId) {
      edges.push({ id: `${parentId}->${id}`, source: parentId, target: id });
    }

    if (node.children) {
      for (const child of node.children) {
        visit(child, depth + 1, id);
      }
    }
  }

  visit(tree, 0, null);
  return { nodes, edges };
}

export default function App() {
  const { repoPath, tree, error, clearError } = useRepoStore();
  const [commitOpen, setCommitOpen] = useState(false);

  const { nodes, edges } = useMemo(() => buildGraph(tree), [tree]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 6000);
    return () => clearTimeout(t);
  }, [error, clearError]);

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Toolbar onCommitClick={() => setCommitOpen(true)} />

      {error && (
        <div className="bg-red-900/80 border-b border-red-700 text-red-100 text-sm px-4 py-2 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="flex-1 relative">
        {!repoPath ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
            Ouvre un dossier ou clone un dépôt pour commencer.
          </div>
        ) : (
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        )}
      </div>

      <CommitDialog open={commitOpen} onClose={() => setCommitOpen(false)} />
    </div>
  );
}
