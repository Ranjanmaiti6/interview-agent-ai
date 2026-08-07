import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-12 text-center shadow-2xl">

          <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
            🚀 Ready to Begin?
          </span>

          <h2 className="text-5xl font-black text-white mt-6">
            Your Next AI Interview Starts Here
          </h2>

          <p className="text-blue-100 text-lg max-w-3xl mx-auto mt-6 leading-8">
            Experience an AI interviewer that understands your learning journey,
            asks intelligent follow-up questions, evaluates your technical
            knowledge, and provides detailed personalized feedback.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">
            <Link
              to="/candidate"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
            >
              Start Mock Interview
              <ArrowRight size={20} />
            </Link>

            <a
              href="#features"
              className="border border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition duration-300"
            >
              Explore Features
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            <div>
              <h3 className="text-3xl font-black text-white">8+</h3>
              <p className="text-blue-100 mt-2">
                Adaptive Interview Questions
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white">31</h3>
              <p className="text-blue-100 mt-2">
                AI Cohort Topics Covered
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white">100%</h3>
              <p className="text-blue-100 mt-2">
                Personalized Feedback Report
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
} 