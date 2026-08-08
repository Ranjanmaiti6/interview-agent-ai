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
      className="
        relative
        overflow-hidden
        bg-[#05070a]
        py-28
        text-white
        md:py-36
      "
    >
      {/* ===================================================== */}
      {/* Ambient environment */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main atmosphere */}
        <div
          className="
            absolute
            left-[-15%]
            top-[15%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-500/[0.035]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-12%]
            bottom-[0]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/[0.025]
            blur-[160px]
          "
        />

        {/* Central glow */}
        <div
          className="
            absolute
            left-1/2
            top-[38%]
            h-[420px]
            w-[420px]
            -translate-x-1/2
            rounded-full
            bg-blue-600/[0.018]
            blur-[140px]
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
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          }}
        />

        {/* Large architectural circle */}
        <div
          className="
            absolute
            right-[-180px]
            top-[20%]
            h-[560px]
            w-[560px]
            rounded-full
            border
            border-white/[0.025]
          "
        />

        <div
          className="
            absolute
            right-[-80px]
            top-[30%]
            h-[360px]
            w-[360px]
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
          via-white/[0.06]
          to-transparent
        "
      />

      {/* ===================================================== */}
      {/* Main */}
      {/* ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-6">
        {/* =================================================== */}
        {/* Header */}
        {/* =================================================== */}

        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.72fr_1.28fr]
            lg:items-end
          "
        >
          {/* Metadata */}
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

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-blue-400
                "
              >
                About
              </p>
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
              <Sparkles
                size={13}
                strokeWidth={1.5}
                className="text-blue-400/70"
              />

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-white/35
                "
              >
                Intelligent interviewing
              </span>
            </div>
          </div>

          {/* Main heading */}
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
              Smarter
              <span className="text-white/20">
                {" "}
                technical{" "}
              </span>
              <span
                className="
                  bg-gradient-to-r
                  from-white
                  via-blue-200
                  to-white/55
                  bg-clip-text
                  text-transparent
                "
              >
                interviews.
              </span>
            </h2>

            <p
              className="
                mt-7
                max-w-3xl
                text-[15px]
                leading-8
                text-white/40
                md:text-[16px]
              "
            >
              Our AI Interview Agent evaluates candidates
              using curriculum progress, interview context,
              and adaptive questioning instead of static
              quizzes. It creates a realistic technical
              interview experience that helps both learners
              and recruiters.
            </p>
          </div>
        </div>

        {/* =================================================== */}
        {/* Architecture label */}
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
                h-1.5
                w-1.5
                rounded-full
                bg-blue-400
                shadow-[0_0_12px_rgba(96,165,250,0.7)]
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-white/30
              "
            >
              Intelligence architecture
            </span>
          </div>

          <span
            className="
              hidden
              font-mono
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/20
              sm:block
            "
          >
            04 core capabilities
          </span>
        </div>

        {/* =================================================== */}
        {/* Feature architecture */}
        {/* =================================================== */}

        <div className="mt-8 border-y border-white/[0.07]">
          <div className="grid md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className={`
                    group
                    relative
                    min-h-[300px]
                    overflow-hidden
                    p-8
                    md:p-10
                    lg:min-h-[330px]
                    ${
                      index % 2 === 0
                        ? "md:border-r md:border-white/[0.07]"
                        : ""
                    }
                    ${
                      index < 2
                        ? "border-b border-white/[0.07]"
                        : ""
                    }
                  `}
                >
                  {/* ================================================= */}
                  {/* Hover atmosphere */}
                  {/* ================================================= */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-24
                      -top-24
                      h-72
                      w-72
                      rounded-full
                      bg-blue-500/[0.065]
                      opacity-0
                      blur-[70px]
                      transition-all
                      duration-700
                      group-hover:opacity-100
                    "
                  />

                  {/* Secondary light */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-[-100px]
                      left-[-80px]
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

                  {/* ================================================= */}
                  {/* Top metadata */}
                  {/* ================================================= */}

                  <div className="relative flex items-start justify-between">
                    <span
                      className="
                        font-mono
                        text-[10px]
                        tracking-[0.22em]
                        text-white/20
                        transition-colors
                        duration-300
                        group-hover:text-blue-400/70
                      "
                    >
                      {feature.number}
                    </span>

                    <div
                      className="
                        relative
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.025]
                        text-white/35
                        shadow-[inset_0_0_25px_rgba(255,255,255,0.015)]
                        transition-all
                        duration-500
                        group-hover:-translate-y-1
                        group-hover:border-blue-400/25
                        group-hover:bg-blue-500/[0.07]
                        group-hover:text-blue-300
                        group-hover:shadow-[0_12px_35px_rgba(37,99,235,0.10)]
                      "
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.4}
                      />

                      {/* Icon glow */}
                      <span
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          rounded-2xl
                          bg-blue-400/[0.06]
                          opacity-0
                          blur-xl
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        "
                      />
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* Content */}
                  {/* ================================================= */}

                  <div
                    className="
                      relative
                      mt-14
                      max-w-xl
                    "
                  >
                    <h3
                      className="
                        text-2xl
                        font-semibold
                        tracking-[-0.035em]
                        text-white
                        transition-transform
                        duration-500
                        group-hover:translate-x-1
                        md:text-3xl
                      "
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="
                        mt-4
                        max-w-lg
                        text-sm
                        leading-7
                        text-white/30
                        transition-colors
                        duration-500
                        group-hover:text-white/45
                        md:text-[15px]
                      "
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* ================================================= */}
                  {/* Arrow */}
                  {/* ================================================= */}

                  <div
                    className="
                      absolute
                      bottom-8
                      right-8
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.06]
                      bg-white/[0.015]
                      text-white/20
                      transition-all
                      duration-500
                      group-hover:-translate-y-1
                      group-hover:translate-x-1
                      group-hover:border-blue-400/20
                      group-hover:bg-blue-500/[0.06]
                      group-hover:text-blue-300
                    "
                  >
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* ================================================= */}
                  {/* Bottom scanning line */}
                  {/* ================================================= */}

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

                  {/* Vertical accent */}
                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-0
                      w-px
                      bg-gradient-to-b
                      from-blue-400
                      to-transparent
                      transition-all
                      duration-700
                      group-hover:h-24
                    "
                  />
                </article>
              );
            })}
          </div>
        </div>

        {/* =================================================== */}
        {/* Bottom statement */}
        {/* =================================================== */}

        <div
          className="
            mt-16
            flex
            flex-col
            justify-between
            gap-8
            border-t
            border-white/[0.07]
            pt-9
            md:flex-row
            md:items-center
          "
        >
          <p
            className="
              max-w-2xl
              text-[13px]
              leading-7
              text-white/30
              md:text-sm
            "
          >
            Built to make technical interviews feel less
            like a questionnaire and more like a genuine
            engineering conversation.
          </p>

          <div
            className="
              flex
              items-center
              gap-3
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-white/30
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
                  shadow-[0_0_14px_rgba(59,130,246,0.8)]
                "
              />
            </span>

            AI-powered evaluation
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