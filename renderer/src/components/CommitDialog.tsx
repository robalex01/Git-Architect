import React, { useState } from 'react';
import { useRepoStore } from '../state/repoStore';

export default function CommitDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { commit, status } = useRepoStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!open) return null;

  const files = [
    ...(status?.not_added ?? []).map((f: string) => ({ f, tag: 'nouveau' })),
    ...(status?.modified ?? []).map((f: string) => ({ f, tag: 'modifié' })),
    ...(status?.deleted ?? []).map((f: string) => ({ f, tag: 'supprimé' })),
  ];

  const submit = async () => {
    if (!title.trim()) return;
    await commit(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-[520px] p-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">Nouveau commit</h2>

        {files.length > 0 && (
          <div className="max-h-32 overflow-y-auto text-xs text-zinc-400 bg-zinc-950 rounded p-2 border border-zinc-800">
            {files.map(({ f, tag }) => (
              <div key={f} className="flex justify-between">
                <span>{f}</span>
                <span className="text-zinc-500">{tag}</span>
              </div>
            ))}
          </div>
        )}

        <input
          className="input"
          placeholder="Titre du commit"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          className="input h-24 resize-none"
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-2">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={submit} disabled={!title.trim()}>
            Commit &amp; Push
          </button>
        </div>
      </div>
    </div>
  );
}
