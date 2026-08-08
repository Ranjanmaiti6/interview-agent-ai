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
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        ${
          scrolled
            ? "pt-3"
            : "pt-5"
        }
      `}
    >
      <div
        className={`
          mx-auto
          max-w-7xl
          px-4 sm:px-6
          transition-all duration-500
        `}
      >
        <div
          className={`
            flex items-center justify-between
            h-[68px]
            px-4 sm:px-5
            rounded-2xl
            border
            transition-all duration-500
            ${
              scrolled
                ? "bg-[#090b0f]/90 border-white/[0.10] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                : "bg-[#090b0f]/55 border-white/[0.07] backdrop-blur-xl"
            }
          `}
        >
          {/* ========================================= */}
          {/* Brand */}
          {/* ========================================= */}

          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-3 shrink-0"
          >
            <span
              className="
                relative
                flex items-center justify-center
                w-10 h-10
                rounded-xl
                border border-white/10
                bg-white/[0.045]
                overflow-hidden
              "
            >
              <span
                className="
                  absolute inset-0
                  bg-blue-500/10
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-500
                "
              />

              <BrainCircuit
                size={22}
                strokeWidth={1.7}
                className="
                  relative z-10
                  text-blue-400
                  group-hover:text-blue-300
                  group-hover:scale-110
                  transition-all duration-300
                "
              />
            </span>

            <span className="text-white font-semibold tracking-[-0.02em] text-[17px]">
              Interview
              <span className="text-blue-400">
                AI
              </span>
            </span>
          </Link>

          {/* ========================================= */}
          {/* Desktop Navigation */}
          {/* ========================================= */}

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="
                  group
                  relative
                  px-4 py-2
                  text-[13px]
                  text-white/55
                  hover:text-white
                  tracking-wide
                  transition-colors duration-300
                "
              >
                {item.name}

                <span
                  className="
                    absolute
                    left-4 right-4 bottom-0
                    h-px
                    bg-blue-400
                    scale-x-0
                    origin-left
                    group-hover:scale-x-100
                    transition-transform duration-300
                  "
                />
              </a>
            ))}

            <Link
              to="/meetings"
              className="
                group
                relative
                px-4 py-2
                text-[13px]
                text-white/55
                hover:text-white
                tracking-wide
                transition-colors duration-300
              "
            >
              Meetings

              <span
                className="
                  absolute
                  left-4 right-4 bottom-0
                  h-px
                  bg-blue-400
                  scale-x-0
                  origin-left
                  group-hover:scale-x-100
                  transition-transform duration-300
                "
              />
            </Link>

            <Link
              to="/report"
              className="
                group
                relative
                px-4 py-2
                text-[13px]
                text-white/55
                hover:text-white
                tracking-wide
                transition-colors duration-300
              "
            >
              Results

              <span
                className="
                  absolute
                  left-4 right-4 bottom-0
                  h-px
                  bg-blue-400
                  scale-x-0
                  origin-left
                  group-hover:scale-x-100
                  transition-transform duration-300
                "
              />
            </Link>
          </div>

          {/* ========================================= */}
          {/* Desktop Actions */}
          {/* ========================================= */}

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login?role=employee"
              className="
                px-4 py-2
                text-[13px]
                font-medium
                text-white/65
                hover:text-white
                transition-colors duration-300
              "
            >
              Login
            </Link>

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
                border border-blue-400/30
                bg-blue-500
                px-4 py-2.5
                text-[13px]
                font-semibold
                text-white
                shadow-[0_8px_30px_rgba(37,99,235,0.20)]
                transition-all duration-300
                hover:bg-blue-400
                hover:shadow-[0_10px_38px_rgba(37,99,235,0.32)]
                hover:-translate-y-0.5
              "
            >
              <span className="relative z-10">
                Start Interview
              </span>

              <ArrowUpRight
                size={15}
                className="
                  relative z-10
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-white/10
                  skew-x-[-20deg]
                  transition-transform duration-500
                  group-hover:translate-x-full
                "
              />
            </Link>
          </div>

          {/* ========================================= */}
          {/* Mobile Menu Button */}
          {/* ========================================= */}

          <button
            type="button"
            onClick={() =>
              setIsOpen((value) => !value)
            }
            className="
              md:hidden
              flex items-center justify-center
              w-10 h-10
              rounded-xl
              border border-white/10
              bg-white/[0.04]
              text-white
              hover:bg-white/[0.08]
              transition-all duration-300
            "
            aria-label={
              isOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {/* ========================================= */}
        {/* Mobile Navigation */}
        {/* ========================================= */}

        <div
          className={`
            md:hidden
            overflow-hidden
            transition-all duration-500
            ${
              isOpen
                ? "max-h-[520px] opacity-100 mt-2"
                : "max-h-0 opacity-0 mt-0"
            }
          `}
        >
          <div
            className="
              rounded-2xl
              border border-white/[0.08]
              bg-[#090b0f]/95
              backdrop-blur-2xl
              p-3
              shadow-[0_24px_80px_rgba(0,0,0,0.45)]
            "
          >
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="
                  flex items-center
                  px-4 py-3.5
                  rounded-xl
                  text-sm
                  text-white/65
                  hover:text-white
                  hover:bg-white/[0.045]
                  transition-all duration-300
                "
              >
                {item.name}
              </a>
            ))}

            <Link
              to="/meetings"
              onClick={closeMenu}
              className="
                flex items-center
                px-4 py-3.5
                rounded-xl
                text-sm
                text-white/65
                hover:text-white
                hover:bg-white/[0.045]
                transition-all duration-300
              "
            >
              Meetings
            </Link>

            <Link
              to="/report"
              onClick={closeMenu}
              className="
                flex items-center
                px-4 py-3.5
                rounded-xl
                text-sm
                text-white/65
                hover:text-white
                hover:bg-white/[0.045]
                transition-all duration-300
              "
            >
              Results
            </Link>

            <div className="my-2 h-px bg-white/[0.07]" />

            <Link
              to="/login?role=employee"
              onClick={closeMenu}
              className="
                flex items-center
                px-4 py-3.5
                rounded-xl
                text-sm
                text-white/65
                hover:text-white
                hover:bg-white/[0.045]
                transition-all duration-300
              "
            >
              Login
            </Link>

            <Link
              to="/candidate"
              onClick={closeMenu}
              className="
                flex items-center justify-center
                gap-2
                mt-2
                rounded-xl
                bg-blue-500
                px-4 py-3.5
                text-sm
                font-semibold
                text-white
                transition-all duration-300
                hover:bg-blue-400
              "
            >
              Start Interview

              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}