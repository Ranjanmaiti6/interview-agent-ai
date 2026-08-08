import {
  ArrowDown,
  BrainCircuit,
  FileSearch,
  MessageSquareText,
  BarChart3,
} from "lucide-react";

import WorkflowCard from "./WorkflowCard";

const steps = [
  {
    number: "01",
    title: "Choose Candidate",
    description:
      "Select a candidate profile based on their learning journey.",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "AI Reads Progress",
    description:
      "The AI analyzes completed modules and learning history.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Adaptive Interview",
    description:
      "Questions change based on previous answers and confidence.",
    icon: MessageSquareText,
  },
  {
    number: "04",
    title: "Feedback Report",
    description:
      "Receive strengths, weaknesses and learning suggestions.",
    icon: BarChart3,
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-slate-950 px-6 py-28 md:py-36"
    >
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[20%] h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/[0.045] blur-[140px]" />

        <div className="absolute bottom-[-15%] left-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/[0.03] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                Workflow
              </span>
            </div>

            <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-slate-600">
              04 stages / 01 intelligent system
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              From profile
              <span className="text-slate-600"> to </span>
              insight.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
              A structured interview workflow that turns candidate context
              into an adaptive technical conversation and actionable feedback.
            </p>
          </div>
        </div>

        {/* Process */}
        <div className="relative mt-20">
          {/* Desktop connection line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[55px] hidden h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent lg:block" />

          <div className="grid gap-5 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <WorkflowCard
                  {...step}
                  isLast={index === steps.length - 1}
                />

                {/* Mobile connector */}
                {index !== steps.length - 1 && (
                  <div className="flex justify-center py-4 lg:hidden">
                    <ArrowDown
                      size={18}
                      className="text-slate-700"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-16 flex flex-col gap-5 border-t border-slate-800/70 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-slate-500">
            Each stage adds context to the next, allowing the interview to
            become progressively more relevant to the candidate.
          </p>

          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
            Candidate → Context → Interview → Intelligence
          </div>
        </div>
      </div>
    </section>
  );
}