export default function ScoreCard({ title, value }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <p className="text-slate-400 text-sm uppercase tracking-wider">
        {title}
      </p>

      <h2 className="text-5xl font-black text-white mt-4">
        {value}%
      </h2>

      <div className="w-full bg-slate-800 rounded-full h-3 mt-6">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>

    </div>
  );
}