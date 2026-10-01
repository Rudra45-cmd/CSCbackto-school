import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  GraduationCap,
  Moon,
  Sun,
  Sunrise,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "History",
  "Computer Science",
];

const studyTimes = [
  { id: "morning", label: "Morning", icon: Sunrise },
  { id: "afternoon", label: "Afternoon", icon: Sun },
  { id: "evening", label: "Evening", icon: Moon },
  { id: "night", label: "Night", icon: Clock3 },
];

export default function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Grade 11");
  const [selectedSubjects, setSelectedSubjects] = useState([
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
  ]);
  const [goal, setGoal] = useState("2 hours");
  const [studyTime, setStudyTime] = useState("evening");

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject],
    );
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const finish = async () => {
    const profile = {
      name: name.trim() || "Student",
      grade,
      subjects: selectedSubjects,
      daily_goal: goal,
      preferred_study_time: studyTime,
    };

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/signup");
        return;
      }

      await apiFetch("/api/auth/setup", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      localStorage.setItem(
        "studysync_onboarding",
        JSON.stringify(profile),
      );

      localStorage.setItem("studysync_workspace_ready", "true");

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your setup.",
      );
    } finally {
      setSaving(false);
    }
  };


  const canContinue = step !== 1 || name.trim().length > 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-400/12 blur-3xl" />
        <div className="absolute right-0 top-20 h-[450px] w-[450px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg">
              <GraduationCap size={21} />
            </div>
            <span className="font-black tracking-tight text-slate-900">
              Study<span className="text-violet-600">Sync</span>
            </span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            Step {step} of 3
          </span>
        </header>

        <div className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center py-12">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full rounded-[2rem] border border-white/80 bg-white/60 p-7 shadow-[0_30px_100px_rgba(66,74,130,0.10)] backdrop-blur-2xl sm:p-10"
          >
            <div className="mb-8 flex gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-1.5 flex-1 rounded-full ${
                    item <= step
                      ? "bg-gradient-to-r from-violet-600 to-blue-500"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <div>
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <GraduationCap size={27} />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
                  Welcome to StudySync
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Let&apos;s set up your workspace.
                </h1>

                <p className="mt-3 text-slate-500">
                  Just a few details so StudySync can personalize your
                  workspace.
                </p>

                <label className="mt-8 block text-sm font-bold text-slate-700">
                  What&apos;s your name?
                </label>

                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && canContinue) setStep(2);
                  }}
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/75 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <BookOpen size={27} />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
                  School setup
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Tell us about your school life.
                </h1>

                <label className="mt-7 block text-sm font-bold text-slate-700">
                  Grade
                </label>

                <select
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/75 px-4 py-4 text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                >
                  {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map(
                    (item) => (
                      <option key={item}>{item}</option>
                    ),
                  )}
                </select>

                <label className="mt-7 block text-sm font-bold text-slate-700">
                  Subjects
                </label>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {subjects.map((subject) => {
                    const selected = selectedSubjects.includes(subject);

                    return (
                      <button
                        key={subject}
                        onClick={() => toggleSubject(subject)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                          selected
                            ? "border-violet-300 bg-violet-50 text-violet-700"
                            : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            selected
                              ? "border-violet-500 bg-violet-500 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && <Check size={13} />}
                        </span>
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                  <Clock3 size={27} />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
                  Study preferences
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  How do you usually study?
                </h1>

                <label className="mt-8 block text-sm font-bold text-slate-700">
                  Daily study goal
                </label>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {["1 hour", "2 hours", "3 hours", "4 hours"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setGoal(item)}
                      className={`rounded-xl border py-3 text-xs font-bold transition ${
                        goal === item
                          ? "border-violet-300 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white/60 text-slate-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <label className="mt-8 block text-sm font-bold text-slate-700">
                  Preferred study time
                </label>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {studyTimes.map((item) => {
                    const Icon = item.icon;
                    const selected = studyTime === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setStudyTime(item.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-bold transition ${
                          selected
                            ? "border-violet-300 bg-violet-50 text-violet-700"
                            : "border-slate-200 bg-white/60 text-slate-500"
                        }`}
                      >
                        <Icon size={19} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
              <button
                onClick={() =>
                  step === 1 ? navigate("/") : setStep((value) => value - 1)
                }
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {step < 3 ? (
                <button
                  disabled={!canContinue}
                  onClick={() => setStep((value) => value + 1)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Finish Setup"}
                  {!saving && <Check size={16} />}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
