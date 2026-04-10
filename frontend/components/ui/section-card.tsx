import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  tone?: "default" | "muted";
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  actions,
  tone = "default",
  children,
}: SectionCardProps) {
  const toneClassName =
    tone === "muted"
      ? "bg-[var(--panel-subtle)]"
      : "bg-[var(--panel)] shadow-[var(--shadow-card)]";

  return (
    <section className={`rounded-[20px] border border-[var(--border)] p-6 ${toneClassName}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
