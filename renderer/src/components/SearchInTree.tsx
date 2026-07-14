import React, { useMemo, useState } from 'react';

import { useRepoStore } from '../state/repoStore';
import { TreeNode } from '../lib/api';
import { SearchIcon, FileIcon, FolderIcon, XIcon } from './Icons';

interface Hit { path: string; name: string; type: 'file' | 'folder' }

export default function SearchInTree() {
  const { tree, repoPath, openFile } = useRepoStore();
  const [q, setQ] = useState('');

  const hits = useMemo<Hit[]>(() => {
    if (!tree) return [];
    const query = q.trim().toLowerCase();
    if (!query) return [];

    const results: Hit[] = [];
    const walk = (n: TreeNode | null) => {
      if (!n) return;
      if (n.path && String(n.name).toLowerCase().includes(query)) {
        results.push({ path: n.path, name: n.name, type: n.type });
      }
      if (n.children) for (const c of n.children) walk(c);
    };
    walk(tree);
    return results.slice(0, 200);
  }, [q, tree]);

  if (!repoPath) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ash-faint" />
          <input
            className="input w-full pl-8 pr-7"
            placeholder="Rechercher un fichier ou dossier…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ash-faint hover:text-ash-bright"
              onClick={() => setQ('')}
              title="Effacer"
            >
              <XIcon size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {q.trim() && (
          <>
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-ash-faint">
              {hits.length} résultat{hits.length !== 1 ? 's' : ''}
            </div>
            <ul className="px-1.5 pb-2">
              {hits.map((h) => (
                <li key={h.path}>
                  <button
                    onClick={() => h.type === 'file' && openFile(h.path)}
                    disabled={h.type !== 'file'}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12.5px] text-left
                      hover:bg-white/5 disabled:hover:bg-transparent transition-colors"
                    title={h.path}
                  >
                    {h.type === 'folder'
                      ? <FolderIcon size={13} className="text-blueprint shrink-0" />
                      : <FileIcon size={13} className="text-ash shrink-0" />}
                    <span className="truncate text-ash-bright">{h.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {!q.trim() && (
          <div className="px-4 py-6 text-[12px] text-ash-faint text-center">
            Tape un nom pour chercher dans l'arborescence du dépôt.
          </div>
        )}
      </div>
    </div>
  );
}
