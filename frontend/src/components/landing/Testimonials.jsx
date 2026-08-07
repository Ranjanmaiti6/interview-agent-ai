import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "AI Cohort Student",
    image: "https://i.pravatar.cc/150?img=11",
    review:
      "The follow-up questions felt incredibly realistic. It challenged my understanding instead of asking memorized questions.",
  },
  {
    name: "Priya Verma",
    role: "Software Engineer",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "The skill radar helped me identify weak areas in RAG and Prompt Engineering. Much better than ordinary mock interview platforms.",
  },
  {
    name: "Rahul Patel",
    role: "ML Enthusiast",
    image: "https://i.pravatar.cc/150?img=15",
    review:
      "The AI adapted every question based on my answers. It actually felt like talking to a senior interviewer.",
  },
];
export default function Testimonials() {
  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center">
          <p className="uppercase tracking-widest text-blue-400 font-semibold">
            Testimonials
          </p>

          <h2 className="text-5xl font-black text-white mt-3">
            Loved by Future AI Engineers
          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
            Students use InterviewAI to practice adaptive technical interviews,
            improve communication, and prepare for real hiring rounds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {testimonials.map((user) => (
            <div
              key={user.name}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-slate-300 mt-6 leading-8">
                "{user.review}"
              </p>

              <div className="flex items-center gap-4 mt-8">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-14 h-14 rounded-full border-2 border-blue-500"
                />

                <div>
                  <h4 className="text-white font-bold">
                    {user.name}
                  </h4>

                  <p className="text-slate-400 text-sm">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}