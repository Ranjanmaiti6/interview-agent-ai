import {
  ArrowUpRight,
  Sparkles,
  BrainCircuit,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="cta"
      className="
        relative
        overflow-hidden
        bg-[#05070a]
        px-6
        py-28
        text-white
        md:py-40
      "
    >
      {/* ================================================= */}
      {/* Cinematic background */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Central light */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/[0.045]
            blur-[170px]
          "
        />

        {/* Secondary lights */}

        <div
          className="
            absolute
            left-[-15%]
            top-[30%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            right-[-12%]
            bottom-[5%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-cyan-500/[0.02]
            blur-[140px]
          "
        />

        {/* Technical grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 72%)",
          }}
        />

        {/* Fine radial lines */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[720px]
            w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.025]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-blue-400/[0.035]
          "
        />
      </div>

      {/* ================================================= */}
      {/* Top edge */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/[0.07]
          to-transparent
        "
      />

      {/* ================================================= */}
      {/* Main content */}
      {/* ================================================= */}

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Eyebrow */}

        <div
          className="
            mx-auto
            flex
            w-fit
            items-center
            gap-2.5
            rounded-full
            border
            border-blue-400/[0.16]
            bg-blue-400/[0.04]
            px-4
            py-2
            backdrop-blur-md
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="
                absolute
                inset-0
                rounded-full
                bg-blue-300
                opacity-50
                blur-sm
              "
            />

            <span
              className="
                relative
                h-1.5
                w-1.5
                rounded-full
                bg-blue-300
              "
            />
          </span>

          <Sparkles
            size={12}
            strokeWidth={1.5}
            className="text-blue-300"
          />

          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-blue-300
            "
          >
            Ready when you are
          </span>
        </div>

        {/* Heading */}

        <h2
          className="
            mt-10
            text-5xl
            font-semibold
            leading-[0.9]
            tracking-[-0.065em]
            text-white
            sm:text-6xl
            md:text-8xl
          "
        >
          Build better
          <span
            className="
              block
              bg-gradient-to-b
              from-white/30
              to-white/[0.08]
              bg-clip-text
              text-transparent
            "
          >
            interviews.
          </span>
        </h2>

        {/* Description */}

        <p
          className="
            mx-auto
            mt-8
            max-w-2xl
            text-base
            leading-8
            text-white/35
            md:text-lg
          "
        >
          Move from static question banks to intelligent, contextual technical
          interviews designed around the candidate.
        </p>

        {/* ================================================= */}
        {/* CTA buttons */}
        {/* ================================================= */}

        <div
          className="
            mt-12
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
          "
        >
          {/* Start Interview */}

          <button
            type="button"
            onClick={() =>
              navigate("/login?role=employee")
            }
            className="
              group
              relative
              flex
              min-h-14
              min-w-[190px]
              items-center
              justify-center
              gap-3
              overflow-hidden
              rounded-xl
              bg-white
              px-7
              text-sm
              font-semibold
              text-slate-950
              shadow-[0_20px_60px_rgba(255,255,255,0.08)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-slate-100
              hover:shadow-[0_25px_70px_rgba(255,255,255,0.12)]
            "
          >
            <span className="relative z-10">
              Start Interview
            </span>

            <ArrowUpRight
              size={17}
              strokeWidth={1.8}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover:-translate-y-1
                group-hover:translate-x-1
              "
            />

            <span
              className="
                absolute
                inset-0
                -translate-x-full
                skew-x-[-18deg]
                bg-blue-100/60
                transition-transform
                duration-500
                group-hover:translate-x-full
              "
            />
          </button>

          {/* Admin */}

          <button
            type="button"
            onClick={() =>
              navigate("/login?role=admin")
            }
            className="
              group
              flex
              min-h-14
              min-w-[190px]
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-white/[0.10]
              bg-white/[0.025]
              px-7
              text-sm
              font-semibold
              text-white/65
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-white/[0.18]
              hover:bg-white/[0.055]
              hover:text-white
            "
          >
            Admin Portal

            <ArrowUpRight
              size={17}
              strokeWidth={1.6}
              className="
                text-white/20
                transition-all
                duration-300
                group-hover:-translate-y-1
                group-hover:translate-x-1
                group-hover:text-blue-300
              "
            />
          </button>
        </div>

        {/* ================================================= */}
        {/* System identity */}
        {/* ================================================= */}

        <div
          className="
            mx-auto
            mt-20
            flex
            max-w-xl
            items-center
            justify-center
            gap-5
          "
        >
          <span
            className="
              h-px
              flex-1
              bg-white/[0.06]
            "
          />

          <div className="flex items-center gap-2.5">
            <BrainCircuit
              size={13}
              strokeWidth={1.4}
              className="text-blue-400/40"
            />

            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.25em]
                text-white/15
              "
            >
              AI Interview Agent
            </span>
          </div>

          <span
            className="
              h-px
              flex-1
              bg-white/[0.06]
            "
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* Bottom edge */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/[0.06]
          to-transparent
        "
      />
    </section>
  );
}