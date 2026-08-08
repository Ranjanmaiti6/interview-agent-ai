import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  FileSearch,
  MessageSquareText,
  BarChart3,
} from "lucide-react";

import WorkflowCard from "./WorkflowCard";

const steps = [
  {
    number: "01",
    title: "Choose Candidate",
    description:
      "Select a candidate profile based on their learning journey.",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "AI Reads Progress",
    description:
      "The AI analyzes completed modules and learning history.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Adaptive Interview",
    description:
      "Questions change based on previous answers and confidence.",
    icon: MessageSquareText,
  },
  {
    number: "04",
    title: "Feedback Report",
    description:
      "Receive strengths, weaknesses and learning suggestions.",
    icon: BarChart3,
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="
        relative
        overflow-hidden
        bg-[#05070a]
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
        {/* Main light */}
        <div
          className="
            absolute
            left-1/2
            top-[8%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/[0.035]
            blur-[150px]
          "
        />

        {/* Left atmosphere */}
        <div
          className="
            absolute
            bottom-[-18%]
            left-[-12%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-cyan-500/[0.025]
            blur-[150px]
          "
        />

        {/* Right atmosphere */}
        <div
          className="
            absolute
            right-[-15%]
            top-[35%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/[0.02]
            blur-[160px]
          "
        />

        {/* Technical grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        />

        {/* Fine radial grid */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
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
            border-blue-400/[0.025]
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
          via-blue-400/20
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
            lg:grid-cols-[0.72fr_1.28fr]
            lg:items-end
          "
        >
          {/* Left metadata */}
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
                Workflow
              </span>
            </div>

            <div
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/[0.07]
                bg-white/[0.02]
                px-3.5
                py-2
                backdrop-blur-md
              "
            >
              <span
                className="
                  relative
                  flex
                  h-1.5
                  w-1.5
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-blue-400
                    opacity-50
                    animate-ping
                  "
                />

                <span
                  className="
                    relative
                    h-1.5
                    w-1.5
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
                  text-white/35
                "
              >
                04 stages / 01 intelligent system
              </span>
            </div>
          </div>

          {/* Right heading */}
          <div>
            <h2
              className="
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
              From profile
              <span className="text-white/20">
                {" "}
                to{" "}
              </span>
              <span
                className="
                  bg-gradient-to-r
                  from-white
                  via-blue-200
                  to-white/60
                  bg-clip-text
                  text-transparent
                "
              >
                insight.
              </span>
            </h2>

            <p
              className="
                mt-7
                max-w-2xl
                text-[15px]
                leading-8
                text-white/40
                md:text-[16px]
              "
            >
              A structured interview workflow that turns
              candidate context into an adaptive technical
              conversation and actionable feedback.
            </p>
          </div>
        </div>

        {/* =================================================== */}
        {/* Process system */}
        {/* =================================================== */}

        <div className="relative mt-20 md:mt-24">
          {/* Desktop connection system */}
          <div
            className="
              pointer-events-none
              absolute
              left-[8%]
              right-[8%]
              top-[58px]
              hidden
              lg:block
            "
          >
            {/* Main line */}
            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-blue-400/20
                to-transparent
              "
            />

            {/* Animated light */}
            <div
              className="
                absolute
                top-[-1px]
                h-[2px]
                w-24
                rounded-full
                bg-gradient-to-r
                from-transparent
                via-blue-300/70
                to-transparent
                workflow-line-scan
              "
            />
          </div>

          <div
            className="
              grid
              gap-5
              lg:grid-cols-4
            "
          >
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="
                  group
                  relative
                "
              >
                {/* ================================================= */}
                {/* Step number node */}
                {/* ================================================= */}

                <div
                  className="
                    relative
                    z-20
                    mx-auto
                    mb-6
                    flex
                    h-[58px]
                    w-[58px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.10]
                    bg-[#080b10]
                    shadow-[0_0_0_7px_rgba(255,255,255,0.012)]
                    transition-all
                    duration-500
                    group-hover:border-blue-400/30
                    group-hover:shadow-[0_0_0_8px_rgba(59,130,246,0.035),0_0_35px_rgba(59,130,246,0.12)]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[11px]
                      font-medium
                      tracking-[0.16em]
                      text-white/35
                      transition-colors
                      duration-300
                      group-hover:text-blue-300
                    "
                  >
                    {step.number}
                  </span>

                  {/* Node center */}
                  <span
                    className="
                      absolute
                      bottom-[-3px]
                      left-1/2
                      h-1
                      w-1
                      -translate-x-1/2
                      rounded-full
                      bg-blue-400/60
                      opacity-0
                      shadow-[0_0_12px_rgba(96,165,250,0.9)]
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />
                </div>

                {/* ================================================= */}
                {/* Existing WorkflowCard */}
                {/* ================================================= */}

                <div
                  className="
                    relative
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:-translate-y-1.5
                  "
                >
                  {/* Premium glow */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-8
                      -top-4
                      h-20
                      rounded-full
                      bg-blue-500/[0.045]
                      opacity-0
                      blur-3xl
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  <WorkflowCard
                    {...step}
                    isLast={
                      index ===
                      steps.length - 1
                    }
                  />
                </div>

                {/* ================================================= */}
                {/* Mobile connector */}
                {/* ================================================= */}

                {index !==
                  steps.length - 1 && (
                  <div
                    className="
                      flex
                      justify-center
                      py-5
                      lg:hidden
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                      "
                    >
                      <ArrowDown
                        size={15}
                        strokeWidth={1.5}
                        className="text-blue-400/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* =================================================== */}
        {/* Bottom statement */}
        {/* =================================================== */}

        <div
          className="
            relative
            mt-16
            overflow-hidden
            border-y
            border-white/[0.07]
            py-8
            md:mt-20
          "
        >
          {/* Moving accent */}
          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-0
              h-px
              w-28
              bg-gradient-to-r
              from-transparent
              via-blue-400/50
              to-transparent
              workflow-line-scan
            "
          />

          <div
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div className="max-w-2xl">
              <p
                className="
                  text-[13px]
                  leading-7
                  text-white/35
                  md:text-sm
                "
              >
                Each stage adds context to the next,
                allowing the interview to become
                progressively more relevant to the
                candidate.
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                font-mono
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-white/25
              "
            >
              <span className="hidden h-px w-8 bg-white/10 sm:block" />

              <span>
                Candidate
              </span>

              <ArrowUpRight
                size={11}
                className="text-blue-400/60"
              />

              <span>
                Context
              </span>

              <ArrowUpRight
                size={11}
                className="text-blue-400/60"
              />

              <span>
                Interview
              </span>

              <ArrowUpRight
                size={11}
                className="text-blue-400/60"
              />

              <span>
                Intelligence
              </span>
            </div>
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
          via-white/[0.06]
          to-transparent
        "
      />
    </section>
  );
}