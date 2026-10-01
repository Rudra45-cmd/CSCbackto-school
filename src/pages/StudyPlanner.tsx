import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Play,
  RefreshCw,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";
import {
  ASSIGNMENTS_CHANGED_EVENT,
  notifyAssignmentsChanged,
} from "../lib/assignmentSync";

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
}

function formatDueDate(value: string) {
  if (!value) return "No due date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining
    ? `${hours}h ${remaining}m`
    : `${hours}h`;
}

function getPriorityClasses(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-600 border-red-100";
    case "low":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default:
      return "bg-amber-50 text-amber-600 border-amber-100";
  }
}

export default function StudyPlanner() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [message, setMessage] = useState("");

  async function loadAssignments() {
    try {
      setLoading(true);

      const token = getToken();

      const response = await apiFetch<{
        assignments: Assignment[];
      }>("/api/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignments(response.assignments);
    } catch (error) {
      console.error("Failed to load planner:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load study plan.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssignments();

    const handleAssignmentsChanged = () => {
      void loadAssignments();
    };

    window.addEventListener(
      ASSIGNMENTS_CHANGED_EVENT,
      handleAssignmentsChanged,
    );

    return () => {
      window.removeEventListener(
        ASSIGNMENTS_CHANGED_EVENT,
        handleAssignmentsChanged,
      );
    };
  }, []);

  async function toggleAssignment(assignment: Assignment) {
    try {
      const token = getToken();

      await apiFetch(`/api/assignments/${assignment.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !assignment.completed,
        }),
      });

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? {
                ...item,
                completed: !item.completed,
              }
            : item,
        ),
      );

      notifyAssignmentsChanged();
    } catch (error) {
      console.error("Failed to update assignment:", error);
      setMessage("Unable to update assignment.");
    }
  }

  const plannedAssignments = useMemo(() => {
    let items = assignments.filter(
      (assignment) =>
        assignment.add_to_plan ||
        !assignment.completed,
    );

    if (filter === "pending") {
      items = items.filter((item) => !item.completed);
    }

    if (filter === "completed") {
      items = items.filter((item) => item.completed);
    }

    return [...items].sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;

      return (
        new Date(a.due_date).getTime() -
        new Date(b.due_date).getTime()
      );
    });
  }, [assignments, filter]);

  const totalMinutes = plannedAssignments.reduce(
    (total, item) =>
      total + (item.estimated_minutes || 0),
    0,
  );

  const completedCount = plannedAssignments.filter(
    (item) => item.completed,
  ).length;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-500">
              <CalendarDays size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Study Planner
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Plan your study time
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your assignments, deadlines, and focused study work in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAssignments()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <Target size={18} className="text-violet-500" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Planned Tasks
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {plannedAssignments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <Clock3 size={18} className="text-sky-500" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimated Time
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatMinutes(totalMinutes)}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <div className="mr-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter size={14} />
            View
          </div>

          {(
            [
              ["all", "All"],
              ["pending", "Pending"],
              ["completed", "Completed"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === value
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-500/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-medium text-violet-700">
            {message}
          </div>
        )}

        {/* Planner */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-900">
              Your Study Plan
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Work through your upcoming assignments and start focused sessions directly.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Loading your study plan...
            </div>
          ) : plannedAssignments.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                <CalendarDays size={20} />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-800">
                Nothing planned yet
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add assignments from the Assignments page to build your study plan.
              </p>

              <button
                type="button"
                onClick={() => navigate("/assignments")}
                className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700"
              >
                Open Assignments
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {plannedAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center"
                >
                  <button
                    type="button"
                    onClick={() =>
                      void toggleAssignment(assignment)
                    }
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                      assignment.completed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-slate-200 bg-white text-transparent hover:border-violet-300"
                    }`}
                    title={
                      assignment.completed
                        ? "Mark incomplete"
                        : "Mark complete"
                    }
                  >
                    <CheckCircle2 size={17} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          assignment.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {assignment.title}
                      </h3>

                      <span className="rounded-md bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                        {assignment.subject}
                      </span>

                      <span
                        className={`rounded-md border px-2 py-1 text-[9px] font-bold ${getPriorityClasses(
                          assignment.priority,
                        )}`}
                      >
                        {assignment.priority}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        {formatDueDate(assignment.due_date)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={12} />
                        {formatMinutes(
                          assignment.estimated_minutes || 0,
                        )}
                      </span>
                    </div>
                  </div>

                  {!assignment.completed && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/focus", {
                          state: {
                            assignmentId: assignment.id,
                          },
                        });
                      }}
                      className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700"
                    >
                      <Play size={13} />
                      Focus
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
