import React from 'react';
import { AlertIcon } from './Icons';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-[60]">
      <div className="panel-solid corner-ticks w-[420px] p-5 flex flex-col gap-3 subtle-shadow">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-md ${danger ? 'bg-danger/15 text-danger' : 'bg-signal/15 text-signal'}`}>
            <AlertIcon size={16} />
          </span>
          <h2 className="font-display text-[15px] font-semibold text-ash-bright">{title}</h2>
        </div>

        <p className="text-[13px] leading-relaxed text-ash">{description}</p>

        <div className="flex justify-end gap-2 mt-2">
          <button className="btn" onClick={onCancel}>Annuler</button>
          <button className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
