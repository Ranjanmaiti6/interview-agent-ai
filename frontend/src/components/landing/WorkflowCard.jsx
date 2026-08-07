export default function WorkflowCard({
  step,
  title,
  description,
}) {
  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300">

      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold mb-5">
        {step}
      </div>

      <h3 className="text-white text-2xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3 leading-7">
        {description}
      </p>
    </div>
  );
}