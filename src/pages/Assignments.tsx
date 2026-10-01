import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";
import { notifyAssignmentsChanged } from "../lib/assignmentSync";

interface Assignment {
  id: number;
  title: string;
  subject: string;
  assignment_type: string;
  description: string;
  due_date: string;
  priority: string;
  estimated_minutes: number;
  add_to_plan: boolean;
  completed: boolean;
  completed_at: string | null;
  created_at: string | null;
}

interface AssignmentResponse {
  assignments: Assignment[];
}

interface MutationResponse {
  assignment: Assignment;
}

type Tab = "all" | "today" | "upcoming" | "overdue" | "completed";

const priorityStyles = {
  High: "bg-rose-50 text-rose-600 border-rose-100",
  Medium: "bg-amber-50 text-amber-600 border-amber-100",
  Low: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

function formatMinutes(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
  }

  return `${minutes}m`;
}

function getDateState(dueDate: string) {
  if (!dueDate) {
    return "upcoming";
  }

  const due = new Date(`${dueDate}T23:59:59`);
  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  if (dueDay < today) return "overdue";
  if (dueDay.getTime() === today.getTime()) return "today";

  return now < due ? "upcoming" : "overdue";
}

function formatDueDate(dueDate: string, completed: boolean) {
  if (completed) return "Completed";

  if (!dueDate) return "No due date";

  const state = getDateState(dueDate);

  if (state === "overdue") {
    const due = new Date(`${dueDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Math.max(
      1,
      Math.round((today.getTime() - due.getTime()) / 86400000),
    );

    return `Overdue · ${days} ${days === 1 ? "day" : "days"}`;
  }

  if (state === "today") return "Due today";

  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Math.round(
    (due.getTime() - today.getTime()) / 86400000,
  );

  if (days === 1) return "Due tomorrow";

  return `Due in ${days} days`;
}

export default function Assignments() {
  const navigate = useNavigate();
  const token = getToken();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [sortBy, setSortBy] = useState("Due date");

  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Assignment");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [description, setDescription] = useState("");
  const [addToPlan, setAddToPlan] = useState(false);

  async function loadAssignments() {
    if (!token) {
      setError("Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiFetch<AssignmentResponse>("/api/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignments(response.assignments);
      notifyAssignmentsChanged();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load assignments.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  const subjects = useMemo(
    () => [
      "All subjects",
      ...Array.from(new Set(assignments.map((item) => item.subject))).sort(),
    ],
    [assignments],
  );

  const stats = useMemo(() => {
    const today = assignments.filter(
      (item) => !item.completed && getDateState(item.due_date) === "today",
    ).length;

    const overdue = assignments.filter(
      (item) => !item.completed && getDateState(item.due_date) === "overdue",
    ).length;

    const completed = assignments.filter((item) => item.completed).length;

    return {
      total: assignments.length,
      today,
      overdue,
      completed,
    };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = assignments.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.assignment_type.toLowerCase().includes(query);

      const matchesSubject =
        subjectFilter === "All subjects" ||
        item.subject === subjectFilter;

      const matchesPriority =
        priorityFilter === "All priorities" ||
        item.priority === priorityFilter;

      let matchesTab = true;

      if (tab === "today") {
        matchesTab =
          !item.completed && getDateState(item.due_date) === "today";
      }

      if (tab === "upcoming") {
        matchesTab =
          !item.completed && getDateState(item.due_date) === "upcoming";
      }

      if (tab === "overdue") {
        matchesTab =
          !item.completed && getDateState(item.due_date) === "overdue";
      }

      if (tab === "completed") {
        matchesTab = item.completed;
      }

      return (
        matchesSearch &&
        matchesSubject &&
        matchesPriority &&
        matchesTab
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Priority") {
        const rank = { High: 0, Medium: 1, Low: 2 };
        return (
          (rank[a.priority as keyof typeof rank] ?? 3) -
          (rank[b.priority as keyof typeof rank] ?? 3)
        );
      }

      if (sortBy === "Created") {
        return (b.created_at || "").localeCompare(a.created_at || "");
      }

      return (a.due_date || "9999").localeCompare(b.due_date || "9999");
    });
  }, [
    assignments,
    search,
    subjectFilter,
    priorityFilter,
    sortBy,
    tab,
  ]);

  function resetForm() {
    setTitle("");
    setSubject("");
    setType("Assignment");
    setDueDate("");
    setPriority("Medium");
    setEstimatedMinutes(60);
    setDescription("");
    setAddToPlan(false);
  }

  function openCreate() {
    resetForm();
    setError("");
    setShowCreate(true);
  }

  async function createAssignment(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim() || !subject.trim()) {
      setError("Assignment title and subject are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await apiFetch<MutationResponse>("/api/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject.trim(),
          assignment_type: type,
          due_date: dueDate,
          priority,
          estimated_minutes: estimatedMinutes,
          description: description.trim(),
          add_to_plan: addToPlan,
        }),
      });

      setAssignments((current) => [
        response.assignment,
        ...current,
      ]);

      setShowCreate(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to add assignment.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleComplete(item: Assignment) {
    try {
      setError("");

      const response = await apiFetch<MutationResponse>(
        `/api/assignments/${item.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !item.completed,
          }),
        },
      );

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === item.id
            ? response.assignment
            : assignment,
        ),
      );

      setSelected(response.assignment);

      // Immediately refresh Dashboard assignment metrics.
      notifyAssignmentsChanged();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update assignment.",
      );
    }
  }

  async function deleteAssignment(id: number) {
    try {
      setError("");

      await apiFetch(`/api/assignments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignments((current) =>
        current.filter((item) => item.id !== id),
      );

      setSelected(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete assignment.",
      );
    }
  }

  function openEdit(item: Assignment) {
    setSelected(null);

    setTitle(item.title);
    setSubject(item.subject);
    setType(item.assignment_type);
    setDueDate(item.due_date);
    setPriority(item.priority);
    setEstimatedMinutes(item.estimated_minutes);
    setDescription(item.description);
    setAddToPlan(item.add_to_plan);

    setShowCreate(true);
  }

  async function saveEdit(event: React.FormEvent) {
    event.preventDefault();

    if (!selected) {
      await createAssignment(event);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await apiFetch<MutationResponse>(
        `/api/assignments/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            subject: subject.trim(),
            assignment_type: type,
            due_date: dueDate,
            priority,
            estimated_minutes: estimatedMinutes,
            description: description.trim(),
            add_to_plan: addToPlan,
          }),
        },
      );

      setAssignments((current) =>
        current.map((item) =>
          item.id === selected.id ? response.assignment : item,
        ),
      );

      setShowCreate(false);
      setSelected(response.assignment);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save assignment.",
      );
    } finally {
      setSaving(false);
    }
  }

  function assignmentFormTitle() {
    return selected ? "Edit Assignment" : "Add Assignment";
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-violet-50/40 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-500">
              Productivity workspace
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Assignments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your schoolwork and deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-slate-950/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-xl hover:shadow-violet-500/20 active:translate-y-0"
          >
            <Plus size={18} />
            <span className="!text-white">Add Assignment</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-rose-100"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: FileText,
              className: "text-violet-600 bg-violet-50",
            },
            {
              label: "Due Today",
              value: stats.today,
              icon: CalendarDays,
              className: "text-blue-600 bg-blue-50",
            },
            {
              label: "Overdue",
              value: stats.overdue,
              icon: Clock3,
              className: "text-rose-600 bg-rose-50",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: CheckCircle2,
              className: "text-emerald-600 bg-emerald-50",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.className}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SEARCH / FILTERS */}
        <div className="mb-5 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search assignments..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.target.value)}
                  className="appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-violet-400"
                >
                  {subjects.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value)
                  }
                  className="appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-violet-400"
                >
                  <option>All priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-violet-400"
                >
                  <option>Due date</option>
                  <option>Priority</option>
                  <option>Created</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-4">
            {[
              ["all", "All"],
              ["today", "Today"],
              ["upcoming", "Upcoming"],
              ["overdue", "Overdue"],
              ["completed", "Completed"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value as Tab)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  tab === value
                    ? "!bg-slate-950 !text-white shadow-sm shadow-slate-950/10"
                    : "!bg-transparent !text-slate-600 hover:!bg-slate-100 hover:!text-slate-950"
                }`}
              >
                {label}
              </button>
            ))}

            <div className="ml-auto hidden items-center gap-2 text-xs font-medium text-slate-400 md:flex">
              <Filter size={14} />
              {filteredAssignments.length} shown
            </div>
          </div>
        </div>

        {/* ASSIGNMENT LIST */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/80 bg-white/70 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              Loading assignments...
            </div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/65 px-6 py-20 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <FileText size={25} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No assignments found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your filters or add a new assignment to your workspace.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className="mt-6 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700"
            >
              Add Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAssignments.map((item) => {
                const overdue =
                  !item.completed &&
                  getDateState(item.due_date) === "overdue";

                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => setSelected(item)}
                    className={`group cursor-pointer rounded-3xl border bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_15px_45px_rgba(15,23,42,0.08)] ${
                      overdue
                        ? "border-rose-100"
                        : "border-white/80"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleComplete(item);
                        }}
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition ${
                          item.completed
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-slate-200 bg-white text-slate-300 hover:border-violet-300 hover:text-violet-600"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Check size={18} />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3
                              className={`text-base font-bold text-slate-900 ${
                                item.completed
                                  ? "line-through opacity-60"
                                  : ""
                              }`}
                            >
                              {item.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {item.subject}
                              <span className="mx-2 text-slate-300">
                                ·
                              </span>
                              {item.assignment_type}
                            </p>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
                              priorityStyles[
                                item.priority as keyof typeof priorityStyles
                              ] || priorityStyles.Medium
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold">
                          <span
                            className={
                              overdue
                                ? "text-rose-600"
                                : item.completed
                                  ? "text-emerald-600"
                                  : "text-slate-500"
                            }
                          >
                            {formatDueDate(
                              item.due_date,
                              item.completed,
                            )}
                          </span>

                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock3 size={14} />
                            {formatMinutes(item.estimated_minutes)} estimated
                          </span>

                          {item.add_to_plan && (
                            <span className="flex items-center gap-1.5 text-violet-500">
                              <Zap size={13} />
                              Study Plan
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelected(item);
                        }}
                        className="hidden rounded-xl p-2 text-slate-300 hover:bg-slate-100 hover:text-slate-700 sm:block"
                      >
                        <ChevronDown size={18} className="-rotate-90" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* DETAILS PANEL */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="h-full w-full max-w-xl overflow-y-auto border-l border-white/70 bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
                    Assignment details
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    {selected.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selected.subject} · {selected.assignment_type}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Due
                  </p>
                  <p
                    className={`mt-2 text-sm font-bold ${
                      getDateState(selected.due_date) === "overdue"
                        ? "text-rose-600"
                        : "text-slate-900"
                    }`}
                  >
                    {selected.due_date || "No due date"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Priority
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {selected.priority}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Estimated time
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {formatMinutes(selected.estimated_minutes)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {selected.completed ? "Completed" : "In progress"}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Description
                </p>

                <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {selected.description ||
                    "No description has been added yet."}
                </p>
              </div>

              <div className="mt-7 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-cyan-50/60 p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      StudySync AI
                    </p>
                    <p className="text-xs text-slate-500">
                      Suggested breakdown
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Research", 0.35],
                    ["Core work", 0.4],
                    ["Review & finish", 0.25],
                  ].map(([label, ratio]) => (
                    <div
                      key={String(label)}
                      className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-600">
                        {label}
                      </span>

                      <span className="text-sm font-bold text-violet-600">
                        {formatMinutes(
                          Math.max(
                            10,
                            Math.round(
                              selected.estimated_minutes *
                                Number(ratio),
                            ),
                          ),
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {!selected.completed && (
                  <button
                    type="button"
                    onClick={() => navigate("/focus")}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold !text-white transition hover:bg-violet-600"
                  >
                    <Zap size={17} />
                    <span className="!text-white">
                      Start Focus Session
                    </span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => openEdit(selected)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleComplete(selected)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
                  >
                    <CheckCircle2 size={16} />
                    {selected.completed
                      ? "Mark Incomplete"
                      : "Mark Complete"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => deleteAssignment(selected.id)}
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                  Delete Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-white/80 bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
                    Task manager
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    {assignmentFormTitle()}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setSelected(null);
                    resetForm();
                  }}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={selected ? saveEdit : createAssignment}>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Assignment title
                    </label>

                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Physics Project"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Subject
                      </label>

                      <input
                        value={subject}
                        onChange={(event) =>
                          setSubject(event.target.value)
                        }
                        placeholder="Physics"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Type
                      </label>

                      <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                      >
                        <option>Assignment</option>
                        <option>Project</option>
                        <option>Essay</option>
                        <option>Reading</option>
                        <option>Homework</option>
                        <option>Quiz</option>
                        <option>Exam</option>
                        <option>Lab</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Due date
                      </label>

                      <input
                        value={dueDate}
                        onChange={(event) =>
                          setDueDate(event.target.value)
                        }
                        type="date"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Estimated time
                      </label>

                      <div className="relative">
                        <input
                          value={estimatedMinutes}
                          onChange={(event) =>
                            setEstimatedMinutes(
                              Math.max(
                                1,
                                Number(event.target.value) || 1,
                              ),
                            )
                          }
                          type="number"
                          min="1"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-20 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                          minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      Priority
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {["Low", "Medium", "High"].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPriority(value)}
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            priority === value
                              ? value === "High"
                                ? "border-rose-200 bg-rose-50 text-rose-600"
                                : value === "Low"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                  : "border-amber-200 bg-amber-50 text-amber-600"
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Add details..."
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={addToPlan}
                      onChange={(event) =>
                        setAddToPlan(event.target.checked)
                      }
                      className="h-4 w-4 accent-violet-600"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Add to today's study plan
                    </span>
                  </label>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreate(false);
                      setSelected(null);
                      resetForm();
                    }}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold !text-white shadow-lg transition hover:bg-violet-600 disabled:opacity-60"
                  >
                    {saving && (
                      <Loader2 size={16} className="animate-spin" />
                    )}

                    <span className="!text-white">
                      {saving
                        ? "Saving..."
                        : selected
                          ? "Save Changes"
                          : "Add Assignment"}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
