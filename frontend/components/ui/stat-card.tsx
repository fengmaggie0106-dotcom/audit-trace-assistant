type StatCardProps = {
  label: string;
  value: string | number;
  helper: string;
  tone?: "default" | "critical" | "positive" | "accent";
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "border-l-[var(--foreground)] bg-white",
  critical: "border-l-rose-600 bg-rose-50/80",
  positive: "border-l-emerald-600 bg-emerald-50/80",
  accent: "border-l-[var(--accent-strong)] bg-[var(--accent-soft)]",
};

export function StatCard({
  label,
  value,
  helper,
  tone = "default",
}: StatCardProps) {
  return (
    <div
      className={`rounded-[18px] border border-[var(--border)] border-l-4 p-5 shadow-[var(--shadow-card)] ${toneClasses[tone]}`}
    >
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{helper}</p>
    </div>
  );
}
