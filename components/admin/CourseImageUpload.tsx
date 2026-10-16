'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_MB = 5;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

/**
 * Picks a course image and shows what will be saved. The file itself is sent
 * with the form and uploaded by the server action, so there is no separate
 * upload step to get out of sync with the rest of the course.
 *
 * `image_url` carries the already-saved URL through unchanged, and
 * `image_remove` tells the action to clear it.
 */
export function CourseImageUpload({
  currentUrl,
  error,
}: {
  currentUrl?: string | null;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [tooBig, setTooBig] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Object URLs for the local preview have to be released again.
  useEffect(() => {
    if (!fileName || !preview?.startsWith('blob:')) return;
    const url = preview;
    return () => URL.revokeObjectURL(url);
  }, [fileName, preview]);

  function choose(file: File | undefined) {
    if (!file) return;
    setTooBig(file.size > MAX_MB * 1024 * 1024);
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setRemoved(false);
  }

  function clear() {
    setPreview(null);
    setFileName(null);
    setTooBig(false);
    setRemoved(Boolean(currentUrl));
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-28 w-36 shrink-0 items-center justify-center overflow-hidden border border-ink-400 bg-ink-50">
          {preview ? (
            // Local object URLs and Supabase URLs alike; next/image adds
            // nothing useful for a small admin thumbnail.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-7 w-7 text-ink-300" strokeWidth={1.5} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 border border-ink-950 bg-background px-4 py-2 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-950 transition-colors hover:bg-ink-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
            >
              <Upload className="h-4 w-4" />
              {preview ? 'Change image' : 'Upload image'}
            </button>
            {preview ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 border border-ink-400 bg-background px-4 py-2 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-600 transition-colors hover:border-error hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950 focus-visible:ring-offset-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            ) : null}
          </div>

          <p
            className={cn(
              'mt-2 break-words text-xs',
              tooBig ? 'font-medium text-error' : 'text-ink-500',
            )}
          >
            {tooBig
              ? `That image is larger than ${MAX_MB} MB. Choose a smaller one.`
              : fileName
                ? `Selected: ${fileName}. It uploads when you save.`
                : removed
                  ? 'The image will be removed when you save.'
                  : `JPEG, PNG, WebP or AVIF, up to ${MAX_MB} MB.`}
          </p>

          {error ? (
            <p className="mt-1.5 text-sm text-error">{error}</p>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        name="image_file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => choose(e.target.files?.[0])}
      />
      {/* Keeps the saved image when no new file is chosen. */}
      <input type="hidden" name="image_url" value={removed ? '' : (currentUrl ?? '')} />
      <input type="hidden" name="image_remove" value={removed ? '1' : '0'} />
    </div>
  );
}
