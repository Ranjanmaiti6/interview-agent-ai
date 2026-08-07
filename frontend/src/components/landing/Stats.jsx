import { Users, Brain, CheckCircle, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    title: "Mock Interviews",
  },
  {
    icon: Brain,
    value: "31",
    title: "AI Cohort Topics",
  },
  {
    icon: CheckCircle,
    value: "95%",
    title: "Adaptive Questions",
  },
  {
    icon: Clock,
    value: "24/7",
    title: "Available",
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-black text-white text-center">
          Trusted AI Interview Experience
        </h2>

        <p className="text-slate-400 text-center mt-4">
          Everything you need to prepare for AI Engineering interviews.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center hover:border-blue-500 transition"
              >
                <Icon
                  className="mx-auto text-blue-500"
                  size={42}
                />

                <h3 className="text-4xl font-black text-white mt-6">
                  {stat.value}
                </h3>

                <p className="text-slate-400 mt-3">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}