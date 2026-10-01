import { BookOpen, Brain, Clock3, Target } from "lucide-react";

export default function MyLearning() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
          Learning
        </p>
        <h1 className="mt-2 text-3xl font-bold">My Learning</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track your subjects, progress and learning goals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LearningCard
          icon={<BookOpen size={19} />}
          title="Subjects"
          value="6"
        />
        <LearningCard
          icon={<Target size={19} />}
          title="Average Progress"
          value="78%"
        />
        <LearningCard
          icon={<Clock3 size={19} />}
          title="Study Time"
          value="8h 42m"
        />
        <LearningCard
          icon={<Brain size={19} />}
          title="Learning Score"
          value="87%"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Your subjects</h2>
        <div className="mt-5 space-y-4">
          {["Mathematics", "Physics", "Chemistry", "English", "Computer Science"].map(
            (subject, index) => (
              <div key={subject}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{subject}</span>
                  <span className="text-slate-600">
                    {[82, 74, 68, 91, 86][index]}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    style={{ width: `${[82, 74, 68, 91, 86][index]}%` }}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function LearningCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        {icon}
      </div>
      <p className="text-xs text-slate-600">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
