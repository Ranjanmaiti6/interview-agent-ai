import { Link } from "react-router-dom";
import {
  Menu,
  X,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Workflow", href: "#workflow" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleAnchorClick = () => {
    closeMenu();
  };

  return (
    <>
      <nav
        className={`
          fixed
          left-0
          right-0
          top-0
          z-50
          px-3
          sm:px-5
          transition-all
          duration-500
          ${scrolled ? "pt-3" : "pt-5"}
        `}
      >
        <div
          className={`
            relative
            flex
            h-[66px]
            items-center
            justify-between
            overflow-hidden
            border
            px-3
            sm:px-5
            transition-all
            duration-500
            ${
              scrolled
                ? "rounded-2xl border-white/[0.11] bg-[#07090d]/90 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                : "rounded-2xl border-white/[0.07] bg-[#07090d]/55 backdrop-blur-xl"
            }
          `}
        >
          {/* Ambient navbar light */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-px
              w-1/2
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-blue-400/30
              to-transparent
            "
          />

          {/* ========================================= */}
          {/* Brand */}
          {/* ========================================= */}

          <Link
            to="/"
            onClick={closeMenu}
            className="
              group
              relative
              z-10
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            <span
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-white/[0.10]
                bg-white/[0.035]
                transition-all
                duration-500
                group-hover:border-blue-400/30
                group-hover:bg-blue-500/[0.06]
              "
            >
              <span
                className="
                  absolute
                  inset-0
                  bg-blue-500/[0.08]
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              <span
                className="
                  absolute
                  left-1/2
                  top-0
                  h-px
                  w-0
                  -translate-x-1/2
                  bg-blue-300
                  transition-all
                  duration-500
                  group-hover:w-1/2
                "
              />

              <BrainCircuit
                size={21}
                strokeWidth={1.5}
                className="
                  relative
                  z-10
                  text-blue-400
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:text-blue-300
                "
              />
            </span>

            <span
              className="
                text-[16px]
                font-semibold
                tracking-[-0.025em]
                text-white
                sm:text-[17px]
              "
            >
              Interview
              <span className="text-blue-400">AI</span>
            </span>
          </Link>

          {/* ========================================= */}
          {/* Desktop Navigation */}
          {/* ========================================= */}

          <div className="hidden items-center md:flex">
            <div
              className="
                flex
                items-center
                gap-0.5
                rounded-xl
                border
                border-white/[0.045]
                bg-white/[0.018]
                p-1
              "
            >
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleAnchorClick}
                  className="
                    group
                    relative
                    rounded-lg
                    px-4
                    py-2.5
                    text-[12px]
                    font-medium
                    tracking-[0.02em]
                    text-white/45
                    transition-all
                    duration-300
                    hover:bg-white/[0.045]
                    hover:text-white
                  "
                >
                  {item.name}

                  <span
                    className="
                      absolute
                      bottom-1
                      left-1/2
                      h-px
                      w-0
                      -translate-x-1/2
                      bg-blue-400
                      transition-all
                      duration-300
                      group-hover:w-4
                    "
                  />
                </a>
              ))}

              <Link
                to="/meetings"
                className="
                  group
                  relative
                  rounded-lg
                  px-4
                  py-2.5
                  text-[12px]
                  font-medium
                  tracking-[0.02em]
                  text-white/45
                  transition-all
                  duration-300
                  hover:bg-white/[0.045]
                  hover:text-white
                "
              >
                Meetings

                <span
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-px
                    w-0
                    -translate-x-1/2
                    bg-blue-400
                    transition-all
                    duration-300
                    group-hover:w-4
                  "
                />
              </Link>

              <Link
                to="/report"
                className="
                  group
                  relative
                  rounded-lg
                  px-4
                  py-2.5
                  text-[12px]
                  font-medium
                  tracking-[0.02em]
                  text-white/45
                  transition-all
                  duration-300
                  hover:bg-white/[0.045]
                  hover:text-white
                "
              >
                Results

                <span
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-px
                    w-0
                    -translate-x-1/2
                    bg-blue-400
                    transition-all
                    duration-300
                    group-hover:w-4
                  "
                />
              </Link>
            </div>
          </div>

          {/* ========================================= */}
{/* Desktop Actions */}
{/* ========================================= */}

