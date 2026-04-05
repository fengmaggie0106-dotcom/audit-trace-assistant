type StatCardProps = {
  label: string;
  value: string | number;
  helper: string;
  tone?: "default" | "critical" | "positive" | "accent";
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "from-slate-950 to-slate-900 text-white",
  critical: "from-rose-700 to-rose-600 text-white",
  positive: "from-emerald-700 to-emerald-600 text-white",
  accent: "from-cyan-700 to-sky-700 text-white",
};

export function StatCard({
  label,
  value,
  helper,
  tone = "default",
}: StatCardProps) {
  return (
    <div
      className={`rounded-[24px] bg-gradient-to-br p-5 shadow-[var(--shadow-card)] ${toneClasses[tone]}`}
    >
      <p className="text-sm font-medium text-white/78">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-3 text-sm text-white/80">{helper}</p>
    </div>
  );
}
