import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-[var(--panel-subtle)] px-6 py-12 text-center">
      <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
