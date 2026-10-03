import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Check,
  RefreshCw,
  Megaphone,
} from "lucide-react";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  read: boolean;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unread = announcements.filter((item) => !item.read).length;

  const loadAnnouncements = useCallback(async () => {
    if (!getToken()) return;

    try {
      const response = await apiFetch<{
        announcements: Announcement[];
      }>("/api/announcements", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setAnnouncements(response.announcements);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load announcements right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnnouncements();

    const interval = window.setInterval(() => {
      void loadAnnouncements();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [loadAnnouncements]);

  async function markRead(id: number) {
    try {
      await apiFetch(`/api/announcements/${id}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setAnnouncements((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                read: true,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-violet-500/10 via-white to-cyan-500/10 p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Bell size={22} />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500">
                Updates
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Announcements
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Important updates from your school and StudySync.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadAnnouncements()}
              className="ml-auto hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:flex"
              title="Refresh announcements"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading announcements...
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-12 text-center">
          <Megaphone
            className="mx-auto text-slate-300"
            size={34}
          />
          <h2 className="mt-3 font-semibold text-slate-800">
            No announcements yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            New announcements from your school will appear here.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className={`rounded-[26px] border bg-white p-5 shadow-sm transition sm:p-6 ${
                announcement.read
                  ? "border-slate-200"
                  : "border-violet-200 ring-1 ring-violet-100"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    announcement.read
                      ? "bg-slate-100 text-slate-500"
                      : "bg-violet-100 text-violet-600"
                  }`}
                >
                  <Megaphone size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {announcement.title}
                        </h2>

                        {!announcement.read && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {announcement.created_by} ·{" "}
                        {formatDate(announcement.created_at)}
                      </p>
                    </div>

                    {!announcement.read && (
                      <button
                        type="button"
                        onClick={() => void markRead(announcement.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                      >
                        <Check size={14} />
                        Mark as read
                      </button>
                    )}
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {announcement.content}
                  </p>

                  {announcement.read && (
                    <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <Check size={13} />
                      Read
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
