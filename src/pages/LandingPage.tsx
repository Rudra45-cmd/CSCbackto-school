import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  Play,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Assignments",
    description:
      "Keep every deadline, priority, and piece of schoolwork visible without turning your day into a spreadsheet.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Study planning",
    description:
      "Build realistic study sessions around your actual workload, deadlines, and available time.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Focus mode",
    description:
      "Start a focused session, put distractions aside, and measure the time you genuinely spend learning.",
    icon: Timer,
  },
  {
    number: "04",
    title: "StudySync AI",
    description:
      "Get academic guidance that understands your assignments, schedule, subjects, and current progress.",
    icon: Sparkles,
  },
  {
    number: "05",
    title: "Progress",
    description:
      "See your consistency, completed work, and study time without complicated productivity dashboards.",
    icon: BarChart3,
  },
  {
    number: "06",
    title: "Community",
    description:
      "Learn alongside classmates, exchange resources, and make studying feel less isolated.",
    icon: Users,
  },
];

const workflow = [
  {
    number: "01",
    title: "Add your work",
    description: "Keep assignments, deadlines, subjects, and academic tasks together.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Plan your time",
    description: "Turn the workload in front of you into realistic study sessions.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Focus",
    description: "Use Focus Mode to actually sit down and get the work done.",
    icon: Target,
  },
  {
    number: "04",
    title: "Understand progress",
    description: "See your consistency and learn what study habits are working.",
    icon: TrendingUp,
  },
];

