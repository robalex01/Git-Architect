import React, { useState } from 'react';
import { useRepoStore } from '../state/repoStore';

export default function CommitDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { commit, status, loading } = useRepoStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!open) return null;

  const files = [
    ...(status?.not_added ?? []).map((f: string) => ({ f, tag: 'nouveau', color: 'text-success' })),
    ...(status?.modified ?? []).map((f: string) => ({ f, tag: 'modifié', color: 'text-signal' })),
    ...(status?.deleted ?? []).map((f: string) => ({ f, tag: 'supprimé', color: 'text-danger' })),
  ];

  const submit = async () => {
    if (!title.trim()) return;
    await commit(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="panel-solid corner-ticks w-[540px] p-5 flex flex-col gap-3.5 subtle-shadow">
        <div>
          <h2 className="font-display text-[16px] font-semibold text-ash-bright">Nouveau commit</h2>
          <p className="text-[12px] text-ash-faint mt-0.5">Toutes les modifications listées ci-dessous seront incluses.</p>
        </div>

        {files.length > 0 && (
          <div className="max-h-36 overflow-y-auto text-[12px] font-mono bg-ink rounded-md p-2.5 border border-white/10">
            {files.map(({ f, tag, color }) => (
              <div key={f} className="flex justify-between gap-3 py-0.5">
                <span className="text-ash-bright truncate">{f}</span>
                <span className={`shrink-0 ${color}`}>{tag}</span>
              </div>
            ))}
          </div>
        )}
        {files.length === 0 && (
          <div className="text-[12px] text-ash-faint bg-ink rounded-md p-2.5 border border-white/10">
            Aucune modification détectée dans l'arbre de travail.
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
          className="input h-24 resize-none font-mono text-[12.5px]"
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-1">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={submit} disabled={!title.trim() || loading}>
            {loading ? 'Envoi…' : 'Commit & Push'}
          </button>
        </div>
      </div>
    </div>
  );
}
