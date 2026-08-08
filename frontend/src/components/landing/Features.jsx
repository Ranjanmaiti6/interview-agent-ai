import {
  BrainCircuit,
  Target,
  Radar,
  MessagesSquare,
  GraduationCap,
  Trophy,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "Adaptive Interview",
    description:
      "Interview questions dynamically adapt based on your previous answers.",
  },
  {
    icon: MessagesSquare,
    number: "02",
    title: "Smart Follow-ups",
    description:
      "The AI asks meaningful follow-up questions like a real interviewer.",
  },
  {
    icon: Radar,
    number: "03",
    title: "Skill Radar",
    description:
      "Visualize your strengths and weaknesses in every AI topic.",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Learning Roadmap",
    description:
      "Receive personalized recommendations after every interview.",
  },
  {
    icon: Target,
    number: "05",
    title: "Knowledge Graph",
    description:
      "The AI tracks topic mastery across the curriculum and identifies gaps.",
  },
  {
    icon: Trophy,
    number: "06",
    title: "Hiring Prediction",
    description:
      "Get a realistic interview summary with readiness insights.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-950 py-28 md:py-36"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[20%] top-[-15%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.045] blur-[140px]" />

        <div className="absolute bottom-[-20%] right-[5%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.035] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-blue-500" />

            <p className="text-xs font-bold uppercase tracking-[0.32em] text-blue-400">
              Features
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-4xl font-black leading-[1] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              More than just
              <span className="block text-slate-600">
                an AI chatbot.
              </span>
            </h2>
          </div>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Our Interview Agent uses the supplied curriculum and candidate
            learning journey to conduct adaptive, conversational interviews
            instead of asking static questions.
          </p>
        </div>

        {/* Feature system */}
        <div className="mt-20 grid gap-px overflow-hidden border border-slate-800/80 bg-slate-800/60 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>

        {/* Bottom metric strip */}
        <div className="mt-12 flex flex-col gap-6 border-y border-slate-800/70 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Interview intelligence
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Context-aware evaluation designed around the candidate journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              System ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}