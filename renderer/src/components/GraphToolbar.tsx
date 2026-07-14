import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { FitIcon, PlusIcon, MinusIcon } from './Icons';

export default function GraphToolbar() {
  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const v = getViewport();
      const nextZoom = v.zoom ?? 1;
      setZoom((prev) => (Math.abs(prev - nextZoom) < 0.001 ? prev : nextZoom));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [getViewport]);

  const pct = Math.round(zoom * 100);

  return (
    <div className="z-10">
      <div className="panel-solid subtle-shadow px-1.5 py-1.5 flex items-center gap-1">
        <button className="btn-icon" onClick={() => fitView({ padding: 0.15 })} title="Ajuster à la vue">
          <FitIcon size={14} />
        </button>
        <button className="btn-icon" onClick={() => zoomOut()} title="Zoom arrière">
          <MinusIcon size={14} />
        </button>
        <button className="btn-icon" onClick={() => zoomIn()} title="Zoom avant">
          <PlusIcon size={14} />
        </button>
        <span className="text-[11px] font-mono text-ash-faint px-2 tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}
