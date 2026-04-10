import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagChip } from "@/components/ui/tag-chip";
import type { CaseRecord } from "@/lib/types";

type CaseResultsTableProps = {
  cases: CaseRecord[];
};

export function CaseResultsTable({ cases }: CaseResultsTableProps) {
  if (!cases.length) {
    return (
      <EmptyState
        title="没有命中的案例"
        description="先放宽关键词，或者从公司、年度、科目三个结构字段重新切入。"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-[var(--panel-subtle)]">
            <tr className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              <th className="px-5 py-4 font-semibold">案例文档</th>
              <th className="px-5 py-4 font-semibold">组织索引</th>
              <th className="px-5 py-4 font-semibold">问题归类</th>
              <th className="px-5 py-4 font-semibold">标签</th>
              <th className="px-5 py-4 font-semibold">状态</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((item) => (
              <tr
                key={item.id}
                className="border-t border-[var(--border)] align-top transition hover:bg-[var(--panel-subtle)]"
              >
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
                <td className="px-5 py-4 text-sm leading-6 text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)]">{item.company_name}</p>
                  <p>
                    {item.company_code} / {item.fiscal_year} / {item.fiscal_period}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm leading-6 text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)]">{item.account_name}</p>
                  <p>
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
