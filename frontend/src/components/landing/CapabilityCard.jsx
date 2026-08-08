import { ArrowUpRight } from "lucide-react";

export default function CapabilityCard({
  title,
  description,
  icon: Icon,
  label,
  index,
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative min-h-[300px] overflow-hidden bg-slate-900 p-7 transition-all duration-500 hover:bg-slate-950 md:p-8">
      {/* Hover atmosphere */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/[0.07] opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />

      {/* Technical grid */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-36 w-36 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.18) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "linear-gradient(135deg, black, transparent 75%)",
        }}
      />

      {/* Top */}
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[11px] tracking-[0.22em] text-slate-700 transition-colors duration-300 group-hover:text-blue-500">
          {number}
        </span>

        <div className="flex h-11 w-11 items-center justify-center border border-slate-800 bg-slate-950 text-slate-500 transition-all duration-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:text-blue-400">
          <Icon
            size={20}
            strokeWidth={1.6}
          />
        </div>
      </div>

      {/* Label */}
      <div className="relative mt-10">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="relative mt-4">
        <h3 className="text-xl font-bold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
          {title}
        </h3>

        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 transition-colors duration-500 group-hover:text-slate-400">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-7 right-7">
        <ArrowUpRight
          size={18}
          className="text-slate-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
        />
      </div>

      {/* Accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-700 group-hover:w-full" />
    </article>
  );
}