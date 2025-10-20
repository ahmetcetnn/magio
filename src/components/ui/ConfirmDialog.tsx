"use client";
import React from 'react';
import { createPortal } from 'react-dom';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const firstBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstBtnRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Avoid SSR access to document and only render when open
  if (!open || typeof document === 'undefined') return null;

  const dialog = (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 h-full w-full grid place-items-center p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
          <h3 id="confirm-title" className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
          {description ? (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              ref={firstBtnRef}
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-[#929EAE] hover:bg-gray-50 hover:text-gray-900"
              disabled={busy}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={`px-4 py-2 rounded-lg text-sm text-black ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: '#C8EE44' }}
            >
              {busy ? 'Please wait…' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
