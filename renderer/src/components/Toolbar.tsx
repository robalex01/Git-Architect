import React, { useEffect, useRef, useState } from 'react';
import { useRepoStore } from '../state/repoStore';
import BranchSwitcher from './BranchSwitcher';
import ConfirmDialog from './ConfirmDialog';
import {
  OpenFolderIcon, DownloadCloudIcon, RefreshIcon, UploadCloudIcon,
  MoreIcon, ArchiveIcon, UndoIcon,
} from './Icons';

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#4fb4c7" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.6" fill="#e2a542" />
      <path d="M8 9.6V13a2 2 0 0 0 2 2h4M14 12.6V17" stroke="#4fb4c7" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="17" r="1.6" fill="#4fb4c7" />
    </svg>
  );
}

export default function Toolbar({ onCommitClick }: { onCommitClick: () => void }) {
  const {
    repoPath, isRepo, status, loading,
    openFolder, cloneRepo, initRepo, push, pull, fetch: gitFetch, stash, reset,
  } = useRepoStore();

  const [cloneUrl, setCloneUrl] = useState('');
  const [showClone, setShowClone] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [confirmReset, setConfirmReset] = useState<'soft' | 'mixed' | 'hard' | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false);
      if (cloneRef.current && !cloneRef.current.contains(e.target as Node)) setShowClone(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const changedCount =
    (status?.modified?.length ?? 0) +
    (status?.not_added?.length ?? 0) +
    (status?.deleted?.length ?? 0) +
    (status?.created?.length ?? 0);

  return (
    <div className="w-full bg-ink-50 border-b border-white/10 px-3 py-2 flex items-center gap-2 text-sm text-ash-bright shrink-0">
      <div className="flex items-center gap-2 pr-2 mr-1 border-r border-white/10">
        <Logo />
        <span className="font-display font-semibold tracking-tight text-ash-bright">Git Architect</span>
      </div>

      <button className="btn" onClick={openFolder}>
        <OpenFolderIcon size={14} /> Ouvrir
      </button>

      <div className="relative" ref={cloneRef}>
        <button className="btn" onClick={() => setShowClone((v) => !v)}>
          <DownloadCloudIcon size={14} /> Cloner
        </button>
        {showClone && (
          <div className="absolute z-30 top-full mt-1.5 left-0 panel-solid subtle-shadow p-2.5 flex gap-2 w-[26rem]">
            <input
              className="input flex-1"
              placeholder="https://github.com/user/repo.git"
              value={cloneUrl}
              onChange={(e) => setCloneUrl(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && cloneUrl.trim()) {
                  cloneRepo(cloneUrl.trim()); setShowClone(false); setCloneUrl('');
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => { if (cloneUrl.trim()) { cloneRepo(cloneUrl.trim()); setShowClone(false); setCloneUrl(''); } }}
            >
              Cloner
            </button>
          </div>
        )}
      </div>

      {repoPath && !isRepo && (
        <button className="btn" onClick={initRepo}>Initialiser (git init)</button>
      )}

      <div className="mx-1 h-5 w-px bg-white/10" />

      {repoPath ? (
        <>
          <span className="text-ash font-mono text-[12px] truncate max-w-[220px]" title={repoPath}>
            {repoPath}
          </span>
          {isRepo && <BranchSwitcher />}
          {isRepo && changedCount > 0 && (
            <span className="chip bg-signal/10 border-signal/40 text-signal">
              {changedCount} modif.
            </span>
          )}
        </>
      ) : (
        <span className="text-ash-faint">Aucun dépôt ouvert</span>
      )}

      <div className="flex-1" />

      {isRepo && (
        <div className="flex items-center gap-2">
          <button className="btn" onClick={gitFetch} disabled={loading} title="Fetch">
            <RefreshIcon size={14} /> Fetch
          </button>
          <button className="btn" onClick={pull} disabled={loading} title="Pull">
            <DownloadCloudIcon size={14} /> Pull
          </button>
          <button className="btn btn-primary" onClick={onCommitClick} disabled={loading}>
            Commit
          </button>
          <button className="btn" onClick={push} disabled={loading} title="Push">
            <UploadCloudIcon size={14} /> Push
          </button>

          <div className="relative" ref={moreRef}>
            <button className="btn-icon" onClick={() => setShowMore((v) => !v)} title="Plus d'actions">
              <MoreIcon size={15} />
            </button>
            {showMore && (
              <div className="absolute z-30 top-full mt-1.5 right-0 panel-solid subtle-shadow w-56 p-1.5">
                <button
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-[13px] text-ash-bright hover:bg-white/5"
                  onClick={() => { stash(); setShowMore(false); }}
                >
                  <ArchiveIcon size={14} className="text-blueprint" /> Stash (mettre de côté)
                </button>
                <div className="my-1 border-t border-white/5" />
                <div className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-wide text-ash-faint">Reset</div>
                {(['soft', 'mixed', 'hard'] as const).map((mode) => (
                  <button
                    key={mode}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-[13px] text-ash-bright hover:bg-white/5"
                    onClick={() => { setConfirmReset(mode); setShowMore(false); }}
                  >
                    <UndoIcon size={14} className={mode === 'hard' ? 'text-danger' : 'text-blueprint'} />
                    --{mode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmReset !== null}
        title={`Reset --${confirmReset}`}
        danger={confirmReset === 'hard'}
        description={
          confirmReset === 'hard'
            ? "Cette action réécrit l'index ET l'arbre de travail : toutes les modifications non commitées seront définitivement perdues."
            : confirmReset === 'mixed'
              ? "L'index sera réinitialisé mais les modifications resteront présentes dans le dossier de travail."
              : "Seul l'index (HEAD) sera déplacé ; l'index et le dossier de travail restent inchangés."
        }
        confirmLabel={`Reset --${confirmReset}`}
        onCancel={() => setConfirmReset(null)}
        onConfirm={() => { if (confirmReset) reset(confirmReset); setConfirmReset(null); }}
      />
    </div>
  );
}
