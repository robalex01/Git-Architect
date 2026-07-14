import React, { useEffect, useRef, useState } from 'react';
import { useRepoStore } from '../state/repoStore';
import { GitBranchIcon } from './Icons';

export default function BranchSwitcher() {
  const { branch, branches, loading, checkout } = useRepoStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const list = branches?.all ?? [];

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn"
        onClick={() => setOpen((v) => !v)}
        title="Changer de branche"
      >
        <GitBranchIcon size={14} className="text-blueprint" />
        <span className="max-w-[140px] truncate">{branch ?? '—'}</span>
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1.5 left-0 panel-solid subtle-shadow w-64 max-h-72 overflow-y-auto p-1.5">
          <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-ash-faint">Branches locales &amp; distantes</div>
          {list.length === 0 && (
            <div className="px-2 py-2 text-[12px] text-ash">Aucune branche trouvée.</div>
          )}
          {list.map((b) => {
            const isCurrent = b === branch;
            return (
              <button
                key={b}
                disabled={isCurrent || loading}
                onClick={() => { checkout(b); setOpen(false); }}
                className={`w-full text-left px-2 py-1.5 rounded text-[12.5px] font-mono flex items-center justify-between
                  ${isCurrent ? 'text-signal bg-signal/10' : 'text-ash-bright hover:bg-white/5'}
                  disabled:cursor-default transition-colors`}
              >
                <span className="truncate">{b}</span>
                {isCurrent && <span className="text-[10px] text-signal shrink-0 ml-2">actuelle</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
