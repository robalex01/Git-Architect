import React, { useMemo } from 'react';

import { useRepoStore } from '../state/repoStore';

export default function FileViewer({ filePath }: { filePath: string | null }) {
  const { repoPath } = useRepoStore();

  const fullPath = useMemo(() => {
    if (!repoPath || !filePath) return null;
    return `${repoPath}/${filePath}`;
  }, [repoPath, filePath]);

  // Pour garder le MVP simple : on affiche surtout le chemin.
  // (Prochain step : charger le contenu via api.readFile et montrer un prévisualiseur.)
  if (!filePath) {
    return (
      <div className="h-full flex flex-col">
        <div className="text-zinc-500 text-sm p-4">Clique un fichier dans le graphe pour voir ici.</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
        <div className="text-xs text-zinc-400">Fichier</div>

        <div className="text-sm text-zinc-100 font-medium truncate" title={filePath}>
          {filePath}
        </div>
        {fullPath && (
          <div className="text-[11px] text-zinc-500 truncate" title={fullPath}>
            {fullPath}
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto bg-zinc-950">
        <div className="text-zinc-500 text-sm">
          (Prévisualisation non encore activée dans ce patch.)
        </div>
      </div>
    </div>
  );
}

