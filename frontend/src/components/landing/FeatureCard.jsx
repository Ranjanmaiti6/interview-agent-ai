import { ArrowUpRight } from "lucide-react";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2">
      <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center mb-5">
        <Icon className="text-blue-400" size={28} />
      </div>

      <h3 className="text-white text-xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3 leading-7">
        {description}
      </p>

      <ArrowUpRight
        className="mt-6 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition"
        size={20}
      />
    </div>
  );
}