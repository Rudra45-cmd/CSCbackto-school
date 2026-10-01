import { useState } from "react";
import {
  Bell,
  Moon,
  ShieldCheck,
  Smartphone,
  Volume2,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [compact, setCompact] = useState(false);

  function toggle(
    key: "notifications" | "sound" | "compact",
  ) {
    if (key === "notifications") {
      setNotifications((value) => !value);
    }

    if (key === "sound") {
      setSound((value) => !value);
    }

    if (key === "compact") {
      setCompact((value) => !value);
    }
  }

  const settings = [
    {
      key: "notifications" as const,
      title: "Study notifications",
      description:
        "Receive reminders about assignments and study sessions.",
      icon: Bell,
      enabled: notifications,
    },
    {
      key: "sound" as const,
      title: "Focus sounds",
      description:
        "Allow ambient sounds to play during Focus Mode.",
      icon: Volume2,
      enabled: sound,
    },
    {
      key: "compact" as const,
      title: "Compact workspace",
      description:
        "Use tighter spacing across supported StudySync views.",
      icon: Smartphone,
      enabled: compact,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">
            Preferences
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Customize how StudySync works for you.
          </p>
        </div>

        <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">
              General
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {settings.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="flex items-center gap-4 px-6 py-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggle(item.key)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      item.enabled
                        ? "bg-violet-600"
                        : "bg-slate-200"
                    }`}
                    aria-label={`Toggle ${item.title}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        item.enabled
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">
              Appearance
            </h2>
          </div>

          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Moon size={17} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Theme
              </p>

              <p className="mt-1 text-xs text-slate-500">
                StudySync currently uses the light workspace theme.
              </p>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500">
              Light
            </span>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
          <div className="flex gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <h2 className="text-sm font-bold text-emerald-900">
                Privacy & Security
              </h2>

              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your StudySync account settings are protected by your authenticated session. Keep your login credentials private.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
