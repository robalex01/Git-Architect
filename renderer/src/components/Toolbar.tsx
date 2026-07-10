import React, { useState } from 'react';
import { useRepoStore } from '../state/repoStore';

export default function Toolbar({ onCommitClick }: { onCommitClick: () => void }) {
  const {
    repoPath, isRepo, branch, status, loading,
    openFolder, cloneRepo, initRepo, push, pull, fetch: gitFetch,
  } = useRepoStore();

  const [cloneUrl, setCloneUrl] = useState('');
  const [showClone, setShowClone] = useState(false);

  const changedCount =
    (status?.modified?.length ?? 0) +
    (status?.not_added?.length ?? 0) +
    (status?.deleted?.length ?? 0) +
    (status?.created?.length ?? 0);

  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-3 text-sm text-zinc-200">
      <span className="font-semibold text-blue-400">Git Architect</span>

      <button className="btn" onClick={openFolder}>Ouvrir un dossier</button>

      <div className="relative">
        <button className="btn" onClick={() => setShowClone((v) => !v)}>Cloner</button>
        {showClone && (
          <div className="absolute z-20 top-full mt-1 left-0 bg-zinc-800 border border-zinc-700 rounded p-2 flex gap-2 w-96">
            <input
              className="input flex-1"
              placeholder="https://github.com/user/repo.git"
              value={cloneUrl}
              onChange={(e) => setCloneUrl(e.target.value)}
            />
            <button
              className="btn"
              onClick={() => { if (cloneUrl.trim()) { cloneRepo(cloneUrl.trim()); setShowClone(false); setCloneUrl(''); } }}
            >
              OK
            </button>
          </div>
        )}
      </div>

      {repoPath && !isRepo && (
        <button className="btn" onClick={initRepo}>git init ici</button>
      )}

      <div className="mx-2 h-5 w-px bg-zinc-700" />

      {repoPath ? (
        <>
          <span className="text-zinc-400 truncate max-w-[260px]" title={repoPath}>{repoPath}</span>
          {isRepo && (
            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-blue-300">
              {branch ?? '(no branch)'}
            </span>
          )}
          {isRepo && changedCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-900/50 border border-amber-700 text-amber-300">
              {changedCount} modif.
            </span>
          )}
        </>
      ) : (
        <span className="text-zinc-500">Aucun dépôt ouvert</span>
      )}

      <div className="flex-1" />

      {isRepo && (
        <div className="flex items-center gap-2">
          <button className="btn" onClick={gitFetch} disabled={loading}>Fetch</button>
          <button className="btn" onClick={pull} disabled={loading}>Pull</button>
          <button className="btn btn-primary" onClick={onCommitClick} disabled={loading}>Commit</button>
          <button className="btn" onClick={push} disabled={loading}>Push</button>
        </div>
      )}
    </div>
  );
}
