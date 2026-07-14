import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, Position } from 'reactflow';

import { useRepoStore } from './state/repoStore';
import { TreeNode } from './lib/api';
import Toolbar from './components/Toolbar';
import CommitDialog from './components/CommitDialog';
import GraphLegend from './components/GraphLegend';
import FileViewer from './components/FileViewer';
import GraphToolbar from './components/GraphToolbar';
import SearchInTree from './components/SearchInTree';
import GraphShell from './components/GraphShell';

// Layout très simple : chaque profondeur = une colonne, empilement vertical.
// (Suffisant pour une première version ; à remplacer par un vrai algorithme
// de layout — ex. dagre — quand l'arborescence deviendra volumineuse.)
function buildGraph(tree: TreeNode | null): { nodes: Node[]; edges: Edge[] } {
  if (!tree) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Adaptatif pour éviter des nodes gigantesques sur de grands arbres
  const depthCount = (() => {
    let maxDepth = 0;
    const walk = (n: TreeNode | null, d: number) => {
      if (!n) return;
      maxDepth = Math.max(maxDepth, d);
      if (n.children) for (const c of n.children) walk(c, d + 1);
    };
    walk(tree, 0);
    return maxDepth;
  })();

  const compactFactor = depthCount > 0 ? Math.max(0.6, 1 - depthCount * 0.05) : 1;
  const colWidth = Math.round(160 * compactFactor);
  const rowHeight = Math.round(46 * compactFactor);
  const colCounters: Record<number, number> = {};

  const folderBg = '#2563eb'; // blue-600
  const fileBg = '#18181b'; // zinc-900-ish
  const border = 'rgba(148,163,184,0.22)'; // slate-400/20
  const text = 'rgba(241,245,249,1)'; // slate-50

  function visit(node: TreeNode, depth: number, parentId: string | null) {
    const id = node.path || '__root__';
    const row = colCounters[depth] ?? 0;
    colCounters[depth] = row + 1;

    const isFolder = node.type === 'folder';

    nodes.push({
      id,
      position: { x: depth * colWidth, y: row * rowHeight },
      data: {
        label: (node.name || '(racine)').slice(0, 22) + ((node.name || '(racine)').length > 22 ? '…' : ''),
        type: node.type,
      },
      type: depth === 0 ? 'input' : undefined,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: isFolder ? folderBg : fileBg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: 10,
        fontSize: 11,
        padding: 6,
        boxShadow: 'none',
      },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}->${id}`,
        source: parentId,
        target: id,
        style: {
          stroke: 'rgba(148,163,184,0.35)',
          strokeWidth: 1.2,
        },
      });
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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      message: error?.message ? String(error.message) : String(error),
    };
  }

  componentDidCatch(err: any) {
    // visible in devtools
    // eslint-disable-next-line no-console
    console.error('React render error:', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="h-screen w-screen p-6 bg-zinc-950 text-zinc-100">
        <div className="text-red-300 text-lg font-semibold mb-2">Erreur de rendu</div>
        <div className="text-sm text-zinc-300 mb-4">
          {this.state.message ?? 'Erreur inconnue'}
        </div>
        <div className="text-xs text-zinc-500">
          Ouvrir la console Electron/Renderer pour plus de détails.
        </div>
      </div>
    );
  }
}

export default function App() {
  const { repoPath, tree, error, clearError } = useRepoStore();
  const [commitOpen, setCommitOpen] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => buildGraph(tree), [tree]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 6000);
    return () => clearTimeout(t);
  }, [error, clearError]);

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Toolbar onCommitClick={() => setCommitOpen(true)} />

        {error && (
          <div className="bg-red-900/80 border-b border-red-700 text-red-100 text-sm px-4 py-2 flex justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex-1 relative flex min-h-0 overflow-hidden">
          {/* Left rail: search */}
          <div className="border-r border-zinc-800 w-[340px] min-w-[280px] max-w-[420px] flex flex-col">
            <div className="p-3 border-b border-zinc-800">
              <SearchInTree />
            </div>
            <div className="h-full flex-1">
              <FileViewer filePath={selectedFilePath} />
            </div>
          </div>

          {/* Graph */}
          <div className="flex-1 relative min-w-0 bg-zinc-950">
            {/* In-graph overlays (kept inside graph container, not full-screen absolute) */}
            <div className="absolute left-0 top-0 right-0 z-10 p-3 flex items-start justify-between">
              <GraphToolbar />
              <div className="pl-3">
                <GraphLegend />
              </div>
            </div>

            {!repoPath ? (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                Ouvre un dossier ou clone un dépôt pour commencer.
              </div>
            ) : (
              <GraphShell
                nodes={nodes}
                edges={edges}
                onNodeClick={(nodeId) => {

                  const node = nodes.find((n) => n.id === nodeId);
                  const t = node?.data?.type as string | undefined;
                  if (t === 'file') setSelectedFilePath(String(nodeId));
                }}
              />
            )}
          </div>
        </div>


        <CommitDialog open={commitOpen} onClose={() => setCommitOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}

