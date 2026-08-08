import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Database,
  Sparkles,
  Activity,
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
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  };

  const handlePointerLeave = () => {
    setPointer({
      x: 0,
      y: 0,
    });
  };

  useEffect(() => {
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
    perspective(1200px)
    rotateX(${pointer.y * -5}deg)
    rotateY(${pointer.x * 7}deg)
  `;

  const innerTransform = `
    translate3d(
      ${pointer.x * 12}px,
      ${pointer.y * 12}px,
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
      {/* Background */}
      {/* ========================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-[30%]
            h-[600px]
            w-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/[0.045]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-220px]
            top-[12%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/[0.025]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            bottom-[-220px]
            left-[-220px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[150px]
          "
        />

        <div className="hero-grid absolute inset-0 opacity-30" />

        {/* Fine radial vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,#05070a_85%)]
          "
        />
      </div>

      {/* ========================================= */}
      {/* Top cinematic line */}
      {/* ========================================= */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-20
          h-px
          bg-gradient-to-r
          from-transparent
          via-blue-400/30
          to-transparent
        "
      />

      {/* ========================================= */}
      {/* Main */}
      {/* ========================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          min-h-screen
          max-w-7xl
          px-6
          pb-20
          pt-32
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
            lg:gap-4
          "
        >
          {/* ========================================= */}
          {/* Left Content */}
          {/* ========================================= */}

          <div className="relative z-20 max-w-3xl">
            {/* Eyebrow */}

            <div
              className="
                hero-fade-up
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/[0.09]
                bg-white/[0.025]
                px-3.5
                py-2
                backdrop-blur-md
              "
            >
              <span
                className="
                  relative
                  flex
                  h-2
                  w-2
                  rounded-full
                  bg-blue-400
                  shadow-[0_0_16px_rgba(96,165,250,0.9)]
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    animate-ping
                    rounded-full
                    bg-blue-400/60
                  "
                />
              </span>

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-white/50
                "
              >
                AI Powered Interview Platform
              </span>
            </div>

            {/* Heading */}

            <h1
              className="
                hero-fade-up
                hero-fade-up-delay-1
                mt-8
                max-w-4xl
                text-[clamp(3.4rem,8vw,7.5rem)]
                font-semibold
                leading-[0.86]
                tracking-[-0.07em]
              "
            >
              <span className="block">
                Master the
              </span>

              <span className="block text-white">
                AI Engineering
              </span>

              <span
                className="
                  block
                  bg-gradient-to-r
                  from-blue-200
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
                hero-fade-up
                hero-fade-up-delay-2
                mt-8
                max-w-xl
                text-[15px]
                leading-7
                text-white/45
                sm:text-[17px]
                sm:leading-8
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
                hero-fade-up
                hero-fade-up-delay-3
                mt-9
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <Link
                to="/candidate"
                className="
                  group
                  relative
                  inline-flex
                  min-h-14
                  items-center
                  justify-center
                  gap-2.5
                  overflow-hidden
                  rounded-xl
                  border
                  border-blue-300/20
                  bg-blue-500
                  px-7
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_15px_50px_rgba(37,99,235,0.20)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-blue-400
                  hover:shadow-[0_20px_60px_rgba(37,99,235,0.32)]
                "
              >
                <span className="relative z-10">
                  Start Interview
                </span>

                <ArrowUpRight
                  size={17}
                  className="
                    relative
                    z-10
                    transition-transform
                    duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                />

                <span
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    skew-x-[-20deg]
                    bg-white/[0.12]
                    transition-transform
                    duration-500
                    group-hover:translate-x-full
                  "
                />
              </Link>

              <a
                href="#features"
                className="
                  group
                  inline-flex
                  min-h-14
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.10]
                  bg-white/[0.02]
                  px-7
                  text-sm
                  font-medium
                  text-white/60
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-white/[0.17]
                  hover:bg-white/[0.045]
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

            {/* System capabilities */}

            <div
              className="
                hero-fade-up
                hero-fade-up-delay-4
                mt-12
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-3
              "
            >
              <div className="flex items-center gap-2">
                <BrainCircuit
                  size={14}
                  strokeWidth={1.4}
                  className="text-blue-400/70"
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.19em]
                    text-white/30
                  "
                >
                  Adaptive AI
                </span>
              </div>

              <span className="h-3 w-px bg-white/10" />

              <div className="flex items-center gap-2">
                <Database
                  size={13}
                  strokeWidth={1.4}
                  className="text-blue-400/70"
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.19em]
                    text-white/30
                  "
                >
                  Interview Memory
                </span>
              </div>

              <span className="h-3 w-px bg-white/10" />

              <div className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  strokeWidth={1.4}
                  className="text-blue-400/70"
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.19em]
                    text-white/30
                  "
                >
                  AI Evaluation
                </span>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* 3D Visual */}
          {/* ========================================= */}

          <div
            className="
              relative
              flex
              min-h-[430px]
              items-center
              justify-center
              lg:min-h-[650px]
            "
          >
            {/* Ambient light */}

            <div
              className="
                absolute
                h-[340px]
                w-[340px]
                rounded-full
                bg-blue-500/[0.04]
                blur-[100px]
                sm:h-[500px]
                sm:w-[500px]
              "
            />

            {/* Outer technical circle */}

            <div
              className="
                absolute
                h-[360px]
                w-[360px]
                rounded-full
                border
                border-white/[0.045]
                sm:h-[510px]
                sm:w-[510px]
              "
              style={{
                transform: `
                  translate(
                    ${pointer.x * -5}px,
                    ${pointer.y * -5}px
                  )
                `,
              }}
            />

            {/* Secondary circle */}

            <div
              className="
                absolute
                h-[305px]
                w-[305px]
                rounded-full
                border
                border-blue-400/[0.07]
                sm:h-[440px]
                sm:w-[440px]
              "
              style={{
                transform: `
                  translate(
                    ${pointer.x * 5}px,
                    ${pointer.y * 5}px
                  )
                `,
              }}
            />

            {/* Main 3D core */}

            <div
              className="
                hero-core
                relative
                h-[285px]
                w-[285px]
                sm:h-[390px]
                sm:w-[390px]
              "
              style={{
                transform: coreTransform,
              }}
            >
              {/* Outer rotating ring */}

              <div
                className="
                  hero-ring-slow
                  absolute
                  inset-[3%]
                  rounded-full
                  border
                  border-white/[0.055]
                "
              />

              {/* Main rotating ring */}

              <div
                className="
                  hero-ring
                  absolute
                  inset-[12%]
                  rounded-full
                  border
                  border-blue-400/[0.18]
                "
              />

              {/* Dashed orbital ring */}

              <div
                className="
                  hero-ring-reverse
                  absolute
                  inset-[21%]
                  rounded-full
                  border
                  border-dashed
                  border-blue-300/[0.12]
                "
              />

              {/* Inner ring */}

              <div
                className="
                  absolute
                  inset-[27%]
                  rounded-full
                  border
                  border-white/[0.07]
                "
              />

              {/* Central glass core */}

              <div
                className="
                  absolute
                  inset-[31%]
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-blue-300/20
                  bg-[#08101a]/85
                  shadow-[0_0_100px_rgba(37,99,235,0.13),inset_0_0_50px_rgba(96,165,250,0.06)]
                  backdrop-blur-2xl
                "
                style={{
                  transform: innerTransform,
                }}
              >
                {/* Inner light */}

                <div
                  className="
                    absolute
                    inset-[12%]
                    rounded-full
                    border
                    border-blue-300/10
                    shadow-[inset_0_0_25px_rgba(96,165,250,0.05)]
                  "
                />

                {/* Core icon */}

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
                    shadow-[0_0_40px_rgba(59,130,246,0.16)]
                  "
                >
                  <BrainCircuit
                    size={31}
                    strokeWidth={1.25}
                    className="
                      hero-brain-pulse
                      text-blue-300
                    "
                  />
                </div>
              </div>

              {/* Orbiting light */}

              <span
                className="
                  hero-orbit-dot
                  absolute
                  left-1/2
                  top-[1%]
                  h-2
                  w-2
                  -translate-x-1/2
                  rounded-full
                  bg-blue-300
                  shadow-[0_0_22px_rgba(147,197,253,1)]
                "
              />

              {/* Second orbiting light */}

              <span
                className="
                  hero-orbit-dot-reverse
                  absolute
                  bottom-[12%]
                  right-[8%]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-white/70
                  shadow-[0_0_16px_rgba(255,255,255,0.8)]
                "
              />

              {/* Data nodes */}

              <span
                className="
                  hero-data-1
                  absolute
                  left-[9%]
                  top-[29%]
                  h-1
                  w-1
                  rounded-full
                  bg-blue-300/70
                "
              />

              <span
                className="
                  hero-data-2
                  absolute
                  right-[11%]
                  top-[42%]
                  h-1
                  w-1
                  rounded-full
                  bg-blue-300/60
                "
              />

              <span
                className="
                  hero-data-3
                  absolute
                  bottom-[12%]
                  left-[25%]
                  h-1
                  w-1
                  rounded-full
                  bg-white/40
                "
              />

              {/* Crosshair */}

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

              {/* Small technical marks */}

              <span className="absolute left-[18%] top-[18%] h-2 w-px rotate-45 bg-blue-300/20" />

              <span className="absolute right-[18%] bottom-[18%] h-2 w-px -rotate-45 bg-blue-300/20" />
            </div>

            {/* ========================================= */}
            {/* Floating Data Cards */}
            {/* ========================================= */}

            <div
              className="
                hero-float-a
                absolute
                left-[1%]
                top-[18%]
                hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#080c12]/80
                px-4
                py-3
                backdrop-blur-xl
                sm:block
              "
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Adaptive
                </span>
              </div>

              <p className="mt-2 text-xs text-white/70">
                Question engine
              </p>
            </div>

            <div
              className="
                hero-float-b
                absolute
                right-[0%]
                top-[29%]
                hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#080c12]/80
                px-4
                py-3
                backdrop-blur-xl
                sm:block
              "
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Live
                </span>
              </div>

              <p className="mt-2 text-xs text-white/70">
                AI evaluation
              </p>
            </div>

            <div
              className="
                hero-float-c
                absolute
                bottom-[14%]
                left-[6%]
                hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#080c12]/80
                px-4
                py-3
                backdrop-blur-xl
                sm:block
              "
            >
              <div className="flex items-center gap-2">
                <Activity
                  size={11}
                  className="text-blue-400/60"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Context
                </span>
              </div>

              <p className="mt-2 text-xs text-white/65">
                Interview memory
              </p>
            </div>

            {/* Technical label */}

            <div
              className="
                absolute
                bottom-[5%]
                right-[5%]
                hidden
                items-center
                gap-3
                text-[8px]
                uppercase
                tracking-[0.22em]
                text-white/20
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
      {/* Scroll Indicator */}
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
          text-[8px]
          font-medium
          uppercase
          tracking-[0.28em]
          text-white/20
          transition-colors
          duration-300
          hover:text-white/60
          md:flex
        "
      >
        <span>
          Scroll to explore
        </span>

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
              hero-scroll-dot
              h-1
              w-1
              rounded-full
              bg-blue-300/70
            "
          />
        </span>
      </a>
    </section>
  );
}