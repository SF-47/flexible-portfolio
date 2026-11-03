"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MailOpen,
  Reply,
  Search,
  Trash2,
} from "lucide-react";

import type { AdminContactMessage } from "@/types/contactMessage";

type Filter = "all" | "unread" | "read";

// Messages shown before the admin presses "Show all messages".
const collapsedCount = 5;

function formatDate(value: string) {
  // The API sends UTC without a "Z", so it is read as UTC here.
  return new Date(`${value}Z`).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesInbox({
  initialMessages,
}: {
  initialMessages: AdminContactMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = messages.filter((message) => !message.isRead).length;
  const search = query.trim().toLowerCase();
  const visible = messages.filter(
    (message) =>
      (filter === "all" || (filter === "read") === message.isRead) &&
      (!search ||
        `${message.name} ${message.email} ${message.message}`
          .toLowerCase()
          .includes(search)),
  );

  const shown = showAll ? visible : visible.slice(0, collapsedCount);

  async function send(message: AdminContactMessage, init: RequestInit) {
    setBusyId(message.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, init);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.message ?? "Could not update the message.");
        return false;
      }

      return true;
    } catch {
      setError("Network error. Could not reach the server.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function toggleRead(message: AdminContactMessage) {
    const isRead = !message.isRead;
    const ok = await send(message, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });

    if (ok) {
      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id ? { ...item, isRead } : item,
        ),
      );
    }
  }

  async function remove(message: AdminContactMessage) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;

    if (await send(message, { method: "DELETE" })) {
      setMessages((previous) =>
        previous.filter((item) => item.id !== message.id),
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-admin-muted">
          View inquiries and messages from website visitors.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Messages", value: messages.length, icon: Mail },
          { label: "Unread", value: unreadCount, icon: Mail },
          {
            label: "Read",
            value: messages.length - unreadCount,
            icon: MailOpen,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-admin-border bg-admin-surface p-5"
          >
            <Icon className="mb-4 text-admin-accent" size={22} />
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-admin-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-border p-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-bold">Inbox</h2>

            <div
              role="group"
              aria-label="Filter messages"
              className="flex rounded-lg border border-admin-border bg-admin-bg p-0.5"
            >
              {(
                [
                  { value: "all", label: "All", count: messages.length },
                  { value: "unread", label: "Unread", count: unreadCount },
                  {
                    value: "read",
                    label: "Read",
                    count: messages.length - unreadCount,
                  },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    filter === item.value
                      ? "bg-amber-400 text-slate-950"
                      : "text-admin-muted hover:text-admin-text"
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 rounded-lg border border-admin-border px-3 py-2 text-sm">
            <Search size={18} className="text-admin-faint" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages..."
              aria-label="Search messages"
              className="w-56 bg-transparent outline-none"
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="px-6 pt-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="divide-y divide-admin-border">
          {visible.length === 0 && (
            <p className="p-10 text-center text-sm text-admin-muted">
              {messages.length === 0
                ? "No messages yet."
                : "No messages match your filter or search."}
            </p>
          )}

          {shown.map((message) => {
            const expanded = expandedId === message.id;

            return (
              <div key={message.id} className="px-6 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 truncate">
                    {!message.isRead && (
                      <span
                        role="img"
                        aria-label="Unread"
                        className="mr-2 inline-block h-2 w-2 rounded-full bg-admin-accent"
                      />
                    )}
                    <span
                      className={message.isRead ? "font-medium" : "font-bold"}
                    >
                      {message.name}
                    </span>
                    <span className="ml-2 text-sm text-admin-muted">
                      {message.email}
                    </span>
                  </p>

                  <span className="shrink-0 text-xs text-admin-muted">
                    {formatDate(message.createdAt)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : message.id)}
                  aria-expanded={expanded}
                  title={expanded ? "Show less" : "Show the full message"}
                  className={`mt-1 block w-full whitespace-pre-wrap break-words text-left text-sm leading-6 ${
                    expanded ? "" : "line-clamp-2"
                  }`}
                >
                  {message.message}
                </button>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${message.email}`}
                    onClick={() => !message.isRead && toggleRead(message)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300"
                  >
                    <Reply size={14} />
                    Reply
                  </a>

                  <button
                    type="button"
                    disabled={busyId === message.id}
                    onClick={() => toggleRead(message)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border px-3 py-1.5 text-xs font-semibold hover:bg-admin-bg disabled:opacity-50"
                  >
                    {message.isRead ? (
                      <Mail size={14} />
                    ) : (
                      <MailOpen size={14} />
                    )}
                    {message.isRead ? "Mark as unread" : "Mark as read"}
                  </button>

                  <button
                    type="button"
                    disabled={busyId === message.id}
                    onClick={() => remove(message)}
                    aria-label={`Delete message from ${message.name}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {visible.length > collapsedCount && (
          <div className="flex justify-center border-t border-admin-border p-4">
            <button
              type="button"
              aria-expanded={showAll}
              onClick={() => setShowAll((previous) => !previous)}
              className="inline-flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-5 py-2.5 text-sm font-semibold transition hover:border-admin-accent"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show all messages ({visible.length})
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
