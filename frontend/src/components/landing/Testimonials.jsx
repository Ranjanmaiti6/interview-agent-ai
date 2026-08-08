import { Quote, ArrowUpRight } from "lucide-react";

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
      {/* ================================================= */}
      {/* Background atmosphere */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            right-[-15%]
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
            bottom-[-20%]
            left-[-10%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[150px]
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
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
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
          via-white/[0.06]
          to-transparent
        "
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ================================================= */}
        {/* Heading */}
        {/* ================================================= */}

        <div
          className="
            grid
            gap-10
            lg:grid-cols-[0.65fr_1.35fr]
            lg:items-end
          "
        >
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
                  tracking-[0.3em]
                  text-blue-400
                "
              >
                Experience
              </span>
            </div>

            <p
              className="
                mt-7
                font-mono
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-white/20
              "
            >
              Designed around the conversation
            </p>
          </div>

          <div>
            <h2
              className="
                text-4xl
                font-semibold
                leading-[0.94]
                tracking-[-0.055em]
                text-white
                sm:text-5xl
                md:text-6xl
              "
            >
              Built for better
              <span className="block text-white/25">
                conversations.
              </span>
            </h2>

            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-8
                text-white/35
                md:text-lg
              "
            >
              A more contextual interview experience for candidates,
              recruiters and technical teams.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* Testimonial cards */}
        {/* ================================================= */}

        <div
          className="
            mt-20
            grid
            gap-px
            overflow-hidden
            border
            border-white/[0.08]
            bg-white/[0.07]
            lg:grid-cols-3
          "
        >
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="
                group
                relative
                min-h-[370px]
                overflow-hidden
                bg-[#080b10]
                p-8
                transition-colors
                duration-500
                hover:bg-[#0c1118]
                md:p-10
              "
            >
              {/* Hover atmosphere */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-64
                  w-64
                  rounded-full
                  bg-blue-500/[0.065]
                  opacity-0
                  blur-[80px]
                  transition-opacity
                  duration-700
                  group-hover:opacity-100
                "
              />

              {/* Top row */}

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    text-blue-300/70
                    transition-all
                    duration-500
                    group-hover:border-blue-400/20
                    group-hover:bg-blue-400/[0.06]
                    group-hover:text-blue-300
                  "
                >
                  <Quote
                    size={20}
                    strokeWidth={1.25}
                  />
                </div>

                <span
                  className="
                    font-mono
                    text-[9px]
                    tracking-[0.22em]
                    text-white/15
                    transition-colors
                    duration-300
                    group-hover:text-blue-400/40
                  "
                >
                  0{index + 1}
                </span>
              </div>

              {/* Quote */}

              <blockquote
                className="
                  relative
                  mt-14
                  max-w-md
                  text-[17px]
                  font-medium
                  leading-8
                  tracking-[-0.015em]
                  text-white/65
                  transition-colors
                  duration-500
                  group-hover:text-white/80
                  md:text-lg
                "
              >
                “{item.quote}”
              </blockquote>

              {/* Bottom information */}

              <div
                className="
                  absolute
                  bottom-8
                  left-8
                  right-8
                  border-t
                  border-white/[0.06]
                  pt-5
                  md:left-10
                  md:right-10
                "
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-white/45
                      "
                    >
                      {item.name}
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-xs
                        text-white/20
                      "
                    >
                      {item.role}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.4}
                    className="
                      text-white/10
                      opacity-0
                      transition-all
                      duration-500
                      group-hover:-translate-y-1
                      group-hover:translate-x-1
                      group-hover:text-blue-300
                      group-hover:opacity-100
                    "
                  />
                </div>
              </div>

              {/* Bottom active line */}

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
          ))}
        </div>
      </div>

      {/* Bottom edge */}

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