import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
          {eyebrow}
        </p>
        <h1
          className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl"
          style={{ fontFamily: '"Iowan Old Style", "Noto Serif SC", "Songti SC", serif' }}
        >
          {title}
        </h1>
        <p className="text-base leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div> : null}
    </div>
  );
}
