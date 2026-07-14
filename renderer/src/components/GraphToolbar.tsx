import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';

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
      <div className="panel-solid subtle-shadow px-2 py-2 flex items-center gap-1">
        <button className="btn" onClick={() => fitView()} title="Fit view">
          Fit
        </button>
        <button className="btn" onClick={() => zoomOut()} title="Zoom out">
          −
        </button>
        <button className="btn" onClick={() => zoomIn()} title="Zoom in">
          +
        </button>
        <span className="text-[11px] text-zinc-400 pl-2">{pct}%</span>
      </div>
    </div>
  );
}



