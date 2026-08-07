import WorkflowCard from "./WorkflowCard";

const workflow = [
  {
    step: "01",
    title: "Choose Candidate",
    description:
      "Select a candidate profile from the AI Cohort dataset to begin a personalized interview.",
  },
  {
    step: "02",
    title: "AI Analyzes Progress",
    description:
      "The system reviews completed missions, skipped topics, attempts, and learning signals.",
  },
  {
    step: "03",
    title: "Adaptive Interview",
    description:
      "The AI asks technical questions and generates intelligent follow-up questions based on each answer.",
  },
  {
    step: "04",
    title: "Interview Report",
    description:
      "Receive strengths, knowledge gaps, hiring recommendation, and a personalized learning roadmap.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="bg-slate-900 py-28 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <p className="text-blue-400 uppercase tracking-widest font-semibold">
          Workflow
        </p>

        <h2 className="text-5xl font-black text-white mt-3">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {workflow.map((item) => (
            <WorkflowCard key={item.step} {...item} />
          ))}
        </div>

      </div>
    </section>
  );
}