import {
  BrainCircuit,
  Users,
  BarChart3,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    value: "AI",
    label: "Powered interviews",
    description: "Adaptive technical conversations",
    icon: BrainCircuit,
  },
  {
    value: "24/7",
    label: "Interview availability",
    description: "No scheduling bottlenecks",
    icon: Zap,
  },
  {
    value: "360°",
    label: "Candidate analysis",
    description: "Technical and behavioral insight",
    icon: BarChart3,
  },
  {
    value: "1",
    label: "Unified platform",
    description: "Interview, meetings and results",
    icon: Users,
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="
        relative
        overflow-hidden
        bg-[#070a0e]
        px-6
        py-24
        text-white
        md:py-32
      "
    >
      {/* ===================================================== */}
      {/* Background atmosphere */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[560px]
            w-[560px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/[0.035]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            left-[-180px]
            top-[20%]
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
            right-[-160px]
            bottom-[-100px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-cyan-500/[0.02]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
          "
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
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
        {/* Header */}
        {/* =================================================== */}

        <div
          className="
            mb-14
            flex
            flex-col
            gap-5
            border-b
            border-white/[0.07]
            pb-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
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
                tracking-[0.3em]
                text-blue-400
              "
            >
              System Overview
            </span>
          </div>

          <div className="flex items-center gap-3">
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
                  bg-emerald-400
                  opacity-40
                  blur-sm
                "
              />

              <span
                className="
                  relative
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                "
              />
            </span>

            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-white/20
              "
            >
              Intelligence / Infrastructure
            </span>
          </div>
        </div>

        {/* =================================================== */}
        {/* Stats grid */}
        {/* =================================================== */}

        <div
          className="
            grid
            gap-px
            overflow-hidden
            border
            border-white/[0.08]
            bg-white/[0.07]
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="
                  group
                  relative
                  min-h-[290px]
                  overflow-hidden
                  bg-[#070a0e]
                  p-8
                  transition-colors
                  duration-500
                  hover:bg-[#0b1017]
                  md:p-9
                "
              >
                {/* ========================================= */}
                {/* Hover atmosphere */}
                {/* ========================================= */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-56
                    w-56
                    rounded-full
                    bg-blue-500/[0.07]
                    opacity-0
                    blur-[70px]
                    transition-opacity
                    duration-700
                    group-hover:opacity-100
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-[-100px]
                    left-[-70px]
                    h-48
                    w-48
                    rounded-full
                    bg-cyan-400/[0.025]
                    opacity-0
                    blur-[70px]
                    transition-opacity
                    duration-700
                    group-hover:opacity-100
                  "
                />

                {/* ========================================= */}
                {/* Top metadata */}
                {/* ========================================= */}

                <div
                  className="
                    relative
                    flex
                    items-start
                    justify-between
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        font-mono
                        text-[9px]
                        uppercase
                        tracking-[0.25em]
                        text-white/20
                        transition-colors
                        duration-300
                        group-hover:text-blue-400/60
                      "
                    >
                      Metric
                    </span>

                    <span
                      className="
                        font-mono
                        text-[9px]
                        tracking-[0.18em]
                        text-white/[0.08]
                      "
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      text-white/25
                      transition-all
                      duration-500
                      group-hover:border-blue-400/20
                      group-hover:bg-blue-400/[0.06]
                      group-hover:text-blue-300
                    "
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.4}
                    />
                  </div>
                </div>

                {/* ========================================= */}
                {/* Main metric */}
                {/* ========================================= */}

                <div className="relative mt-16">
                  <div
                    className="
                      text-5xl
                      font-semibold
                      tracking-[-0.065em]
                      text-white
                      transition-transform
                      duration-500
                      group-hover:-translate-y-1
                      md:text-6xl
                    "
                  >
                    {stat.value}
                  </div>

                  <h3
                    className="
                      mt-5
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-white/55
                    "
                  >
                    {stat.label}
                  </h3>

                  <p
                    className="
                      mt-2
                      max-w-[220px]
                      text-sm
                      leading-6
                      text-white/25
                      transition-colors
                      duration-500
                      group-hover:text-white/40
                    "
                  >
                    {stat.description}
                  </p>
                </div>

                {/* ========================================= */}
                {/* Bottom arrow */}
                {/* ========================================= */}

                <div
                  className="
                    absolute
                    bottom-7
                    right-7
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.06]
                    text-white/10
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:-translate-y-1
                    group-hover:translate-x-1
                    group-hover:border-blue-400/20
                    group-hover:text-blue-300
                    group-hover:opacity-100
                  "
                >
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                  />
                </div>

                {/* ========================================= */}
                {/* Bottom active line */}
                {/* ========================================= */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
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
              </article>
            );
          })}
        </div>

        {/* =================================================== */}
        {/* Bottom system indicator */}
        {/* =================================================== */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-4
            text-[9px]
            uppercase
            tracking-[0.2em]
            text-white/15
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            Interview intelligence / live system
          </span>

          <span className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_12px_rgba(52,211,153,0.8)]
              "
            />

            Operational
          </span>
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