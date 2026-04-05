import Link from "next/link";

import type { CaseRecord } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagChip } from "@/components/ui/tag-chip";

type CaseResultsTableProps = {
  cases: CaseRecord[];
};

export function CaseResultsTable({ cases }: CaseResultsTableProps) {
  if (!cases.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center text-sm text-[var(--muted-foreground)]">
        当前筛选条件下没有命中案例。建议先放宽关键词，或从公司与科目切入后继续追溯。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--border)] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-[var(--panel-subtle)]">
            <tr className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              <th className="px-5 py-4 font-semibold">案例主题</th>
              <th className="px-5 py-4 font-semibold">公司 / 年度</th>
              <th className="px-5 py-4 font-semibold">科目 / 类型</th>
              <th className="px-5 py-4 font-semibold">标签</th>
              <th className="px-5 py-4 font-semibold">风险 / 状态</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((item) => (
              <tr key={item.id} className="border-t border-[var(--border)] align-top">
                <td className="px-5 py-4">
                  <div className="space-y-2">
                    <Link
                      href={`/cases/${item.id}`}
                      className="text-base font-semibold text-[var(--foreground)] transition hover:text-[var(--accent-strong)]"
                    >
                      {item.title}
                    </Link>
                    <p className="max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                      {item.summary}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)]">{item.company_name}</p>
                  <p className="mt-1">
                    {item.company_code} / {item.fiscal_year}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)]">{item.account_name}</p>
                  <p className="mt-1">
                    {item.account_code} / {item.issue_type}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex max-w-xs flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <TagChip key={tag} label={tag} />
                    ))}
                  </div>
                </td>
                <td className="space-y-2 px-5 py-4">
                  <div>
                    <StatusBadge label={item.risk_level} kind="risk" />
                  </div>
                  <div>
                    <StatusBadge label={item.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
