import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, BookOpen, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { register } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        "Student",
        email.trim().toLowerCase(),
        password,
        ""
      );

      localStorage.setItem("studysync_signup_complete", "true");

      navigate("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-slate-900 relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute -right-32 top-20 h-[28rem] w-[28rem] rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20">
            <BookOpen size={20} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Study<span className="text-violet-600">Sync</span>
          </span>
        </button>

        <button
          onClick={() => navigate("/login")}
          className="rounded-xl border border-slate-200/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
        >
          Already have an account?{" "}
          <span className="text-violet-600">Log in</span>
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-82px)] items-center justify-center px-5 py-10">
        <div className="grid w-full max-w-5xl items-center gap-14 lg:grid-cols-[1fr_460px]">

          {/* Left */}
          <motion.section
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/65 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur-xl">
              <Sparkles size={16} />
              Your smarter school workspace
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950">
              Everything you need to
              <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                stay in sync.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Create your StudySync account and build a workspace designed
              around the way you actually study.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Organize assignments and deadlines",
                "Build a personalized study plan",
                "Track your focus and progress",
                "Keep everything in one place",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Signup card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="rounded-[30px] border border-white/80 bg-white/75 p-7 shadow-[0_25px_80px_rgba(52,38,120,0.14)] backdrop-blur-2xl sm:p-9">

              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <Sparkles size={22} />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start your personalized StudySync workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                By creating an account, you agree to use StudySync responsibly
                for your academic workspace.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
