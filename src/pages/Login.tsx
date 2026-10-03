import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { login } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useStudentProfile } from "../context/StudentProfileContext";

type LoginProps = {
  onLogin: (name: string) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const { updateStudent } = useStudentProfile();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email.trim().toLowerCase(), password);

      // Keep the shared profile immediately synchronized.
      updateStudent(user);

      onLogin(user.name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const clearAutofill = () => {
      if (passwordInputRef.current) {
        passwordInputRef.current.value = "";
      }
      setPassword("");
    };

    clearAutofill();

    const frame = requestAnimationFrame(clearAutofill);
    const timer = window.setTimeout(clearAutofill, 100);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ======================================================
            BRAND PANEL
        ====================================================== */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

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
                STUDENT WORKSPACE
              </div>

              <h1 className="text-5xl font-black leading-[1.04] tracking-[-0.04em] text-white xl:text-6xl">
                Your school life,
                <span className="block text-violet-400">
                  in sync.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Organize your work, plan your time, focus on what matters,
                and understand your progress.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Assignments and deadlines",
                  "Personalized study planning",
                  "Focus sessions and progress",
                  "Context-aware StudySync AI",
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
            LOGIN
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
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Sign in to StudySync
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Continue to your student workspace.
              </p>
            </div>

            <form autoComplete="off"
              onSubmit={handleSubmit}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    placeholder="Enter your password"
                  />
                </div>
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
                {loading ? "Signing in..." : "Sign in"}
                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-bold text-violet-600 hover:text-violet-700"
                  >
                    Create account
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
