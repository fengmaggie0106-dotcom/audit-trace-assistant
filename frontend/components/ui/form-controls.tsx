import type { ReactNode } from "react";

export const controlClassName =
  "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[color:rgba(37,95,84,0.10)]";

export const textareaControlClassName = `${controlClassName} min-h-[148px] resize-y`;

type FieldBlockProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldBlock({ label, hint, children }: FieldBlockProps) {
  return (
    <label className="block space-y-2">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
        {hint ? <p className="text-xs leading-5 text-[var(--muted-foreground)]">{hint}</p> : null}
      </div>
      {children}
    </label>
  );
}
