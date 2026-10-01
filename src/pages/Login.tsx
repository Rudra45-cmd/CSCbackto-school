import { useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { login } from "../lib/auth";

type LoginProps = {
  onLogin: (name: string) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("student@studysync.local");
  const [password, setPassword] = useState("StudySync@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      onLogin(user.name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 text-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20">
            <Sparkles size={26} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to StudySync
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue your learning journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-xl"
        >
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Email
          </label>

          <div className="relative mb-5">
            <Mail
              size={17}
              className="absolute left-3 top-3.5 text-slate-600"
            />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-black/20 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-violet-500/50"
              placeholder="you@example.com"
            />
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-600">
            Password
          </label>

          <div className="relative mb-5">
            <LockKeyhole
              size={17}
              className="absolute left-3 top-3.5 text-slate-600"
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-black/20 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/50"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