<div className="hidden items-center gap-2 md:flex">

  {/* Login */}

  <Link
    to="/login?role=employee"
    className="
      rounded-lg
      px-3
      py-2.5
      text-[12px]
      font-medium
      tracking-wide
      text-white/45
      transition-colors
      duration-300
      hover:text-white
    "
  >
    Login
  </Link>

  {/* Sign Up */}

  <Link
    to="/signup"
    className="
      rounded-lg
      border
      border-white/[0.08]
      bg-white/[0.025]
      px-3.5
      py-2.5
      text-[12px]
      font-semibold
      tracking-wide
      text-white/65
      transition-all
      duration-300
      hover:border-blue-400/20
      hover:bg-blue-500/[0.06]
      hover:text-white
    "
  >
    Sign Up
  </Link>

  {/* Start Interview */}

  <Link
    to="/candidate"
    className="
      group
      relative
      inline-flex
      items-center
      gap-2
      overflow-hidden
      rounded-xl
      border
      border-blue-300/20
      bg-blue-500
      px-4
      py-2.5
      text-[12px]
      font-semibold
      text-white
      shadow-[0_8px_30px_rgba(37,99,235,0.18)]
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:bg-blue-400
      hover:shadow-[0_12px_42px_rgba(37,99,235,0.30)]
    "
  >
    <span className="relative z-10">
      Start Interview
    </span>

    <ArrowUpRight
      size={14}
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

</div>

          {/* ========================================= */}
          {/* Mobile Button */}
          {/* ========================================= */}

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="
              relative
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.09]
              bg-white/[0.035]
              text-white
              transition-all
              duration-300
              hover:border-white/[0.16]
              hover:bg-white/[0.07]
              md:hidden
            "
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* ========================================= */}
        {/* Mobile Navigation */}
        {/* ========================================= */}

        <div
          className={`
            overflow-hidden
            transition-all
            duration-500
            md:hidden
            ${
              isOpen
                ? "mt-2 max-h-[650px] opacity-100"
                : "mt-0 max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.09]
              bg-[#07090d]/95
              p-2
              shadow-[0_25px_90px_rgba(0,0,0,0.55)]
              backdrop-blur-2xl
            "
          >
            <div className="px-3 pb-2 pt-3">
              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/20
                "
              >
                Navigation
              </span>
            </div>

            {/* Mobile Anchor Links */}

            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleAnchorClick}
                className="
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  text-white/55
                  transition-all
                  duration-300
                  hover:bg-white/[0.045]
                  hover:text-white
                "
              >
                {item.name}
              </a>
            ))}

            {/* Meetings */}

            <Link
              to="/meetings"
              onClick={closeMenu}
              className="
                flex
                items-center
                rounded-xl
                px-4
                py-3.5
                text-sm
                text-white/55
                transition-all
                duration-300
                hover:bg-white/[0.045]
                hover:text-white
              "
            >
              Meetings
            </Link>

            {/* Results */}

            <Link
              to="/report"
              onClick={closeMenu}
              className="
                flex
                items-center
                rounded-xl
                px-4
                py-3.5
                text-sm
                text-white/55
                transition-all
                duration-300
                hover:bg-white/[0.045]
                hover:text-white
              "
            >
              Results
            </Link>

            <div className="my-2 h-px bg-white/[0.07]" />

            {/* Mobile Login */}

            <Link
              to="/login?role=employee"
              onClick={closeMenu}
              className="
                flex
                items-center
                rounded-xl
                px-4
                py-3.5
                text-sm
                text-white/55
                transition-all
                duration-300
                hover:bg-white/[0.045]
                hover:text-white
              "
            >
              Login
            </Link>
            <Link
  to="/signup"
  onClick={closeMenu}
  className="
    flex
    items-center
    rounded-xl
    px-4
    py-3.5
    text-sm
    text-white/55
    transition-all
    duration-300
    hover:bg-white/[0.045]
    hover:text-white
  "
>
  Sign Up
</Link>

            {/* Mobile Sign Up */}

            <Link
              to="/signup"
              onClick={closeMenu}
              className="
                mt-1
                flex
                items-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                py-3.5
                text-sm
                text-white/70
                transition-all
                duration-300
                hover:border-blue-400/30
                hover:bg-blue-500/[0.08]
                hover:text-white
              "
            >
              Sign Up
            </Link>

            {/* Mobile Start Interview */}

            <Link
              to="/candidate"
              onClick={closeMenu}
              className="
                group
                mt-2
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-500
                px-4
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_35px_rgba(37,99,235,0.18)]
                transition-all
                duration-300
                hover:bg-blue-400
              "
            >
              Start Interview

              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}