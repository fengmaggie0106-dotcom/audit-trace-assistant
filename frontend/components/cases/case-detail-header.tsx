import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { TagChip } from "@/components/ui/tag-chip";
import type { CaseRecord } from "@/lib/types";

type CaseDetailHeaderProps = {
  item: CaseRecord;
};

export function CaseDetailHeader({ item }: CaseDetailHeaderProps) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-white p-7 shadow-[var(--shadow-card)]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          <Link href="/search" className="transition hover:text-[var(--accent-strong)]">
            案例库
          </Link>
          <span>/</span>
          <span>案例详情</span>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={item.risk_level} kind="risk" />
              <StatusBadge label={item.status} />
              <TagChip label={item.issue_type} />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Audit case document
              </p>
              <h1
                className="max-w-4xl text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl"
                style={{ fontFamily: '"Iowan Old Style", "Noto Serif SC", "Songti SC", serif' }}
              >
                {item.title}
              </h1>
              <p className="max-w-4xl text-base leading-7 text-[var(--muted-foreground)]">
                {item.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-[var(--border)] bg-[var(--panel-subtle)] px-3 py-2 text-sm text-[var(--foreground)]">
                {item.company_name} / {item.company_code}
              </div>
              <div className="rounded-full border border-[var(--border)] bg-[var(--panel-subtle)] px-3 py-2 text-sm text-[var(--foreground)]">
                {item.fiscal_year} / {item.fiscal_period}
              </div>
              <div className="rounded-full border border-[var(--border)] bg-[var(--panel-subtle)] px-3 py-2 text-sm text-[var(--foreground)]">
                {item.account_name} / {item.account_code}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
            >
              返回案例库
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
            >
              查看风险洞察
            </Link>
            <Link
              href="/ai"
              className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              交给助手分析
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
