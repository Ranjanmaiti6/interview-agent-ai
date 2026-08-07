import {
  Brain,
  Network,
  Radar,
  Sparkles,
  Bot,
  Target,
} from "lucide-react";

import CapabilityCard from "./CapabilityCard";

const capabilities = [
  {
    icon: Brain,
    title: "Adaptive Intelligence",
    description:
      "Questions become easier or harder based on candidate performance.",
    color: "bg-blue-600",
  },
  {
    icon: Network,
    title: "Knowledge Graph",
    description:
      "Tracks topic mastery across the AI curriculum to identify knowledge gaps.",
    color: "bg-violet-600",
  },
  {
    icon: Radar,
    title: "Skill Radar",
    description:
      "Live visualization of strengths and weaknesses throughout the interview.",
    color: "bg-cyan-600",
  },
  {
    icon: Sparkles,
    title: "Confidence Detection",
    description:
      "Detects uncertainty from responses and adapts follow-up questions.",
    color: "bg-pink-600",
  },
  {
    icon: Bot,
    title: "Smart Follow-Ups",
    description:
      "Every follow-up is generated using previous answers and interview context.",
    color: "bg-green-600",
  },
  {
    icon: Target,
    title: "Hiring Prediction",
    description:
      "Provides readiness insights, strengths, and improvement roadmap.",
    color: "bg-orange-600",
  },
];

export default function Capabilities() {
  return (
    <section className="bg-slate-950 py-28 px-6">
      <div className="max-w-7xl mx-auto">

        <p className="uppercase tracking-[0.3em] text-blue-400 font-semibold">
          AI Engine
        </p>

        <h2 className="text-5xl font-black text-white mt-4">
          What Makes Our AI Different?
        </h2>

        <p className="text-slate-400 mt-6 max-w-3xl text-lg">
          Our Interview Agent doesn't ask random questions.
          It understands your learning journey,
          adapts in real time,
          remembers context,
          and evaluates you like a senior interviewer.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {capabilities.map((item) => (
            <CapabilityCard
              key={item.title}
              {...item}
            />
          ))}
        </div>

      </div>
    </section>
  );
}