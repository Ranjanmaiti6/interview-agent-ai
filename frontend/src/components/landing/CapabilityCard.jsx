import { ArrowRight } from "lucide-react";

export default function CapabilityCard({
  icon: Icon,
  title,
  description,
  color,
}) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500 transition duration-300 hover:-translate-y-2">

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${color}`}
      >
        <Icon size={30} className="text-white" />
      </div>

      <h3 className="text-white text-2xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-4 leading-7">
        {description}
      </p>

      <div className="mt-8 flex items-center gap-2 text-blue-400 font-semibold group-hover:translate-x-2 transition">
        Learn More
        <ArrowRight size={18} />
      </div>
    </div>
  );
}