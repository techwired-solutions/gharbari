"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 px-0 py-0 backdrop-blur-sm sm:items-center sm:px-5 sm:py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="min-h-screen w-full bg-sand sm:min-h-0 sm:w-full sm:max-w-2xl sm:rounded-[28px] sm:shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[28px] border-b border-line bg-white px-5 py-4 sm:px-8">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition hover:bg-sand-dim hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-white p-5 sm:rounded-b-[28px] sm:p-8">{children}</div>
      </div>
    </div>,
    document.body
  );
}
