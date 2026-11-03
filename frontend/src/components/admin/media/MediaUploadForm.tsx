"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

import { MAX_ALT_TEXT } from "@/schemas/mediaSchemas";
import type { MediaAsset } from "@/types/media";

// The upload form shared by the Media Library and the image picker. The file goes to
// the Route Handler as multipart/form-data, which forwards it to the ASP.NET upload.
export default function MediaUploadForm({
  onUploaded,
  idPrefix = "media-upload",
}: {
  onUploaded: (asset: MediaAsset) => void;
  idPrefix?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // The local preview is an object URL, released when the file changes or the form closes.
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function chooseFile(chosen: File | undefined) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);

    previewRef.current = chosen ? URL.createObjectURL(chosen) : null;
    setFile(chosen ?? null);
    setPreview(previewRef.current);
    setError(null);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);

    const dropped = event.dataTransfer.files[0];

    if (!dropped || !inputRef.current) return;

    // Put the dropped file in the input so the form submits it like a normal choice.
    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    inputRef.current.files = transfer.files;
    chooseFile(dropped);
  }

  async function handleUpload(formData: FormData) {
    setError(null);
    setIsUploading(true);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null);

      if (response.ok) {
        onUploaded(data);
        chooseFile(undefined);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setError(data?.message ?? "Could not upload the image.");
      }
    } catch {
      setError("Network error. Could not reach the server.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      action={handleUpload}
      className="space-y-3 rounded-lg border border-admin-border p-4"
    >
      <h3 className="text-sm font-semibold">Upload a new image</h3>

      <label
        htmlFor={`${idPrefix}-file`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition focus-within:ring-2 focus-within:ring-amber-400 ${
          dragging || file
            ? "border-amber-400 bg-amber-50"
            : "border-admin-border bg-admin-subtle hover:border-amber-400 hover:bg-amber-50"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-24 w-auto max-w-full rounded-md object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <ImagePlus size={24} />
          </span>
        )}

        <span className="text-sm font-semibold">
          {file ? file.name : "Click to choose an image"}
        </span>
        <span className="text-xs text-admin-muted">
          {file
            ? "Click to choose a different image"
            : "or drag and drop it here · JPG, PNG or WebP, up to 5 MB"}
        </span>

        <input
          ref={inputRef}
          id={`${idPrefix}-file`}
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={(event) => chooseFile(event.target.files?.[0])}
          className="sr-only"
        />
      </label>

      <div>
        <label
          htmlFor={`${idPrefix}-alt`}
          className="mb-1 block text-xs font-medium"
        >
          Alt text (optional) — describes the image for screen readers
        </label>
        <input
          id={`${idPrefix}-alt`}
          name="altText"
          type="text"
          maxLength={MAX_ALT_TEXT}
          className="w-full rounded-lg border border-admin-border bg-admin-subtle px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isUploading || !file}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        <Upload size={16} />
        {isUploading
          ? "Uploading…"
          : file
            ? "Upload image"
            : "Choose an image first"}
      </button>
    </form>
  );
}
