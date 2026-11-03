"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";

import Modal from "@/components/admin/media/Modal";
import { formatBytes, formatName } from "@/components/admin/media/mediaFormat";
import { getMediaUrl } from "@/lib/ui/mediaUrl";
import { MAX_ALT_TEXT, UpdateMediaSchema } from "@/schemas/mediaSchemas";
import type { AdminMediaAsset } from "@/types/media";

type Feedback = { type: "success" | "error"; message: string } | null;

// The details of one image: a large preview, its alt text editor, where it is used and
// the delete action. Deleting is only possible for unused images; the API enforces it.
export default function MediaDetailsDialog({
  asset,
  onClose,
  onChanged,
  onDeleted,
}: {
  asset: AdminMediaAsset | null;
  onClose: () => void;
  onChanged: (asset: AdminMediaAsset) => void;
  onDeleted: (id: number) => void;
}) {
  return (
    <Modal
      open={asset !== null}
      onClose={onClose}
      title={asset?.originalFileName ?? "Image"}
      wide
    >
      {asset && (
        <Details
          key={asset.id}
          asset={asset}
          onChanged={onChanged}
          onDeleted={onDeleted}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

function Details({
  asset,
  onChanged,
  onDeleted,
  onClose,
}: {
  asset: AdminMediaAsset;
  onChanged: (asset: AdminMediaAsset) => void;
  onDeleted: (id: number) => void;
  onClose: () => void;
}) {
  const url = getMediaUrl(asset.id, [asset]);
  const saved = asset.altText ?? "";

  const [altText, setAltText] = useState(saved);
  const [isSaving, setIsSaving] = useState(false);
  const [altFeedback, setAltFeedback] = useState<Feedback>(null);
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const altDirty = altText.trim() !== saved;
  const altCheck = UpdateMediaSchema.safeParse({ altText });
  const altError = altCheck.success ? null : altCheck.error.issues[0].message;
  const inUse = asset.usedIn.length > 0;
  const busy = isSaving || isDeleting;

  async function saveAlt() {
    if (!altDirty || altError || busy) return;

    setIsSaving(true);
    setAltFeedback(null);

    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText: altText.trim() }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setAltFeedback({
          type: "error",
          message: data?.message ?? "Could not save the alt text.",
        });
        return;
      }

      onChanged(data);
      setAltText(data.altText ?? "");
      setAltFeedback({ type: "success", message: "Alt text saved." });
    } catch {
      setAltFeedback({
        type: "error",
        message: "Network error. Could not reach the server.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteImage() {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        onDeleted(asset.id);
        onClose();
        return;
      }

      const data = await response.json().catch(() => null);

      // Someone started using the image since the page was loaded: show where.
      if (response.status === 409 && Array.isArray(data?.usedIn)) {
        onChanged({ ...asset, usedIn: data.usedIn });
      }

      setDeleteError(data?.message ?? "Could not delete the image.");
      setConfirming(false);
    } catch {
      setDeleteError("Network error. Could not reach the server.");
      setConfirming(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative h-64 overflow-hidden rounded-lg bg-admin-bg md:h-80">
          {url && (
            <Image
              src={url}
              alt={asset.altText ?? asset.originalFileName}
              fill
              sizes="(min-width: 768px) 420px, 90vw"
              className="object-contain"
            />
          )}
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-admin-muted">File</dt>
          <dd className="truncate font-medium">{asset.originalFileName}</dd>
          <dt className="text-admin-muted">Format</dt>
          <dd className="font-medium">{formatName(asset)}</dd>
          <dt className="text-admin-muted">Size</dt>
          <dd className="font-medium">{formatBytes(asset.fileSizeBytes)}</dd>
          <dt className="text-admin-muted">Uploaded</dt>
          <dd className="font-medium">
            {new Date(asset.createdAt).toLocaleDateString()}
          </dd>
        </dl>
      </div>

      <div className="space-y-6">
        <section aria-labelledby="alt-heading" className="space-y-3">
          <h3 id="alt-heading" className="text-sm font-semibold">
            Alt text
          </h3>
          <input
            type="text"
            aria-label="Alt text"
            value={altText}
            maxLength={MAX_ALT_TEXT + 50}
            disabled={busy}
            onChange={(event) => {
              setAltText(event.target.value);
              setAltFeedback(null);
            }}
            placeholder="Describe the image for screen readers"
            className="w-full rounded-lg border border-admin-border bg-admin-subtle px-3 py-2 text-sm disabled:opacity-60"
          />
          <p className="text-xs text-admin-muted">
            {altText.length}/{MAX_ALT_TEXT} characters. Changing it does not
            replace the image.
          </p>

          {altError && (
            <p role="alert" className="text-sm text-red-700">
              {altError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setAltText(saved);
                setAltFeedback(null);
              }}
              disabled={!altDirty || busy}
              className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-subtle disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveAlt}
              disabled={!altDirty || altError !== null || busy}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving && <Loader2 size={15} className="animate-spin" />}
              {isSaving ? "Saving…" : "Save alt text"}
            </button>
          </div>

          <p
            role="status"
            className={`text-sm font-medium ${
              altFeedback?.type === "error" ? "text-red-700" : "text-green-700"
            }`}
          >
            {altFeedback?.message}
          </p>
        </section>

        <section aria-labelledby="usage-heading" className="space-y-2">
          <h3 id="usage-heading" className="text-sm font-semibold">
            Where it is used
          </h3>

          {inUse ? (
            <>
              <p className="text-sm">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                  In use
                </span>
              </p>
              <ul className="list-inside list-disc text-sm text-admin-muted">
                {asset.usedIn.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-admin-muted">
              <span className="rounded-full bg-admin-bg px-2.5 py-0.5 text-xs font-semibold">
                Unused
              </span>{" "}
              This image is not used anywhere on the website.
            </p>
          )}
        </section>

        <section aria-labelledby="delete-heading" className="space-y-3">
          <h3 id="delete-heading" className="text-sm font-semibold">
            Delete image
          </h3>

          {inUse ? (
            <p className="text-sm text-admin-muted">
              This image cannot be deleted while it is used. Remove it from{" "}
              {asset.usedIn.join(", ")} first.
            </p>
          ) : confirming ? (
            <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-900">
                Delete “{asset.originalFileName}” permanently? It is not used
                anywhere, but this cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={isDeleting}
                  className="rounded-lg border border-admin-border bg-admin-surface px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Keep image
                </button>
                <button
                  type="button"
                  onClick={deleteImage}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  {isDeleting ? "Deleting…" : "Delete permanently"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setConfirming(true);
              }}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={15} />
              Delete image
            </button>
          )}

          {deleteError && (
            <p role="alert" className="text-sm text-red-700">
              {deleteError}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
