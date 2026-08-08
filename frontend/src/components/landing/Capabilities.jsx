import {
  Gauge,
  Network,
  Activity,
  Radar,
  Map,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import CapabilityCard from "./CapabilityCard";

const capabilities = [
  {
    title: "Adaptive Difficulty",
    description:
      "Questions become easier or harder based on candidate responses.",
    icon: Gauge,
    label: "Adaptive engine",
  },
  {
    title: "Knowledge Graph",
    description:
      "Tracks concept mastery and identifies learning gaps.",
    icon: Network,
    label: "Knowledge layer",
  },
  {
    title: "Confidence Detection",
    description:
      "Detects hesitation and asks targeted follow-up questions.",
    icon: Activity,
    label: "Conversation layer",
  },
  {
    title: "Skill Radar",
    description:
      "Visualizes strengths and weaknesses across AI topics.",
    icon: Radar,
    label: "Assessment layer",
  },
  {
    title: "Career Roadmap",
    description:
      "Suggests learning paths based on interview performance.",
    icon: Map,
    label: "Growth layer",
  },
  {
    title: "Hiring Prediction",
    description:
      "Provides a readiness score and hiring recommendation.",
    icon: TrendingUp,
    label: "Decision layer",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="
        relative
        overflow-hidden
        bg-[#080b10]
        px-6
        py-28
        text-white
        md:py-36
      "
    >
      {/* ===================================================== */}
      {/* Ambient background */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main atmosphere */}
        <div
          className="
            absolute
            right-[-12%]
            top-[5%]
            h-[560px]
            w-[560px]
            rounded-full
            bg-blue-500/[0.035]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            bottom-[-18%]
            left-[-12%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[160px]
          "
        />

        {/* Center glow */}
        <div
          className="
            absolute
            left-1/2
            top-[45%]
            h-[420px]
            w-[420px]
            -translate-x-1/2
            rounded-full
            bg-blue-400/[0.015]
            blur-[140px]
          "
        />

        {/* Technical dot matrix */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
          "
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "36px 36px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        />

        {/* Architectural rings */}
        <div
          className="
            absolute
            left-1/2
            top-[48%]
            h-[720px]
            w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-white/[0.018]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[48%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-blue-400/[0.018]
          "
        />
      </div>

      {/* ===================================================== */}
      {/* Top edge */}
      {/* ===================================================== */}

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
          via-white/[0.06]
          to-transparent
        "
      />

      {/* ===================================================== */}
      {/* Main container */}
      {/* ===================================================== */}

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================== */}
        {/* Heading */}
        {/* =================================================== */}

        <div
          className="
            grid
            gap-10
            lg:grid-cols-[1.15fr_0.85fr]
            lg:items-end
          "
        >
          {/* Heading */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="
                  h-px
                  w-12
                  bg-gradient-to-r
                  from-blue-400
                  to-transparent
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-blue-400
                "
              >
                AI Capabilities
              </span>
            </div>

            <h2
              className="
                mt-8
                max-w-4xl
                text-4xl
                font-semibold
                leading-[0.94]
                tracking-[-0.055em]
                text-white
                sm:text-5xl
                md:text-6xl
              "
            >
              Intelligence behind
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-white
                  via-white/50
                  to-white/20
                  bg-clip-text
                  text-transparent
                "
              >
                every interview.
              </span>
            </h2>
          </div>

          {/* Description */}
          <div>
            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  relative
                  flex
                  h-2
                  w-2
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-blue-400
                    opacity-40
                    blur-sm
                  "
                />

                <span
                  className="
                    relative
                    h-2
                    w-2
                    rounded-full
                    bg-blue-400
                  "
                />
              </span>

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  text-white/25
                "
              >
                Intelligence system / online
              </span>
            </div>

            <p
              className="
                text-[15px]
                leading-8
                text-white/40
                md:text-[16px]
              "
            >
              The system goes beyond static Q&A by
              combining candidate context, adaptive
              questioning, skill analysis, and
              interview intelligence.
            </p>
          </div>
        </div>

        {/* =================================================== */}
        {/* Capability matrix heading */}
        {/* =================================================== */}

        <div
          className="
            mt-20
            flex
            items-center
            justify-between
            border-t
            border-white/[0.07]
            pt-6
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                h-px
                w-7
                bg-blue-400/40
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-white/25
              "
            >
              Capability matrix
            </span>
          </div>

          <span
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/15
            "
          >
            06 intelligence layers
          </span>
        </div>

        {/* =================================================== */}
        {/* Capability matrix */}
        {/* =================================================== */}

        <div
          className="
            mt-8
            grid
            gap-px
            overflow-hidden
            border
            border-white/[0.08]
            bg-white/[0.07]
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {capabilities.map((item, index) => (
            <div
              key={item.title}
              className="
                group
                relative
                overflow-hidden
                bg-[#080b10]
                transition-colors
                duration-500
                hover:bg-[#0b1017]
              "
            >
              {/* Hover glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-64
                  w-64
                  rounded-full
                  bg-blue-500/[0.07]
                  opacity-0
                  blur-[70px]
                  transition-opacity
                  duration-700
                  group-hover:opacity-100
                "
              />

              {/* Secondary glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[-100px]
                  left-[-70px]
                  h-52
                  w-52
                  rounded-full
                  bg-cyan-400/[0.025]
                  opacity-0
                  blur-[70px]
                  transition-opacity
                  duration-700
                  group-hover:opacity-100
                "
              />

              {/* Existing card */}
              <div
                className="
                  relative
                  z-10
                  transition-transform
                  duration-500
                  group-hover:-translate-y-1
                "
              >
                <CapabilityCard
                  {...item}
                  index={index}
                />
              </div>

              {/* Number */}
              <span
                className="
                  pointer-events-none
                  absolute
                  right-6
                  top-6
                  z-20
                  font-mono
                  text-[9px]
                  tracking-[0.2em]
                  text-white/[0.12]
                  transition-colors
                  duration-300
                  group-hover:text-blue-400/40
                "
              >
                0{index + 1}
              </span>

              {/* Hover arrow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-6
                  right-6
                  z-20
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.015]
                  text-white/15
                  opacity-0
                  transition-all
                  duration-500
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                  group-hover:border-blue-400/20
                  group-hover:bg-blue-400/[0.06]
                  group-hover:text-blue-300
                  group-hover:opacity-100
                "
              >
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                />
              </div>

              {/* Scanning accent */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-0
                  z-20
                  h-px
                  w-0
                  bg-gradient-to-r
                  from-blue-400
                  via-blue-300
                  to-transparent
                  transition-all
                  duration-700
                  group-hover:w-full
                "
              />
            </div>
          ))}
        </div>

        {/* =================================================== */}
        {/* System status */}
        {/* =================================================== */}

        <div
          className="
            mt-12
            grid
            gap-px
            overflow-hidden
            border
            border-white/[0.07]
            bg-white/[0.06]
            sm:grid-cols-3
          "
        >
          {/* Context */}
          <div
            className="
              group
              relative
              overflow-hidden
              bg-[#080b10]
              p-6
              transition-colors
              duration-500
              hover:bg-[#0b1017]
            "
          >
            <div
              className="
                absolute
                right-[-30px]
                top-[-30px]
                h-24
                w-24
                rounded-full
                bg-blue-500/[0.04]
                opacity-0
                blur-2xl
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />

            <div className="relative">
              <p
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/20
                "
              >
                Context
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-blue-400
                    shadow-[0_0_12px_rgba(96,165,250,0.8)]
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    text-white/60
                  "
                >
                  Candidate-aware
                </p>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div
            className="
              group
              relative
              overflow-hidden
              bg-[#080b10]
              p-6
              transition-colors
              duration-500
              hover:bg-[#0b1017]
            "
          >
            <div
              className="
                absolute
                right-[-30px]
                top-[-30px]
                h-24
                w-24
                rounded-full
                bg-blue-500/[0.04]
                opacity-0
                blur-2xl
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />

            <div className="relative">
              <p
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/20
                "
              >
                Reasoning
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-cyan-400
                    shadow-[0_0_12px_rgba(34,211,238,0.7)]
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    text-white/60
                  "
                >
                  Response-aware
                </p>
              </div>
            </div>
          </div>

          {/* Output */}
          <div
            className="
              group
              relative
              overflow-hidden
              bg-[#080b10]
              p-6
              transition-colors
              duration-500
              hover:bg-[#0b1017]
            "
          >
            <div
              className="
                absolute
                right-[-30px]
                top-[-30px]
                h-24
                w-24
                rounded-full
                bg-blue-500/[0.04]
                opacity-0
                blur-2xl
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />

            <div className="relative">
              <p
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/20
                "
              >
                Output
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_12px_rgba(52,211,153,0.7)]
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    text-white/60
                  "
                >
                  Actionable insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================== */}
        {/* Bottom system statement */}
        {/* =================================================== */}

        <div
          className="
            mt-10
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.16em]
              text-white/20
            "
          >
            Candidate context → reasoning → assessment → decision
          </p>

          <div
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/20
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_10px_rgba(52,211,153,0.8)]
              "
            />

            System operational
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* Bottom edge */}
      {/* ===================================================== */}

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
          via-white/[0.05]
          to-transparent
        "
      />
    </section>
  );
}