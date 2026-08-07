import CapabilityCard from "./CapabilityCard";

const capabilities = [
  {
    title: "Adaptive Difficulty",
    description:
      "Questions become easier or harder based on candidate responses.",
    color: "border-blue-500 bg-blue-500/10",
  },
  {
    title: "Knowledge Graph",
    description:
      "Tracks concept mastery and identifies learning gaps.",
    color: "border-purple-500 bg-purple-500/10",
  },
  {
    title: "Confidence Detection",
    description:
      "Detects hesitation and asks targeted follow-up questions.",
    color: "border-green-500 bg-green-500/10",
  },
  {
    title: "Skill Radar",
    description:
      "Visualizes strengths and weaknesses across AI topics.",
    color: "border-orange-500 bg-orange-500/10",
  },
  {
    title: "Career Roadmap",
    description:
      "Suggests learning paths based on interview performance.",
    color: "border-pink-500 bg-pink-500/10",
  },
  {
    title: "Hiring Prediction",
    description:
      "Provides a readiness score and hiring recommendation.",
    color: "border-cyan-500 bg-cyan-500/10",
  },
]; 
export default function Capabilities() {
  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-center text-white">
          AI Capabilities
        </h2>

        <p className="text-slate-400 text-center mt-4 max-w-3xl mx-auto">
          Our AI Interview Agent goes beyond static Q&A by adapting to the
          candidate's knowledge, confidence, and learning journey.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {capabilities.map((item) => (
            <CapabilityCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}