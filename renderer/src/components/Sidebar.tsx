import React, { useState } from 'react';
import SearchInTree from './SearchInTree';
import CommitHistory from './CommitHistory';
import { useRepoStore } from '../state/repoStore';

export default function Sidebar() {
  const { isRepo, log } = useRepoStore();
  const [tab, setTab] = useState<'explorer' | 'history'>('explorer');

  return (
    <div className="border-r border-white/5 w-[300px] min-w-[260px] max-w-[380px] flex flex-col bg-ink-50/40">
      {isRepo && (
        <div className="flex border-b border-white/5">
          <button
            className={`tab ${tab === 'explorer' ? 'tab-active' : ''}`}
            onClick={() => setTab('explorer')}
          >
            Explorateur
          </button>
          <button
            className={`tab ${tab === 'history' ? 'tab-active' : ''}`}
            onClick={() => setTab('history')}
          >
            Historique{log.length > 0 ? ` · ${log.length}` : ''}
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        {tab === 'explorer' || !isRepo ? <SearchInTree /> : <CommitHistory />}
      </div>
    </div>
  );
}
