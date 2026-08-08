import {
  BrainCircuit,
  Users,
  BarChart3,
  Zap,
} from "lucide-react";

const stats = [
  {
    value: "AI",
    label: "Powered interviews",
    description: "Adaptive technical conversations",
    icon: BrainCircuit,
  },
  {
    value: "24/7",
    label: "Interview availability",
    description: "No scheduling bottlenecks",
    icon: Zap,
  },
  {
    value: "360°",
    label: "Candidate analysis",
    description: "Technical and behavioral insight",
    icon: BarChart3,
  },
  {
    value: "1",
    label: "Unified platform",
    description: "Interview, meetings and results",
    icon: Users,
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative overflow-hidden bg-slate-950 px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-blue-500" />

            <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              System Overview
            </span>
          </div>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 md:block">
            Intelligence / Infrastructure
          </span>
        </div>

        <div className="grid gap-px overflow-hidden border border-slate-800 bg-slate-800 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative min-h-[270px] overflow-hidden bg-slate-950 p-8 transition-colors duration-500 hover:bg-slate-900"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/[0.06] opacity-0 blur-[60px] transition-opacity duration-700 group-hover:opacity-100" />

                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-700">
                    Metric
                  </span>

                  <Icon
                    size={20}
                    strokeWidth={1.4}
                    className="text-slate-700 transition-colors duration-500 group-hover:text-blue-400"
                  />
                </div>

                <div className="mt-16">
                  <div className="text-5xl font-black tracking-[-0.05em] text-white md:text-6xl">
                    {stat.value}
                  </div>

                  <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-300">
                    {stat.label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-500 group-hover:text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}