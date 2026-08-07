import { Brain, Users, MessageSquare, Award } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive AI",
    description: "Every interview adapts based on candidate responses and learning progress."
  },
  {
    icon: Users,
    title: "Personalized Experience",
    description: "Questions are generated from each candidate's completed missions and strengths."
  },
  {
    icon: MessageSquare,
    title: "Real Interview Flow",
    description: "Multi-turn technical conversations with intelligent follow-up questions."
  },
  {
    icon: Award,
    title: "Detailed Feedback",
    description: "Receive strengths, knowledge gaps, hiring readiness, and improvement roadmap."
  }
];

export default function About() {
  return (
    <section
      id="about"
      className="py-24 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">

        <p className="uppercase tracking-[0.3em] text-blue-400 font-semibold">
          About
        </p>

        <h2 className="text-5xl font-black text-white mt-4">
          Smarter Technical Interviews
        </h2>

        <p className="text-slate-400 max-w-3xl mt-6 text-lg">
          Our AI Interview Agent evaluates candidates using curriculum progress,
          interview context, and adaptive questioning instead of static quizzes.
          It creates a realistic technical interview experience that helps both
          learners and recruiters.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-slate-900 rounded-2xl p-8"
              >
                <Icon className="text-blue-500" size={36} />

                <h3 className="text-white text-2xl font-bold mt-6">
                  {feature.title}
                </h3>

                <p className="text-slate-400 mt-4 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}