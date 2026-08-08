import { ArrowUpRight } from "lucide-react";

export default function WorkflowCard({
  number,
  title,
  description,
  icon: Icon,
}) {
  return (
    <article className="group relative min-h-[330px] overflow-hidden border border-slate-800/80 bg-slate-950 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900/80 md:p-8">
      {/* Ambient hover light */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/[0.07] opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100" />

      {/* Number */}
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.25em] text-slate-700 transition-colors duration-300 group-hover:text-blue-500">
          {number}
        </span>

        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
          Stage
        </span>
      </div>

      {/* Icon */}
      <div className="relative mt-10">
        <div className="relative flex h-16 w-16 items-center justify-center border border-slate-800 bg-slate-900 text-slate-500 transition-all duration-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:text-blue-400">
          <Icon
            size={25}
            strokeWidth={1.5}
          />

          <span className="absolute right-0 top-0 h-1.5 w-1.5 bg-blue-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>

      {/* Content */}
      <div className="relative mt-10">
        <h3 className="text-xl font-bold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-slate-500 transition-colors duration-500 group-hover:text-slate-400">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-7 right-7">
        <ArrowUpRight
          size={19}
          className="text-slate-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
        />
      </div>

      {/* Bottom progress */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
    </article>
  );
}