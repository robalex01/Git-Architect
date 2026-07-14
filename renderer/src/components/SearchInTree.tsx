import React, { useMemo, useState } from 'react';

import { useRepoStore } from '../state/repoStore';

export default function SearchInTree() {
  const { tree, repoPath } = useRepoStore();
  const [q, setQ] = useState('');

  const hits = useMemo(() => {
    if (!tree) return 0;
    const query = q.trim().toLowerCase();
    if (!query) return 0;

    let count = 0;
    const walk = (n: any) => {
      if (!n) return;
      if (String(n.name).toLowerCase().includes(query)) count++;
      if (n.children) for (const c of n.children) walk(c);
    };
    walk(tree);
    return count;
  }, [q, tree]);

  if (!repoPath) return null;

  return (
    <div className="w-full max-w-[340px]">
      <div className="panel-solid p-3 subtle-shadow">
        <div className="text-xs text-zinc-400 mb-2">Recherche</div>

        <input
          className="input w-full"
          placeholder="nom de fichier/dossier"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q.trim() && (
          <div className="text-[11px] text-zinc-500 mt-2">{hits} correspondance(s)</div>
        )}
      </div>
    </div>
  );
}

