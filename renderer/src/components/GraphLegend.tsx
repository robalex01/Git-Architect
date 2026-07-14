import React from 'react';

export default function GraphLegend() {
  return (
    <div className="pointer-events-none">
      <div className="panel-solid subtle-shadow px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wide text-ash-faint mb-2">Légende</div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm border border-signal/60" style={{ background: 'rgba(226,165,66,0.18)' }} />
            <span className="text-[12px] text-ash-bright">Dossier</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm border border-blueprint/50" style={{ background: 'rgba(79,180,199,0.10)' }} />
            <span className="text-[12px] text-ash-bright">Fichier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
