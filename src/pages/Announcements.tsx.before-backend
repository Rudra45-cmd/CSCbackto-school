import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  Megaphone,
  Search,
} from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: "School" | "Academic" | "Event" | "System";
  date: string;
  important: boolean;
  read: boolean;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Upcoming examination schedule",
    content:
      "The examination schedule has been updated. Check your academic calendar and plan your revision sessions accordingly.",
    category: "Academic",
    date: "Today",
    important: true,
    read: false,
  },
  {
    id: 2,
    title: "New study resources available",
    content:
      "New learning resources have been added for Mathematics, Physics, Chemistry, and English.",
    category: "School",
    date: "Yesterday",
    important: false,
    read: false,
  },
  {
    id: 3,
    title: "Student community update",
    content:
      "You can now share study questions and discuss subjects with other students through the Community section.",
    category: "System",
    date: "2 days ago",
    important: false,
    read: true,
  },
  {
    id: 4,
    title: "Science project submission",
    content:
      "Remember to complete and submit your science project before the deadline shown in Assignments.",
    category: "Event",
    date: "3 days ago",
    important: true,
    read: true,
  },
];

const CATEGORIES = [
  "All",
  "School",
  "Academic",
  "Event",
  "System",
] as const;

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(
    INITIAL_ANNOUNCEMENTS,
  );

  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("All");

  const [search, setSearch] = useState("");

  const unreadCount = announcements.filter(
    (item) => !item.read,
  ).length;

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [announcements, category, search]);

  function markRead(id: number) {
    setAnnouncements((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item,
      ),
    );
  }

  function markAllRead() {
    setAnnouncements((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      })),
    );
  }

  function categoryClass(value: string) {
    switch (value) {
      case "Academic":
        return "bg-violet-50 text-violet-600";
      case "Event":
        return "bg-sky-50 text-sky-600";
      case "System":
        return "bg-emerald-50 text-emerald-600";
      default:
        return "bg-amber-50 text-amber-600";
    }
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-500">
              <Megaphone size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Announcements
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Stay up to date.
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Important school, academic, event, and StudySync updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              <Check size={14} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <Bell size={18} className="text-violet-500" />

            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {announcements.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <Bell size={18} className="text-amber-500" />

            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Unread
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <Check size={18} className="text-emerald-500" />

            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Read
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {announcements.length - unreadCount}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mt-7 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search announcements..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-xs font-semibold transition ${
                  category === item
                    ? "bg-violet-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <section className="mt-5 space-y-3">
          {filteredAnnouncements.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
              <Megaphone
                size={24}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 text-sm font-bold text-slate-800">
                No announcements found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Try another search or category.
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <article
                key={announcement.id}
                onClick={() => markRead(announcement.id)}
                className={`cursor-pointer rounded-3xl border bg-white p-5 shadow-sm transition hover:border-violet-200 sm:p-6 ${
                  announcement.read
                    ? "border-slate-200"
                    : "border-violet-200 shadow-violet-500/5"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      announcement.read
                        ? "bg-slate-100 text-slate-400"
                        : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    <Megaphone size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-1 text-[9px] font-bold ${categoryClass(
                          announcement.category,
                        )}`}
                      >
                        {announcement.category}
                      </span>

                      {announcement.important && (
                        <span className="rounded-md bg-red-50 px-2 py-1 text-[9px] font-bold text-red-500">
                          Important
                        </span>
                      )}

                      {!announcement.read && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-violet-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                          New
                        </span>
                      )}
                    </div>

                    <h2
                      className={`mt-3 text-base font-bold ${
                        announcement.read
                          ? "text-slate-800"
                          : "text-slate-900"
                      }`}
                    >
                      {announcement.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {announcement.content}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                      <CalendarDays size={12} />
                      {announcement.date}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
