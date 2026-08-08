import {
  BrainCircuit,
  Target,
  Radar,
  MessagesSquare,
  GraduationCap,
  Trophy,
  ArrowUpRight,
} from "lucide-react";

import { useRef, useState } from "react";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "Adaptive Interview",
    description:
      "Interview questions dynamically adapt based on your previous answers.",
  },
  {
    icon: MessagesSquare,
    number: "02",
    title: "Smart Follow-ups",
    description:
      "The AI asks meaningful follow-up questions like a real interviewer.",
  },
  {
    icon: Radar,
    number: "03",
    title: "Skill Radar",
    description:
      "Visualize your strengths and weaknesses in every AI topic.",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Learning Roadmap",
    description:
      "Receive personalized recommendations after every interview.",
  },
  {
    icon: Target,
    number: "05",
    title: "Knowledge Graph",
    description:
      "The AI tracks topic mastery across the curriculum and identifies gaps.",
  },
  {
    icon: Trophy,
    number: "06",
    title: "Hiring Prediction",
    description:
      "Get a realistic interview summary with readiness insights.",
  },
];

function FeatureWrapper({
  feature,
  index,
}) {
  const cardRef = useRef(null);

  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const [isHovered, setIsHovered] =
    useState(false);

  const handleMouseMove = (event) => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const rect =
      element.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width -
        0.5) *
      2;

    const y =
      ((event.clientY - rect.top) /
        rect.height -
        0.5) *
      2;

    setPointer({
      x,
      y,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    setPointer({
      x: 0,
      y: 0,
    });
  };

  const cardTransform = isHovered
    ? `perspective(1000px) rotateX(${
        pointer.y * -2.5
      }deg) rotateY(${
        pointer.x * 3
      }deg) translateZ(8px)`
    : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        group
        relative
        overflow-hidden
        bg-[#080b10]
        transition-all
        duration-500
      "
      style={{
        transform: cardTransform,
        transformStyle: "preserve-3d",
      }}
    >
      {/* ========================================= */}
      {/* Interactive spotlight */}
      {/* ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          z-0
          h-56
          w-56
          rounded-full
          bg-blue-400/[0.07]
          blur-[80px]
          transition-opacity
          duration-500
        "
        style={{
          left: `calc(50% + ${
            pointer.x * 70
          }px)`,
          top: `calc(50% + ${
            pointer.y * 70
          }px)`,
          transform:
            "translate(-50%, -50%)",
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* ========================================= */}
      {/* Technical corner details */}
      {/* ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-12
          w-12
          border-l
          border-t
          border-blue-400/0
          transition-all
          duration-500
          group-hover:border-blue-400/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-12
          w-12
          border-b
          border-r
          border-blue-400/0
          transition-all
          duration-500
          group-hover:border-blue-400/20
        "
      />

      {/* ========================================= */}
      {/* Feature number */}
      {/* ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          right-7
          top-7
          z-10
          text-[10px]
          font-semibold
          tracking-[0.25em]
          text-white/[0.18]
          transition-all
          duration-500
          group-hover:text-blue-300/50
        "
      >
        {feature.number}
      </div>

      {/* ========================================= */}
      {/* Feature content */}
      {/* ========================================= */}

      <div
        className="
          relative
          z-10
          h-full
        "
        style={{
          transform: "translateZ(12px)",
        }}
      >
        <FeatureCard
          {...feature}
        />
      </div>

      {/* ========================================= */}
      {/* Bottom hover line */}
      {/* ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-px
          w-full
          origin-left
          scale-x-0
          bg-gradient-to-r
          from-blue-400
          via-blue-300/40
          to-transparent
          transition-transform
          duration-700
          group-hover:scale-x-100
        "
      />

      {/* ========================================= */}
      {/* Hover arrow */}
      {/* ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-6
          right-7
          z-20
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
          border-white/0
          bg-white/0
          text-white/0
          transition-all
          duration-500
          group-hover:border-white/10
          group-hover:bg-white/[0.04]
          group-hover:text-blue-300
        "
      >
        <ArrowUpRight
          size={14}
          strokeWidth={1.5}
          className="
            transition-transform
            duration-500
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
          "
        />
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="
        relative
        overflow-hidden
        bg-[#05070a]
        py-28
        text-white
        md:py-40
      "
    >
      {/* ========================================= */}
      {/* Background atmosphere */}
      {/* ========================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main blue atmosphere */}

        <div
          className="
            absolute
            left-[8%]
            top-[-12%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-blue-500/[0.035]
            blur-[150px]
          "
        />

        {/* Secondary atmosphere */}

        <div
          className="
            absolute
            bottom-[-18%]
            right-[-5%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[160px]
          "
        />

        {/* Fine dot grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
          "
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize:
              "36px 36px",
          }}
        />

        {/* Horizontal atmospheric line */}

        <div
          className="
            absolute
            left-0
            right-0
            top-[18%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/[0.035]
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-0
            right-0
            bottom-[18%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/[0.025]
            to-transparent
          "
        />
      </div>

      {/* ========================================= */}
      {/* Content */}
      {/* ========================================= */}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================= */}
        {/* Section heading */}
        {/* ========================================= */}

        <div
          className="
            grid
            gap-10
            lg:grid-cols-[0.85fr_1.15fr]
            lg:items-end
          "
        >
          {/* Label */}

          <div>
            <div className="flex items-center gap-3">
              <span
                className="
                  h-px
                  w-12
                  bg-blue-400/70
                "
              />

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.34em]
                  text-blue-300/80
                "
              >
                Interview intelligence
              </p>
            </div>

            <p
              className="
                mt-8
                max-w-xs
                text-xs
                uppercase
                leading-6
                tracking-[0.16em]
                text-white/25
              "
            >
              A technical interview
              environment designed to
              understand how you think.
            </p>
          </div>

          {/* Main heading */}

          <div>
            <h2
              className="
                max-w-4xl
                text-4xl
                font-semibold
                leading-[0.95]
                tracking-[-0.055em]
                text-white
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
              "
            >
              More than just
              <span
                className="
                  block
                  text-white/25
                "
              >
                an AI chatbot.
              </span>
            </h2>

            <p
              className="
                mt-8
                max-w-2xl
                text-sm
                leading-7
                text-white/40
                md:text-base
                md:leading-8
              "
            >
              Our Interview Agent uses the
              supplied curriculum and
              candidate learning journey to
              conduct adaptive,
              conversational interviews
              instead of asking static
              questions.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* Feature system */}
        {/* ========================================= */}

        <div
          className="
            mt-20
            overflow-hidden
            border
            border-white/[0.075]
            bg-white/[0.018]
            shadow-[0_40px_120px_rgba(0,0,0,0.25)]
            md:mt-24
          "
        >
          <div
            className="
              grid
              gap-px
              bg-white/[0.075]
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {features.map(
              (feature, index) => (
                <FeatureWrapper
                  key={feature.title}
                  feature={feature}
                  index={index}
                />
              )
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* Bottom intelligence strip */}
        {/* ========================================= */}

        <div
          className="
            mt-10
            grid
            gap-8
            border-y
            border-white/[0.07]
            py-8
            md:grid-cols-[1fr_auto]
            md:items-center
          "
        >
          {/* Text */}

          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-white/25
              "
            >
              Interview intelligence
            </p>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-white/35
                md:text-sm
              "
            >
              Context-aware evaluation
              designed around the candidate
              journey.
            </p>
          </div>

          {/* Status */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                relative
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-blue-400/15
                bg-blue-400/[0.035]
              "
            >
              <span
                className="
                  absolute
                  h-2
                  w-2
                  animate-ping
                  rounded-full
                  bg-blue-400/30
                "
              />

              <span
                className="
                  relative
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-blue-300
                  shadow-[0_0_14px_rgba(96,165,250,0.8)]
                "
              />
            </div>

            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-blue-300/70
                "
              >
                System ready
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-white/25
                "
              >
                Adaptive evaluation active
              </p>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* Technical footer marker */}
        {/* ========================================= */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            text-[8px]
            uppercase
            tracking-[0.28em]
            text-white/[0.16]
          "
        >
          <span>
            06 intelligence systems
          </span>

          <span className="hidden sm:block">
            Context · Memory · Evaluation
          </span>

          <span>
            01—06
          </span>
        </div>
      </div>
    </section>
  );
}