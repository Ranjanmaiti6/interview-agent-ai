import WorkflowCard from "./WorkflowCard";

const steps = [
  {
    number: 1,
    title: "Choose Candidate",
    description:
      "Select a candidate profile based on their learning journey.",
  },
  {
    number: 2,
    title: "AI Reads Progress",
    description:
      "The AI analyzes completed modules and learning history.",
  },
  {
    number: 3,
    title: "Adaptive Interview",
    description:
      "Questions change based on previous answers and confidence.",
  },
  {
    number: 4,
    title: "Feedback Report",
    description:
      "Receive strengths, weaknesses and learning suggestions.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="bg-slate-950 py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl text-white font-black text-center">
          How It Works
        </h2>

        <p className="text-slate-400 text-center mt-4 max-w-2xl mx-auto">
          Experience a complete AI-powered interview process from candidate
          selection to personalized feedback.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step) => (
            <WorkflowCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}