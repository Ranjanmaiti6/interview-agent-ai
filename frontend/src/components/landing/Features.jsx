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
    title: "Adaptive Interview",
    description:
      "Interview questions dynamically adapt based on your previous answers.",
  },
  {
    icon: MessagesSquare,
    title: "Smart Follow-ups",
    description:
      "The AI asks meaningful follow-up questions like a real interviewer.",
  },
  {
    icon: Radar,
    title: "Skill Radar",
    description:
      "Visualize your strengths and weaknesses in every AI topic.",
  },
  {
    icon: GraduationCap,
    title: "Learning Roadmap",
    description:
      "Receive personalized recommendations after every interview.",
  },
  {
    icon: Target,
    title: "Knowledge Graph",
    description:
      "The AI tracks topic mastery across the curriculum and identifies gaps.",
  },
  {
    icon: Trophy,
    title: "Hiring Prediction",
    description:
      "Get a realistic interview summary with readiness insights.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-950 py-28 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <p className="text-blue-400 uppercase tracking-widest font-semibold">
          Features
        </p>

        <h2 className="text-5xl font-black text-white mt-3">
          More than just an AI Chatbot
        </h2>

        <p className="text-slate-400 mt-5 max-w-3xl">
          Our Interview Agent uses the supplied curriculum and candidate
          learning journey to conduct adaptive, conversational interviews
          instead of asking static questions.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}