import { ArrowUpRight } from "lucide-react";

export default function FeatureCard({
  icon: Icon,
  number,
  title,
  description,
}) {
  return (
    <article className="group relative min-h-[330px] overflow-hidden bg-slate-950 p-7 transition-colors duration-500 hover:bg-slate-900 md:p-8">
      {/* Cursor-style glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.08] opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100" />

      {/* Grid decoration */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.18) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage:
            "linear-gradient(135deg, black, transparent 75%)",
        }}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[11px] tracking-[0.2em] text-slate-700 transition-colors duration-300 group-hover:text-blue-500">
          {number}
        </span>

        <div className="relative flex h-12 w-12 items-center justify-center border border-slate-800 bg-slate-900 text-slate-500 transition-all duration-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:text-blue-400">
          <Icon
            size={21}
            strokeWidth={1.6}
          />

          {/* tiny corner */}
          <span className="absolute right-0 top-0 h-1.5 w-1.5 bg-blue-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative mt-16">
        <h3 className="max-w-xs text-2xl font-bold tracking-tight text-white transition-all duration-500 group-hover:translate-x-1 md:text-[26px]">
          {title}
        </h3>

        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 transition-colors duration-500 group-hover:text-slate-400">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-8 left-8 flex items-center gap-3">
        <span className="h-px w-7 bg-slate-800 transition-all duration-500 group-hover:w-12 group-hover:bg-blue-500" />

        <ArrowUpRight
          size={18}
          className="text-slate-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
        />
      </div>

      {/* Bottom progress line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
    </article>
  );
}