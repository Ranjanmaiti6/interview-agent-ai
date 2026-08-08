import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Database,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const heroRef = useRef(null);

  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const handlePointerMove = (event) => {
    const element = heroRef.current;

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

  const handlePointerLeave = () => {
    setPointer({
      x: 0,
      y: 0,
    });
  };

  useEffect(() => {
    const element = heroRef.current;

    if (!element) {
      return;
    }

    const handleDeviceOrientation = (
      event
    ) => {
      if (
        typeof event.gamma !== "number" ||
        typeof event.beta !== "number"
      ) {
        return;
      }

      const x = Math.max(
        -1,
        Math.min(1, event.gamma / 35)
      );

      const y = Math.max(
        -1,
        Math.min(1, event.beta / 45)
      );

      setPointer({
        x,
        y,
      });
    };

    window.addEventListener(
      "deviceorientation",
      handleDeviceOrientation
    );

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleDeviceOrientation
      );
    };
  }, []);

  const coreTransform = `
    perspective(1100px)
    rotateX(${pointer.y * -5}deg)
    rotateY(${pointer.x * 7}deg)
  `;

  const innerTransform = `
    translate3d(
      ${pointer.x * 10}px,
      ${pointer.y * 10}px,
      0
    )
  `;

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#05070a]
        text-white
      "
    >
      {/* ========================================= */}
      {/* Background atmosphere */}
      {/* ========================================= */}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="
            absolute
            left-1/2
            top-[32%]
            -translate-x-1/2
            w-[620px]
            h-[620px]
            rounded-full
            bg-blue-500/[0.055]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            right-[-180px]
            top-[18%]
            w-[420px]
            h-[420px]
            rounded-full
            bg-cyan-400/[0.025]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            left-[-180px]
            bottom-[-120px]
            w-[440px]
            h-[440px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[120px]
          "
        />

        <div className="absolute inset-0 hero-grid opacity-40" />
      </div>

      {/* ========================================= */}
      {/* Top ambient line */}
      {/* ========================================= */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-blue-400/30
          to-transparent
        "
      />

      {/* ========================================= */}
      {/* Main content */}
      {/* ========================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          min-h-screen
          px-6
          pt-32
          pb-16
          lg:px-8
          lg:pt-36
        "
      >
        <div
          className="
            grid
            min-h-[calc(100vh-11rem)]
            items-center
            gap-14
            lg:grid-cols-[1.02fr_0.98fr]
            lg:gap-8
          "
        >
          {/* ========================================= */}
          {/* Left */}
          {/* ========================================= */}

          <div className="relative z-20 max-w-3xl">
            {/* Eyebrow */}

            <div
              className="
                inline-flex
                items-center
                gap-2.5
                rounded-full
                border
                border-white/[0.09]
                bg-white/[0.025]
                px-3.5
                py-2
                backdrop-blur-md
                hero-fade-up
              "
            >
              <span
                className="
                  flex
                  h-2
                  w-2
                  rounded-full
                  bg-blue-400
                  shadow-[0_0_14px_rgba(96,165,250,0.75)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-white/55
                "
              >
                AI Powered Interview Platform
              </span>
            </div>

            {/* Heading */}

            <h1
              className="
                mt-8
                max-w-4xl
                text-[clamp(3.5rem,8vw,7.4rem)]
                font-semibold
                leading-[0.88]
                tracking-[-0.065em]
                hero-fade-up
                hero-fade-up-delay-1
              "
            >
              Master the
              <span className="block">
                <span className="text-white">
                  AI Engineering
                </span>
              </span>

              <span
                className="
                  block
                  bg-gradient-to-r
                  from-blue-300
                  via-blue-400
                  to-white
                  bg-clip-text
                  text-transparent
                "
              >
                interview.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-8
                max-w-xl
                text-[16px]
                leading-7
                text-white/48
                sm:text-[17px]
                sm:leading-8
                hero-fade-up
                hero-fade-up-delay-2
              "
            >
              Experience adaptive technical
              interviews that analyze your
              learning journey, ask intelligent
              follow-up questions, and generate
              personalized feedback.
            </p>

            {/* Actions */}

            <div
              className="
                mt-9
                flex
                flex-col
                gap-3
                sm:flex-row
                hero-fade-up
                hero-fade-up-delay-3
              "
            >
              <Link
                to="/candidate"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-blue-500
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_12px_45px_rgba(37,99,235,0.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-blue-400
                  hover:shadow-[0_18px_55px_rgba(37,99,235,0.34)]
                "
              >
                Start Interview

                <ArrowUpRight
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>

              <a
                href="#features"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.11]
                  bg-white/[0.025]
                  px-6
                  py-3.5
                  text-sm
                  font-medium
                  text-white/70
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-white/[0.18]
                  hover:bg-white/[0.055]
                  hover:text-white
                "
              >
                Explore Features

                <ArrowDown
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-y-1
                  "
                />
              </a>
            </div>

            {/* Trust line */}

            <div
              className="
                mt-12
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
                text-[11px]
                uppercase
                tracking-[0.16em]
                text-white/30
                hero-fade-up
                hero-fade-up-delay-4
              "
            >
              <span className="flex items-center gap-2">
                <BrainCircuit
                  size={14}
                  className="text-blue-400/70"
                />
                Adaptive AI
              </span>

              <span className="h-3 w-px bg-white/10" />

              <span className="flex items-center gap-2">
                <Database
                  size={13}
                  className="text-blue-400/70"
                />
                Interview Memory
              </span>

              <span className="h-3 w-px bg-white/10" />

              <span className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-blue-400/70"
                />
                AI Evaluation
              </span>
            </div>
          </div>

          {/* ========================================= */}
          {/* Right visual */}
          {/* ========================================= */}

          <div
            className="
              relative
              flex
              min-h-[420px]
              items-center
              justify-center
              lg:min-h-[650px]
            "
          >
            {/* Outer atmosphere */}

            <div
              className="
                absolute
                h-[390px]
                w-[390px]
                rounded-full
                bg-blue-500/[0.035]
                blur-[90px]
                sm:h-[500px]
                sm:w-[500px]
              "
            />

            {/* Technical frame */}

            <div
              className="
                absolute
                h-[330px]
                w-[330px]
                rounded-full
                border
                border-white/[0.055]
                sm:h-[470px]
                sm:w-[470px]
              "
              style={{
                transform: `translate(
                  ${pointer.x * -5}px,
                  ${pointer.y * -5}px
                )`,
              }}
            />

            <div
              className="
                absolute
                h-[270px]
                w-[270px]
                rounded-full
                border
                border-blue-400/[0.08]
                sm:h-[390px]
                sm:w-[390px]
              "
              style={{
                transform: `translate(
                  ${pointer.x * 5}px,
                  ${pointer.y * 5}px
                )`,
              }}
            />

            {/* Main core */}

            <div
              className="
                relative
                h-[280px]
                w-[280px]
                sm:h-[380px]
                sm:w-[380px]
                hero-core
              "
              style={{
                transform: coreTransform,
              }}
            >
              {/* Back ring */}

              <div
                className="
                  absolute
                  inset-[8%]
                  rounded-full
                  border
                  border-white/[0.07]
                  hero-ring-slow
                "
              />

              {/* Main ring */}

              <div
                className="
                  absolute
                  inset-[17%]
                  rounded-full
                  border
                  border-blue-400/[0.20]
                  hero-ring
                "
              />

              {/* Counter ring */}

              <div
                className="
                  absolute
                  inset-[27%]
                  rounded-full
                  border
                  border-white/[0.08]
                  hero-ring-reverse
                "
              />

              {/* Central glass disc */}

              <div
                className="
                  absolute
                  inset-[31%]
                  rounded-full
                  border
                  border-blue-300/20
                  bg-[#0a1018]/80
                  shadow-[0_0_80px_rgba(37,99,235,0.16),inset_0_0_45px_rgba(96,165,250,0.06)]
                  backdrop-blur-xl
                  flex
                  items-center
                  justify-center
                "
                style={{
                  transform: innerTransform,
                }}
              >
                <div
                  className="
                    absolute
                    inset-[13%]
                    rounded-full
                    border
                    border-blue-300/10
                  "
                />

                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-blue-300/20
                    bg-blue-500/[0.07]
                    shadow-[0_0_35px_rgba(59,130,246,0.18)]
                  "
                >
                  <BrainCircuit
                    size={31}
                    strokeWidth={1.35}
                    className="
                      text-blue-300
                      hero-brain-pulse
                    "
                  />
              </div>
              </div>

              {/* Orbiting light */}

              <span
                className="
                  absolute
                  left-1/2
                  top-[7%]
                  h-2
                  w-2
                  -translate-x-1/2
                  rounded-full
                  bg-blue-300
                  shadow-[0_0_20px_rgba(147,197,253,0.9)]
                  hero-orbit-dot
                "
              />

              {/* Secondary orbit dot */}

              <span
                className="
                  absolute
                  bottom-[16%]
                  right-[13%]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-white/70
                  shadow-[0_0_14px_rgba(255,255,255,0.7)]
                  hero-orbit-dot-reverse
                "
              />

              {/* Data points */}

              <span className="absolute left-[13%] top-[30%] h-1 w-1 rounded-full bg-blue-300/70 hero-data-1" />

              <span className="absolute right-[14%] top-[42%] h-1 w-1 rounded-full bg-blue-300/50 hero-data-2" />

              <span className="absolute left-[28%] bottom-[13%] h-1 w-1 rounded-full bg-white/40 hero-data-3" />

              {/* Central signal */}

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-px
                  w-[92%]
                  -translate-x-1/2
                  -translate-y-1/2
                  bg-gradient-to-r
                  from-transparent
                  via-blue-300/20
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[92%]
                  w-px
                  -translate-x-1/2
                  -translate-y-1/2
                  bg-gradient-to-b
                  from-transparent
                  via-blue-300/10
                  to-transparent
                "
              />
            </div>

            {/* Floating information labels */}

            <div
              className="
                absolute
                left-[4%]
                top-[19%]
                hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#090d13]/80
                px-3.5
                py-3
                backdrop-blur-xl
                sm:block
                hero-float-a
              "
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Adaptive
                </span>
              </div>

              <p className="mt-1.5 text-xs text-white/75">
                Question engine
              </p>
            </div>

            <div
              className="
                absolute
                right-[3%]
                top-[31%]
                hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#090d13]/80
                px-3.5
                py-3
                backdrop-blur-xl
                sm:block
                hero-float-b
              "
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Live
                </span>
              </div>

              <p className="mt-1.5 text-xs text-white/75">
                AI evaluation
              </p>
            </div>

            <div
              className="
                absolute
                bottom-[15%]
                left-[9%]
                hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#090d13]/80
                px-3.5
                py-3
                backdrop-blur-xl
                sm:block
                hero-float-c
              "
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Context
              </p>

              <p className="mt-1.5 text-xs text-white/70">
                Interview memory
              </p>
            </div>

            {/* Bottom technical marker */}

            <div
              className="
                absolute
                bottom-[4%]
                right-[7%]
                hidden
                items-center
                gap-3
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-white/25
                sm:flex
              "
            >
              <span className="h-px w-10 bg-white/10" />
              Neural evaluation system
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* Scroll indicator */}
      {/* ========================================= */}

      <a
        href="#features"
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          hidden
          -translate-x-1/2
          items-center
          gap-3
          text-[9px]
          font-medium
          uppercase
          tracking-[0.25em]
          text-white/25
          transition-colors
          duration-300
          hover:text-white/60
          md:flex
        "
      >
        <span>Scroll to explore</span>

        <span
          className="
            flex
            h-8
            w-5
            items-center
            justify-center
            rounded-full
            border
            border-white/10
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-blue-300/70
              hero-scroll-dot
            "
          />
        </span>
      </a>
    </section>
  );
}