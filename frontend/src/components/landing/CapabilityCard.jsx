export default function CapabilityCard({
  title,
  description,
  color,
}) {
  return (
    <div
      className={`rounded-2xl p-6 border ${color} hover:scale-105 transition-all duration-300`}
    >
      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="text-slate-300 mt-3">
        {description}
      </p>
    </div>
  );
}