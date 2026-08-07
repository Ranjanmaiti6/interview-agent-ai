export default function WorkflowCard({ number, title, description }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {number}
      </div>

      <h3 className="text-white text-xl font-bold mt-5">
        {title}
      </h3>

      <p className="text-slate-400 mt-3">
        {description}
      </p>
    </div>
  );
}