const schedule = [
  ["09:00", "Mathematics", "Quadratic equations", "done"],
  ["11:00", "Physics", "Mechanics", "now"],
  ["13:30", "Chemistry", "Organic chemistry", ""],
  ["15:00", "English", "Literature", ""],
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fcfdff] text-[#101936]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[38%] top-[-180px] h-[500px] w-[500px] rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute right-[-160px] top-[240px] h-[480px] w-[480px] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute left-[-180px] top-[700px] h-[450px] w-[450px] rounded-full bg-purple-100/50 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-200">
              <GraduationCap size={18} />
            </span>
            <span className="text-[17px] font-extrabold tracking-[-0.03em] text-[#17234a]">
              StudySync
            </span>
          </button>

          <nav className="hidden items-center gap-9 text-[13px] font-medium text-slate-500 md:flex">
            <a href="#features" className="transition hover:text-violet-600">
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-violet-600"
            >
              How it works
            </a>
            <a href="#ai" className="transition hover:text-violet-600">
              StudySync AI
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5"
            >
              Get started
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pb-24 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-[2px] w-7 bg-violet-500" />
              Built for students
            </div>

            <h1 className="max-w-[540px] text-[54px] font-black leading-[0.96] tracking-[-0.055em] text-[#111a36] sm:text-[64px] lg:text-[68px]">
              Your school
              <br />
              life,
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
                in sync.
              </span>
            </h1>

            <p className="mt-7 max-w-[500px] text-[16px] leading-7 text-slate-500">
              One calm place to manage assignments, plan your study time, stay
              focused, understand your progress, and get help when you need it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5"
              >
                Start for free
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600"
              >
                <Play size={15} />
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium text-slate-500">
              {["Simple setup", "Student-first", "One workspace"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-8 -z-10 rounded-[60px] bg-gradient-to-br from-violet-100/80 via-blue-50 to-transparent blur-2xl" />

            <div className="rounded-[26px] border border-slate-200 bg-white/90 p-2 shadow-[0_30px_80px_rgba(71,63,125,0.15)]">
              <div className="grid min-h-[440px] overflow-hidden rounded-[20px] border border-slate-100 bg-[#fbfcff] md:grid-cols-[150px_1fr]">
                {/* Sidebar */}
                <aside className="border-r border-slate-100 bg-white p-4">
                  <div className="mb-8 flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-white">
                      <GraduationCap size={14} />
                    </span>
                    <span className="text-[11px] font-extrabold">
                      StudySync
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px] font-medium text-slate-500">
                    {[
                      ["Overview", true],
                      ["Assignments", false],
                      ["Planner", false],
                      ["Focus", false],
                      ["Community", false],
                    ].map(([label, active]) => (
                      <div
                        key={String(label)}
                        className={`rounded-lg px-3 py-2 ${
                          active
                            ? "bg-violet-50 font-bold text-violet-600"
                            : ""
                        }`}
                      >
                        <span className="mr-2 text-slate-300">●</span>
                        {String(label)}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      Weekly goal
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                    </div>
                    <div className="mt-2 flex justify-between text-[8px] text-slate-400">
                      <span>8h 40m</span>
                      <span>12h</span>
                    </div>
                  </div>
                </aside>

                {/* Main dashboard */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Tuesday · September 30
                      </div>
                      <h3 className="mt-1 text-[20px] font-black tracking-tight text-[#18234b]">
                        Good morning, Abhishek.
                      </h3>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 via-blue-300 to-white shadow-inner" />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      ["Tasks", "06"],
                      ["Completed", "04"],
                      ["Study time", "2h 35m"],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                      >
                        <div className="text-[7px] font-bold uppercase text-slate-400">
                          {label}
                        </div>
                        <div
                          className={`mt-2 text-[15px] font-black ${
                            index === 1 ? "text-emerald-500" : "text-[#18234b]"
                          }`}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-[1.35fr_0.85fr]">
                    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[7px] font-bold uppercase text-slate-400">
                            Today
                          </div>
                          <div className="text-[11px] font-bold">
                            Study schedule
                          </div>
                        </div>
                        <CalendarDays size={13} className="text-violet-500" />
                      </div>

                      <div className="mt-3 space-y-2.5">
                        {schedule.map(([time, subject, topic, state]) => (
                          <div
                            key={time}
                            className="flex items-center gap-2 text-[8px]"
                          >
                            <span className="w-8 text-slate-400">{time}</span>
                            <span className="h-6 w-px bg-slate-200" />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-700">
                                {subject}
                              </div>
                              <div className="text-slate-400">{topic}</div>
                            </div>
                            {state === "done" && (
                              <Check size={12} className="text-emerald-500" />
                            )}
                            {state === "now" && (
                              <span className="rounded-full bg-violet-50 px-2 py-1 text-[7px] font-bold text-violet-600">
                                NOW
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-[#15153d] to-[#26205b] p-3 text-white shadow-lg">
                      <div className="flex items-center gap-2 text-[8px] font-bold">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-violet-600">
                          <Sparkles size={12} />
                        </span>
                        StudySync AI
                      </div>

                      <p className="mt-5 text-[9px] leading-4 text-violet-100">
                        Your next best study session
                      </p>

                      <p className="mt-2 text-[8px] leading-4 text-white/60">
                        Physics has the closest deadline. A focused 45-minute
                        session tonight should keep you ahead.
                      </p>

                      <div className="mt-5 rounded-lg bg-white/10 p-2.5">
                        <div className="text-[8px] font-bold">
                          Physics · 45 min
                        </div>
                        <div className="mt-1 text-[7px] text-white/50">
                          Mechanics
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="flex items-center gap-2 font-bold">
                        <TrendingUp size={12} className="text-emerald-500" />
                        Weekly consistency
                      </span>
                      <strong>78%</strong>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                      <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-3 flex max-w-[94%] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-lg shadow-slate-200/60">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <div className="text-[8px] font-bold uppercase text-slate-400">
                  Today
                </div>
                <div className="text-[11px] font-bold text-slate-700">
                  4 tasks completed
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three positioning blocks */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-[1180px] md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "One place",
              text: "Assignments, planning, focus, and progress in one workspace.",
            },
            {
              icon: Clock3,
              title: "Less friction",
              text: "Spend less time organizing schoolwork and more time learning.",
            },
            {
              icon: Users,
              title: "Built around you",
              text: "Your subjects, workload, goals, and study habits shape the experience.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`p-8 lg:p-10 ${
                  index > 0 ? "border-t md:border-l md:border-t-0" : ""
                } border-slate-200`}
              >
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-violet-600">
                  <Icon size={19} />
                </span>
                <h3 className="text-[15px] font-extrabold">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-5 text-slate-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-24 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-[2px] w-7 bg-violet-500" />
              Everything connected
            </div>

            <h2 className="max-w-[430px] text-[42px] font-black leading-[1.02] tracking-[-0.045em]">
              Schoolwork shouldn't feel{" "}
              <span className="text-violet-600">scattered.</span>
            </h2>

            <p className="mt-6 max-w-[410px] text-[14px] leading-6 text-slate-500">
              StudySync brings the pieces together so you can see what
              matters, decide what comes next, and get back to studying.
            </p>

            <a
              href="#how-it-works"
              className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-violet-600"
            >
              Explore the workspace
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(64,58,120,0.08)]">
            <div className="grid sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className={`min-h-[175px] p-6 ${
                      index % 2 !== 0 ? "sm:border-l" : ""
                    } ${
                      index >= 2 ? "border-t" : ""
                    } border-slate-100`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
                        <Icon size={17} />
                      </span>
                      <span className="text-[9px] font-bold text-violet-500">
                        {feature.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-[13px] font-extrabold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-t border-slate-100 bg-white"
      >
        <div className="mx-auto max-w-[1180px] px-5 py-24 lg:px-8">
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-[2px] w-7 bg-violet-500" />
              How it works
            </div>

            <h2 className="max-w-[650px] text-[42px] font-black leading-[1.03] tracking-[-0.045em]">
              From a messy workload{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                to a clear next step.
              </span>
            </h2>
          </div>

          <div className="grid border-y border-slate-200 md:grid-cols-4">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`min-h-[210px] p-7 ${
                    index > 0 ? "border-t md:border-l md:border-t-0" : ""
                  } border-slate-200`}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
                      <Icon size={18} />
                    </span>
                    <span className="text-[10px] font-bold text-violet-600">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-[13px] font-extrabold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI section */}
      <section id="ai" className="scroll-mt-20 px-5 pb-20 lg:px-8">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-white via-violet-50/70 to-blue-50/80 p-7 shadow-[0_25px_70px_rgba(91,72,180,0.10)] sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-[2px] w-7 bg-violet-500" />
                StudySync AI
              </div>

              <h2 className="max-w-[500px] text-[38px] font-black leading-[1.03] tracking-[-0.04em]">
                An assistant that knows{" "}
                <span className="text-violet-600">what you're studying.</span>
              </h2>

              <p className="mt-5 max-w-[500px] text-[13px] leading-6 text-slate-500">
                Instead of giving you generic answers, StudySync AI can work
                from your academic context to help you decide what to study,
                understand difficult topics, organize assignments, and plan
                your next session.
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="group mt-7 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-[12px] font-bold text-white shadow-lg shadow-violet-200"
              >
                Try StudySync AI
                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* AI chat mockup */}
            <div className="rounded-[22px] border border-violet-100 bg-white/90 p-2 shadow-xl shadow-violet-100/70">
              <div className="rounded-[17px] border border-slate-100 bg-[#fafbff] p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-white">
                      <Sparkles size={14} />
                    </span>
                    <div>
                      <div className="text-[10px] font-extrabold">
                        StudySync AI
                      </div>
                      <div className="text-[8px] text-slate-400">
                        Academic assistant
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ready
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="max-w-[70%] rounded-xl bg-violet-50 px-3 py-2 text-[9px] text-slate-600">
                    What should I study tonight?
                  </div>

                  <div className="ml-auto max-w-[78%] rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-3 py-2 text-[9px] leading-4 text-white">
                    You have a Physics project due tomorrow and a Math
                    assignment due Friday. I recommend starting with Physics
                    while you have the most energy.
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[7px] font-bold uppercase text-violet-500">
                          Recommended
                        </div>
                        <div className="mt-1 text-[10px] font-extrabold">
                          Physics · Mechanics
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-violet-600">
                        <Clock3 size={12} />
                        45 min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
                  <span className="flex-1 text-[9px] text-slate-400">
                    Ask StudySync AI...
                  </span>
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-white">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-[850px] px-5 py-20 text-center">
          <div className="mb-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span className="h-[2px] w-7 bg-violet-500" />
            Get started today
            <span className="h-[2px] w-7 bg-violet-500" />
          </div>

          <h2 className="text-[36px] font-black leading-[1.05] tracking-[-0.04em] sm:text-[44px]">
            Spend less time managing school.
            <br />
            <span className="text-violet-600">
              Spend more time learning.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[580px] text-[13px] leading-6 text-slate-500">
            Bring assignments, study plans, focus sessions, progress, and
            academic help together in one student workspace.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5"
          >
            Create your workspace
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <div className="mt-5 text-[10px] text-slate-400">
            Simple setup · Student-focused · Built for everyday school life
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.7fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-white">
                <GraduationCap size={15} />
              </span>
              <span className="font-extrabold">StudySync</span>
            </div>
            <p className="mt-4 max-w-[330px] text-[11px] leading-5 text-slate-500">
              A focused student workspace for managing schoolwork, planning
              study time, staying consistent, and learning with more clarity.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold">Product</h4>
            <div className="mt-4 space-y-2 text-[11px] text-slate-500">
              <a href="#features" className="block hover:text-violet-600">
                Features
              </a>
              <a href="#how-it-works" className="block hover:text-violet-600">
                How it works
              </a>
              <a href="#ai" className="block hover:text-violet-600">
                StudySync AI
              </a>
              <button
                onClick={() => navigate("/signup")}
                className="block hover:text-violet-600"
              >
                Get started
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold">Workspace</h4>
            <div className="mt-4 space-y-2 text-[11px] text-slate-500">
              <button
                onClick={() => navigate("/login")}
                className="block hover:text-violet-600"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="block hover:text-violet-600"
              >
                Create account
              </button>
              <span className="block">Student tools</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold">StudySync</h4>
            <div className="mt-4 space-y-2 text-[11px] text-slate-500">
              <span className="block">For students</span>
              <span className="block">Student-first</span>
              <span className="block">Built for learning</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-2 px-5 py-5 text-[9px] text-slate-400 sm:flex-row lg:px-8">
            <span>© 2026 StudySync. All rights reserved.</span>
            <span>Student productivity workspace · Made for learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
