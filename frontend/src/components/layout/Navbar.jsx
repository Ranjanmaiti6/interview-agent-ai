import { Link } from "react-router-dom";
import { Menu, X, BrainCircuit } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Workflow", href: "#workflow" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white text-xl font-bold"
        >
          <BrainCircuit className="text-blue-500" size={30} />
          InterviewAI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">

          {/* Landing page links */}
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-white transition"
            >
              {item.name}
            </a>
          ))}

          {/* Meetings */}
          <Link
            to="/meetings"
            className="text-gray-300 hover:text-white transition"
          >
            Meetings
          </Link>

          {/* Results */}
          <Link
            to="/report"
            className="text-gray-300 hover:text-white transition"
          >
            Results
          </Link>

          {/* Start Interview */}
          <Link
            to="/candidate"
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg text-white font-semibold"
          >
            Start Interview
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">

          <div className="flex flex-col p-5 gap-5">

            {/* Landing links */}
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}

            {/* Meetings */}
            <Link
              to="/meetings"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              Meetings
            </Link>

            {/* Results */}
            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              Results
            </Link>

            {/* Start Interview */}
            <Link
              to="/candidate"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-center rounded-lg py-3 text-white font-semibold"
            >
              Start Interview
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}