import React, { useEffect, useMemo, useState } from 'react';
import { Node, Edge } from 'reactflow';

import { useRepoStore } from './state/repoStore';
import { TreeNode } from './lib/api';
import Toolbar from './components/Toolbar';
import CommitDialog from './components/CommitDialog';
import GraphLegend from './components/GraphLegend';
import FileViewer from './components/FileViewer';
import GraphToolbar from './components/GraphToolbar';
import GraphShell from './components/GraphShell';
import Sidebar from './components/Sidebar';
import { AlertIcon, CheckCircleIcon, XIcon, OpenFolderIcon } from './components/Icons';

// Layout simple : chaque profondeur = une colonne, empilement vertical.
// (Suffisant pour une première version ; à remplacer par un vrai algorithme
// de layout — ex. dagre — quand l'arborescence deviendra volumineuse.)
function buildGraph(tree: TreeNode | null): { nodes: Node[]; edges: Edge[] } {
  if (!tree) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

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
  const colWidth = Math.round(190 * compactFactor);
  const rowHeight = Math.round(40 * compactFactor);
  const rowCounter = { n: 0 };

  // Layout d'arbre : une feuille (fichier, ou dossier vide) prend la
  // prochaine "ligne" disponible ; un dossier se positionne au centre
  // vertical de ses enfants (moyenne min/max). Ça garde chaque sous-arbre
  // visuellement groupé et évite les arêtes qui repartent loin en haut/en
  // bas de l'écran.
  function layout(node: TreeNode, depth: number, parentId: string | null): number {
    const id = node.path || '__root__';
    const isFolder = node.type === 'folder';
    const label = (node.name || '(racine)').slice(0, 24) + ((node.name || '(racine)').length > 24 ? '…' : '');

    let y: number;
    if (node.children && node.children.length > 0) {
      const childYs = node.children.map((c) => layout(c, depth + 1, id));
      y = (Math.min(...childYs) + Math.max(...childYs)) / 2;
    } else {
      y = rowCounter.n * rowHeight;
      rowCounter.n += 1;
    }

    nodes.push({
      id,
      position: { x: depth * colWidth, y },
      type: isFolder ? 'folderNode' : 'fileNode',
      data: { label, type: node.type },
    });

    if (parentId) {
      edges.push({ id: `${parentId}->${id}`, source: parentId, target: id });
    }

    return y;
  }

  layout(tree, 0, null);
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
    // eslint-disable-next-line no-console
    console.error('React render error:', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="h-screen w-screen p-6 bg-ink text-ash-bright">
        <div className="text-danger text-lg font-semibold mb-2">Erreur de rendu</div>
        <div className="text-sm text-ash mb-4">{this.state.message ?? 'Erreur inconnue'}</div>
        <div className="text-xs text-ash-faint">Ouvrir la console Electron/Renderer pour plus de détails.</div>
      </div>
    );
  }
}

export default function App() {
  const { repoPath, tree, error, notice, clearError, clearNotice, openFile } = useRepoStore();
  const [commitOpen, setCommitOpen] = useState(false);

  const { nodes, edges } = useMemo(() => buildGraph(tree), [tree]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 6000);
    return () => clearTimeout(t);
  }, [error, clearError]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(clearNotice, 3500);
    return () => clearTimeout(t);
  }, [notice, clearNotice]);

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen flex flex-col bg-ink text-ash-bright font-sans overflow-hidden">
        <Toolbar onCommitClick={() => setCommitOpen(true)} />

        {error && (
          <div className="bg-danger-dim border-b border-danger/40 text-ash-bright text-[13px] px-4 py-2 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2"><AlertIcon size={14} className="text-danger shrink-0" />{error}</span>
            <button onClick={clearError} className="text-ash-faint hover:text-ash-bright shrink-0">
              <XIcon size={13} />
            </button>
          </div>
        )}
        {notice && !error && (
          <div className="bg-success-dim border-b border-success/40 text-ash-bright text-[13px] px-4 py-2 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2"><CheckCircleIcon size={14} className="text-success shrink-0" />{notice}</span>
            <button onClick={clearNotice} className="text-ash-faint hover:text-ash-bright shrink-0">
              <XIcon size={13} />
            </button>
          </div>
        )}

        <div className="flex-1 relative flex min-h-0 overflow-hidden">
          <Sidebar />

          <div className="flex-1 relative min-w-0 bg-ink">
            <div className="absolute left-0 top-0 right-0 z-10 p-3 flex items-start justify-between pointer-events-none [&>*]:pointer-events-auto">
              <GraphToolbar />
              <GraphLegend />
            </div>

            {!repoPath ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ash-faint blueprint-grid">
                <div className="corner-ticks px-6 py-5 text-center">
                  <OpenFolderIcon size={22} className="mx-auto mb-3 text-blueprint" />
                  <div className="text-ash-bright text-[14px] font-medium mb-1">Aucun dépôt ouvert</div>
                  <div className="text-[12.5px]">Ouvre un dossier ou clone un dépôt pour visualiser sa structure.</div>
                </div>
              </div>
            ) : (
              <GraphShell
                nodes={nodes}
                edges={edges}
                onNodeClick={(nodeId) => {
                  const node = nodes.find((n) => n.id === nodeId);
                  if (node?.type === 'fileNode') openFile(nodeId);
                }}
              />
            )}

            <FileViewer />
          </div>
        </div>

        <CommitDialog open={commitOpen} onClose={() => setCommitOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}
