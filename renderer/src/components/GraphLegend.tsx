import React from 'react';

export default function GraphLegend() {
  return (
    <div className="pointer-events-none">
      <div className="panel subtle-shadow px-3 py-2">
        <div className="text-[11px] text-zinc-400 mb-2">Légende</div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded" style={{ background: '#1d4ed8' }} />
            <span className="text-[12px] text-zinc-200">Dossier</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded" style={{ background: '#27272a' }} />
            <span className="text-[12px] text-zinc-200">Fichier</span>
          </div>
        </div>
      </div>
    </div>
  );
}



