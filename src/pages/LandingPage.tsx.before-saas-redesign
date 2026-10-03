import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Play,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/70 bg-white/45 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/20">
              <GraduationCap size={22} />
            </div>
            <div className="text-left">
              <div className="text-lg font-black tracking-tight">
                Study<span className="text-violet-600">Sync</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">
                Student workspace
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#features" className="transition hover:text-violet-600">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-violet-600">
              How it works
            </a>
            <a href="#students" className="transition hover:text-violet-600">
              For students
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-20 lg:grid-cols-[1fr_1.05fr] lg:px-8 lg:pb-28 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/60 px-3 py-1.5 text-xs font-bold text-violet-600 shadow-sm backdrop-blur-xl">
              <Sparkles size={13} />
              Built for students
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
              Your school life,
              <span className="block bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                in sync.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              Manage assignments, schedules, exams, and study plans in one
              simple student workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-1"
              >
                Get started for free
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/60 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition hover:bg-white"
              >
                <Play size={16} />
                Watch demo
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Simple setup
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Student focused
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                One workspace
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-violet-400/15 via-blue-400/10 to-cyan-300/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-[0_35px_100px_rgba(66,74,130,0.14)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-inner backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-violet-500" />
                    <span className="text-sm font-bold text-slate-800">
                      StudySync
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
                </div>

                <div className="grid gap-3 pt-4 sm:grid-cols-3">
                  {[
                    ["Today's Tasks", "6", "2 pending"],
                    ["Completed", "4", "out of 6"],
                    ["Study Time", "2h 35m", "today"],
                  ].map(([label, value, sub], index) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white bg-white/70 p-4 shadow-sm"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </div>
                      <div
                        className={`mt-2 text-2xl font-black ${
                          index === 1 ? "text-emerald-500" : "text-slate-900"
                        }`}
                      >
                        {value}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">{sub}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-2xl border border-white bg-white/70 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">
                        Today's Schedule
                      </h3>
                      <span className="text-xs font-semibold text-violet-600">
                        View all
                      </span>
                    </div>

                    <div className="mt-5 space-y-4">
                      {[
                        ["09:00", "Mathematics", "Algebra"],
                        ["11:00", "Physics", "Mechanics"],
                        ["13:30", "Chemistry", "Organic Chemistry"],
                        ["15:00", "English", "Literature"],
                      ].map(([time, title, sub]) => (
                        <div
                          key={time}
                          className="flex items-center gap-3"
                        >
                          <span className="w-11 text-[10px] font-bold text-slate-400">
                            {time}
                          </span>
                          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              {title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {sub}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/90 to-blue-50/80 p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-violet-600" />
                      <h3 className="font-bold text-slate-900">
                        StudySync AI
                      </h3>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      Based on your deadlines, I recommend 45 minutes of
                      Physics tonight.
                    </p>

                    <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                      Start study session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Everything in one place
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything students need
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Less time managing schoolwork. More time actually learning.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: "Assignments",
                text: "Keep every deadline organized.",
              },
              {
                icon: CalendarDays,
                title: "Schedule",
                text: "Know what is happening next.",
              },
              {
                icon: Target,
                title: "Study Plan",
                text: "Turn workload into clear sessions.",
              },
              {
                icon: Sparkles,
                title: "AI Assistant",
                text: "Get practical study guidance.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/70"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <Icon size={21} />
                  </div>
                  <h3 className="mt-5 font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
        >
          <div className="rounded-[2rem] border border-white/80 bg-white/50 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-2xl sm:p-12">
            <div className="grid gap-10 md:grid-cols-3">
              {[
                ["01", "Set up", "Tell StudySync your grade and subjects."],
                ["02", "Organize", "Add assignments and build your plan."],
                ["03", "Focus", "Study, track progress, and improve."],
              ].map(([number, title, text]) => (
                <div key={number}>
                  <div className="text-4xl font-black text-violet-200">
                    {number}
                  </div>
                  <h3 className="mt-3 text-xl font-black text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="students"
          className="mx-auto max-w-7xl px-6 pb-24 pt-10 text-center lg:px-8"
        >
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/80 bg-white/55 p-10 shadow-xl backdrop-blur-2xl">
            <Users className="mx-auto text-violet-600" size={28} />
            <h2 className="mt-4 text-3xl font-black text-slate-950">
              Ready to get your school life in sync?
            </h2>
            <p className="mt-3 text-slate-500">
              Set up your workspace in less than a minute.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-7 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/20"
            >
              Get started for free
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
