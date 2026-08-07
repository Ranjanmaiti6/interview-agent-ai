import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen bg-slate-950 text-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20">

        <p className="text-blue-400 font-semibold uppercase tracking-wider">
          AI Powered Interview Platform
        </p>

        <h1 className="text-6xl font-black mt-4 leading-tight">
          Master
          <span className="text-blue-500"> AI Engineering </span>
          Interviews
        </h1>

        <p className="text-gray-400 text-xl mt-6 max-w-2xl">
          Experience adaptive technical interviews that analyze your learning
          journey, ask intelligent follow-up questions, and generate
          personalized feedback.
        </p>

        <div className="flex gap-4 mt-10">
          <Link
            to="/candidate"
            className="bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-xl font-semibold"
          >
            Start Interview
          </Link>

          <a
            href="#features"
            className="border border-gray-700 px-7 py-4 rounded-xl hover:bg-slate-800"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}