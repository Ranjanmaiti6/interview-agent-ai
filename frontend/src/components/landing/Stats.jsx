const stats = [
  { number: "31", label: "AI Cohort Days" },
  { number: "8", label: "Learning Modules" },
  { number: "20+", label: "Candidate Profiles" },
  { number: "100%", label: "Adaptive Interview" },
];

export default function Stats() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="text-center rounded-2xl border border-slate-800 bg-slate-950 p-8"
          >
            <h2 className="text-5xl font-black text-blue-500">
              {item.number}
            </h2>

            <p className="text-slate-400 mt-3">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}