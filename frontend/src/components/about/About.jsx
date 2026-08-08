import {
  Brain,
  Users,
  MessageSquare,
  Award,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Brain,
    title: "Adaptive AI",
    description:
      "Every interview adapts based on candidate responses and learning progress.",
  },
  {
    number: "02",
    icon: Users,
    title: "Personalized Experience",
    description:
      "Questions are generated from each candidate's completed missions and strengths.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Real Interview Flow",
    description:
      "Multi-turn technical conversations with intelligent follow-up questions.",
  },
  {
    number: "04",
    icon: Award,
    title: "Detailed Feedback",
    description:
      "Receive strengths, knowledge gaps, hiring readiness, and improvement roadmap.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-slate-950 py-28 md:py-36"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[18%] h-[420px] w-[420px] rounded-full bg-blue-600/[0.05] blur-[120px]" />

        <div className="absolute right-[-10%] bottom-[5%] h-[380px] w-[380px] rounded-full bg-cyan-500/[0.035] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <p className="text-xs font-bold uppercase tracking-[0.32em] text-blue-400">
                About
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-slate-500">
              <Sparkles size={16} />

              <span className="text-xs uppercase tracking-[0.2em]">
                Intelligent interviewing
              </span>
            </div>
          </div>

          <div>
            <h2 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
              Smarter
              <span className="text-slate-600"> technical </span>
              interviews.
            </h2>

            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
              Our AI Interview Agent evaluates candidates using curriculum
              progress, interview context, and adaptive questioning instead of
              static quizzes. It creates a realistic technical interview
              experience that helps both learners and recruiters.
            </p>
          </div>
        </div>

        {/* Feature architecture */}
        <div className="mt-20 border-t border-slate-800/80">
          <div className="grid md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className={`group relative min-h-[280px] overflow-hidden border-b border-slate-800/80 p-8 md:p-10 ${
                    index % 2 === 0
                      ? "md:border-r md:border-slate-800/80"
                      : ""
                  }`}
                >
                  {/* Hover light */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/[0.07] opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100" />

                  {/* Number */}
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.2em] text-slate-600 transition-colors duration-300 group-hover:text-blue-500">
                      {feature.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center border border-slate-800 bg-slate-900/70 text-slate-400 transition-all duration-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:text-blue-400">
                      <Icon size={22} strokeWidth={1.7} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative mt-14 max-w-xl">
                    <h3 className="text-2xl font-bold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">
                      {feature.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500 transition-colors duration-500 group-hover:text-slate-400 md:text-base">
                      {feature.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={20}
                    className="absolute bottom-9 right-9 text-slate-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
                  />

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-16 flex flex-col justify-between gap-8 border-t border-slate-800/70 pt-10 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Built to make technical interviews feel less like a questionnaire
            and more like a genuine engineering conversation.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.8)]" />
            AI-powered evaluation
          </div>
        </div>
      </div>
    </section>
  );
}