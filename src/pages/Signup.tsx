import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { register } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useStudentProfile } from "../context/StudentProfileContext";

export default function Signup() {
  const navigate = useNavigate();
  const { updateStudent } = useStudentProfile();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const user = await register(
        "Student",
        normalizedEmail,
        password,
        "",
      );

      // Keep the shared profile synchronized with the new account.
      updateStudent(user);

      localStorage.setItem(
        "studysync_signup_complete",
        "true",
      );

      navigate("/onboarding");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ======================================================
            BRAND PANEL
        ====================================================== */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -right-40 bottom-[-100px] h-[550px] w-[550px] rounded-full bg-cyan-600/15 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex w-fit items-center gap-3 text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <BookOpen size={20} />
              </div>
              <span className="text-xl font-black">
                Study<span className="text-violet-400">Sync</span>
              </span>
            </button>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-300">
                <Sparkles size={13} />
                BUILT FOR STUDENTS
              </div>

              <h1 className="text-5xl font-black leading-[1.04] tracking-[-0.04em] text-white xl:text-6xl">
                Build a workspace around the way you study.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Start with your account, then personalize StudySync with
                your grade, subjects, study goals, and preferred study time.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Organize assignments and deadlines",
                  "Build a personalized study plan",
                  "Track focus and progress",
                  "Get help from StudySync AI",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={17}
                      className="text-emerald-400"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              StudySync · Student productivity workspace
            </p>
          </div>
        </div>

        {/* ======================================================
            SIGNUP
        ====================================================== */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mx-auto mb-10 flex items-center gap-2 lg:hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
                <BookOpen size={18} />
              </div>
              <span className="text-lg font-black">
                Study<span className="text-violet-600">Sync</span>
              </span>
            </button>

            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Create your StudySync account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your account first. We'll personalize your workspace
                next.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                <span>
                  After creating your account, you'll set up your student
                  profile and study preferences.
                </span>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-bold text-violet-600 hover:text-violet-700"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mx-auto mt-6 block text-xs font-medium text-slate-400 transition hover:text-slate-700"
            >
              ← Back to StudySync
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
