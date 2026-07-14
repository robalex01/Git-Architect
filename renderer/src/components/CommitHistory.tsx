import React from 'react';
import { useRepoStore } from '../state/repoStore';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString();
}

export default function CommitHistory() {
  const { log, repoPath } = useRepoStore();

  if (!repoPath) return null;

  if (log.length === 0) {
    return (
      <div className="p-4 text-[12.5px] text-ash-faint">
        Aucun commit pour l'instant. Le premier commit apparaîtra ici.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-1">
      <ul className="relative px-3">
        {/* Ligne verticale façon "trait de coupe" de plan technique */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-blueprint-dim" />
        {log.map((commit) => (
          <li key={commit.hash} className="relative pl-6 py-2 group">
            <span className="absolute left-[15px] top-[13px] h-2 w-2 rounded-full bg-blueprint border-2 border-ink group-hover:bg-signal transition-colors" />
            <div className="text-[13px] text-ash-bright leading-snug line-clamp-2">{commit.message}</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-ash-faint">
              <span className="font-mono text-blueprint/80">{String(commit.hash).slice(0, 7)}</span>
              <span>·</span>
              <span className="truncate max-w-[110px]">{commit.author_name}</span>
              <span>·</span>
              <span>{timeAgo(commit.date)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
