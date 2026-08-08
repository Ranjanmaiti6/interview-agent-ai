import { ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-slate-950 px-6 py-28 md:py-40"
    >
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.055] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mx-auto flex w-fit items-center gap-2 border border-blue-500/20 bg-blue-500/[0.05] px-4 py-2">
          <Sparkles
            size={13}
            className="text-blue-400"
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
            Ready when you are
          </span>
        </div>

        <h2 className="mt-10 text-5xl font-black leading-[0.92] tracking-[-0.055em] text-white sm:text-6xl md:text-8xl">
          Build better
          <span className="block text-slate-600">
            interviews.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
          Move from static question banks to intelligent, contextual technical
          interviews designed around the candidate.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/login?role=employee")}
            className="group flex min-h-14 items-center justify-center gap-3 bg-white px-7 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-200"
          >
            Start Interview

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate("/login?role=admin")}
            className="group flex min-h-14 items-center justify-center gap-3 border border-slate-700 px-7 text-sm font-bold text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-900"
          >
            Admin Portal

            <ArrowUpRight
              size={17}
              className="text-slate-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400"
            />
          </button>
        </div>

        <div className="mx-auto mt-20 flex max-w-xl items-center justify-center gap-5">
          <span className="h-px flex-1 bg-slate-800" />

          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-700">
            AI Interview Agent
          </span>

          <span className="h-px flex-1 bg-slate-800" />
        </div>
      </div>
    </section>
  );
}