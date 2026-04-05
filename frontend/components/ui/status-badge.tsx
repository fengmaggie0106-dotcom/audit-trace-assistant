type StatusBadgeProps = {
  label: string;
  kind?: "risk" | "status";
};

const riskStyles: Record<string, string> = {
  高: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  中: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  低: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

const statusStyles: Record<string, string> = {
  已确认: "bg-cyan-50 text-cyan-800 ring-1 ring-inset ring-cyan-200",
  待审核: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

export function StatusBadge({ label, kind = "status" }: StatusBadgeProps) {
  const className =
    kind === "risk"
      ? riskStyles[label] || "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200"
      : statusStyles[label] ||
        "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}
