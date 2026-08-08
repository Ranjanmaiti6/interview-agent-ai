import {
  Gauge,
  Network,
  Activity,
  Radar,
  Map,
  TrendingUp,
} from "lucide-react";

import CapabilityCard from "./CapabilityCard";

const capabilities = [
  {
    title: "Adaptive Difficulty",
    description:
      "Questions become easier or harder based on candidate responses.",
    icon: Gauge,
    label: "Adaptive engine",
  },
  {
    title: "Knowledge Graph",
    description:
      "Tracks concept mastery and identifies learning gaps.",
    icon: Network,
    label: "Knowledge layer",
  },
  {
    title: "Confidence Detection",
    description:
      "Detects hesitation and asks targeted follow-up questions.",
    icon: Activity,
    label: "Conversation layer",
  },
  {
    title: "Skill Radar",
    description:
      "Visualizes strengths and weaknesses across AI topics.",
    icon: Radar,
    label: "Assessment layer",
  },
  {
    title: "Career Roadmap",
    description:
      "Suggests learning paths based on interview performance.",
    icon: Map,
    label: "Growth layer",
  },
  {
    title: "Hiring Prediction",
    description:
      "Provides a readiness score and hiring recommendation.",
    icon: TrendingUp,
    label: "Decision layer",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden bg-slate-900 px-6 py-28 md:py-36"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[150px]" />

        <div className="absolute bottom-[-15%] left-[-10%] h-[450px] w-[450px] rounded-full bg-indigo-500/[0.035] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                AI Capabilities
              </span>
            </div>

            <h2 className="mt-8 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Intelligence behind
              <span className="block text-slate-600">
                every interview.
              </span>
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-slate-400 md:text-lg">
              The system goes beyond static Q&A by combining candidate context,
              adaptive questioning, skill analysis, and interview intelligence.
            </p>
          </div>
        </div>

        {/* Capability matrix */}
        <div className="mt-20 grid gap-px overflow-hidden border border-slate-700/70 bg-slate-700/70 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, index) => (
            <CapabilityCard
              key={item.title}
              {...item}
              index={index}
            />
          ))}
        </div>

        {/* System status */}
        <div className="mt-12 grid gap-px overflow-hidden border border-slate-800/80 bg-slate-800/80 sm:grid-cols-3">
          <div className="bg-slate-900/80 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
              Context
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-300">
              Candidate-aware
            </p>
          </div>

          <div className="bg-slate-900/80 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
              Reasoning
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-300">
              Response-aware
            </p>
          </div>

          <div className="bg-slate-900/80 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
              Output
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-300">
              Actionable insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}