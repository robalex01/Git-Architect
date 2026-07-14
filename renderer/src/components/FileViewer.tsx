import React, { useMemo } from 'react';

import { useRepoStore } from '../state/repoStore';
import { FileIcon, XIcon } from './Icons';

const MAX_PREVIEW_CHARS = 200_000;

export default function FileViewer() {
  const { repoPath, fileContent, closeFile } = useRepoStore();

  const fullPath = useMemo(() => {
    if (!repoPath || !fileContent) return null;
    return `${repoPath}/${fileContent.path}`;
  }, [repoPath, fileContent]);

  if (!fileContent) return null;

  const truncated = fileContent.content.length > MAX_PREVIEW_CHARS;
  const shown = truncated ? fileContent.content.slice(0, MAX_PREVIEW_CHARS) : fileContent.content;
  const lines = shown.split('\n');

  return (
    <div className="absolute inset-y-0 right-0 w-[420px] max-w-[46vw] z-20 flex flex-col
      bg-ink-50/95 backdrop-blur border-l border-white/10 shadow-[-16px_0_32px_-16px_rgba(0,0,0,0.5)]">
      <div className="px-4 py-3 border-b border-white/5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2">
          <FileIcon size={15} className="text-blueprint shrink-0" />
          <div className="min-w-0">
            <div className="text-[13px] text-ash-bright font-medium truncate" title={fileContent.path}>
              {fileContent.path.split('/').pop()}
            </div>
            {fullPath && (
              <div className="text-[10.5px] font-mono text-ash-faint truncate" title={fullPath}>
                {fileContent.path}
              </div>
            )}
          </div>
        </div>
        <button className="btn-icon shrink-0" onClick={closeFile} title="Fermer l'aperçu">
          <XIcon size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-auto blueprint-grid">
        {fileContent.loading && (
          <div className="p-4 text-[12.5px] text-ash-faint">Chargement du fichier…</div>
        )}
        {fileContent.error && (
          <div className="p-4 text-[12.5px] text-danger">
            Impossible de lire ce fichier : {fileContent.error}
          </div>
        )}
        {!fileContent.loading && !fileContent.error && (
          <div className="font-mono text-[12px] leading-[1.55]">
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.03]">
                <span className="w-12 shrink-0 select-none text-right pr-3 text-ash-faint/70 tabular-nums">
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-all text-ash-bright pr-4">
                  {line.length ? line : '\u00A0'}
                </span>
              </div>
            ))}
            {truncated && (
              <div className="px-4 py-3 text-[11px] text-ash-faint border-t border-white/5 mt-2">
                Aperçu tronqué — fichier trop volumineux pour un affichage complet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
