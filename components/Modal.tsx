"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  /** Used for the dialog's accessible name only — no visible title bar,
   * so it doesn't compete with the content for space (the form's own
   * Find/List tabs already communicate what the dialog is for). */
  title: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setVisible(true));
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 backdrop-blur-sm transition-opacity duration-200 sm:items-center sm:px-5 sm:py-10 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative min-h-screen w-full bg-white shadow-2xl transition-all duration-200 sm:min-h-0 sm:w-full sm:max-w-2xl sm:rounded-[28px] ${
          visible ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-3 opacity-0 sm:scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-sand-dim text-ink/60 transition hover:bg-line hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-5 pt-16 sm:rounded-[28px] sm:p-8 sm:pt-16">{children}</div>
      </div>
    </div>,
    document.body
  );
}
