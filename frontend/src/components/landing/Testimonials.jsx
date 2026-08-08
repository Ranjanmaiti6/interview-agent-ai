import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The interview felt much more relevant than a traditional question bank. The system actually responded to what I said.",
    name: "Candidate Experience",
    role: "AI Engineering Interview",
  },
  {
    quote:
      "Having candidate context, interviews and results in one workflow makes the assessment process significantly easier to manage.",
    name: "Hiring Workflow",
    role: "Recruitment & Evaluation",
  },
  {
    quote:
      "The feedback gives a much clearer picture of where a candidate is strong and where additional preparation is needed.",
    name: "Interview Intelligence",
    role: "Technical Assessment",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-slate-900 px-6 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-15%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.035] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blue-500" />

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                Experience
              </span>
            </div>

            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
              Designed around the conversation
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Built for better
              <span className="block text-slate-600">
                conversations.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
              A more contextual interview experience for candidates, recruiters
              and technical teams.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden border border-slate-700/70 bg-slate-700/70 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="group relative min-h-[340px] bg-slate-900 p-8 transition-colors duration-500 hover:bg-slate-950 md:p-10"
            >
              <div className="flex items-center justify-between">
                <Quote
                  size={25}
                  strokeWidth={1.3}
                  className="text-blue-500/70"
                />

                <span className="font-mono text-[10px] tracking-[0.2em] text-slate-700">
                  0{index + 1}
                </span>
              </div>

              <blockquote className="mt-14 text-lg font-medium leading-8 tracking-tight text-slate-200">
                “{item.quote}”
              </blockquote>

              <div className="absolute bottom-8 left-8 right-8 border-t border-slate-800 pt-5 md:left-10 md:right-10">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {item.role}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}