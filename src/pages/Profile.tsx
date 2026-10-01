import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Mail,
  Save,
  User,
} from "lucide-react";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  subjects: string[];
  daily_goal: string;
  preferred_study_time: string;
}

export default function Profile() {
  const [user, setUser] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProfile() {
    try {
      const response = await apiFetch<{ user: Student }>(
        "/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const current = response.user;

      setUser(current);
      setName(current.name);
      setGrade(current.grade);
      setSubjects(current.subjects.join(", "));
      setDailyGoal(current.daily_goal);
      setStudyTime(current.preferred_study_time);
    } catch (error) {
      console.error("Failed to load profile:", error);
      setMessage("Unable to load profile.");
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function saveProfile() {
    try {
      setSaving(true);
      setMessage("");

      const response = await apiFetch<{ user: Student }>(
        "/api/auth/account",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            grade,
            subjects: subjects
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            daily_goal: dailyGoal,
            preferred_study_time: studyTime,
          }),
        },
      );

      setUser(response.user);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-full bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-4xl text-sm text-slate-400">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-violet-500/20">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">
                Student Profile
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {user.name}
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Mail size={13} />
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-600">
                Full name
              </span>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-600">
                Grade
              </span>
              <input
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                placeholder="e.g. Grade 11"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-semibold text-slate-600">
                Subjects
              </span>
              <div className="relative">
                <BookOpen
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={subjects}
                  onChange={(event) =>
                    setSubjects(event.target.value)
                  }
                  placeholder="Mathematics, Physics, English"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-600">
                Daily study goal
              </span>
              <div className="relative">
                <Clock3
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={dailyGoal}
                  onChange={(event) =>
                    setDailyGoal(event.target.value)
                  }
                  placeholder="2 hours"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:bg-white"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-600">
                Preferred study time
              </span>
              <select
                value={studyTime}
                onChange={(event) =>
                  setStudyTime(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </label>
          </div>

          {message && (
            <div className="mt-5 rounded-xl bg-violet-50 px-4 py-3 text-xs font-semibold text-violet-700">
              {message}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <CalendarDays size={17} className="text-violet-500" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Grade
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {user.grade || "Not set"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <BookOpen size={17} className="text-sky-500" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Subjects
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {user.subjects.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <Clock3 size={17} className="text-emerald-500" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Daily Goal
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {user.daily_goal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
