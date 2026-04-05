type TagChipProps = {
  label: string;
};

export function TagChip({ label }: TagChipProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent-strong)] ring-1 ring-inset ring-[var(--border-strong)]/70">
      {label}
    </span>
  );
}
