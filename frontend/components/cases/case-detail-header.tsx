import Link from "next/link";

import type { CaseRecord } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagChip } from "@/components/ui/tag-chip";

type CaseDetailHeaderProps = {
  item: CaseRecord;
};

export function CaseDetailHeader({ item }: CaseDetailHeaderProps) {
  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(6,24,44,1),rgba(11,53,88,0.95))] p-7 text-white shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={item.risk_level} kind="risk" />
            <StatusBadge label={item.status} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
              可追溯案例资产
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl">
              {item.title}
            </h1>
            <p className="max-w-4xl text-base leading-7 text-slate-200">{item.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            返回历史查询
          </Link>
          <Link
            href="/cases/new"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            继续录入新案例
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-white/12 pt-6 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-sm text-slate-300">公司</p>
          <p className="mt-1 font-semibold">
            {item.company_name} / {item.company_code}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-300">期间</p>
          <p className="mt-1 font-semibold">
            {item.fiscal_year} / {item.fiscal_period}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-300">科目</p>
          <p className="mt-1 font-semibold">
            {item.account_name} / {item.account_code}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-300">录入人</p>
          <p className="mt-1 font-semibold">{item.created_by}</p>
        </div>
      </div>
    </div>
  );
}
