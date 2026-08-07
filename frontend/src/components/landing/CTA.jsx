import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-violet-700 py-28">
      <div className="max-w-4xl mx-auto text-center px-6">

        <h2 className="text-5xl font-black text-white">
          Ready for your AI Interview?
        </h2>

        <p className="text-blue-100 mt-6 text-lg">
          Practice adaptive technical interviews based on your learning journey.
        </p>

        <Link
          to="/candidate"
          className="inline-block mt-10 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
        >
          Start Interview
        </Link>

      </div>
    </section>
  );
}