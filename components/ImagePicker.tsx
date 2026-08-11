"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { MAX_LISTING_IMAGES, uploadListingImage, ImageUploadError } from "@/lib/upload-image";

export function ImagePicker({
  value,
  onChange,
  label,
  helpText,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
  helpText?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_LISTING_IMAGES - value.length;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, remaining);
    setError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        try {
          uploaded.push(await uploadListingImage(file));
        } catch (err) {
          setError(err instanceof ImageUploadError ? err.message : "Could not upload photo.");
          break;
        }
      }
      if (uploaded.length) onChange([...value, ...uploaded]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      {helpText && <p className="mb-2 text-xs text-ink/50">{helpText}</p>}

      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div key={url} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URLs, not a local asset */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white transition hover:bg-clay-dark"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-ink/50 transition hover:border-leaf hover:text-leaf disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-[11px] font-medium">{uploading ? "Uploading…" : "Add photo"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs font-medium text-clay-dark">{error}</p>}
    </div>
  );
}
