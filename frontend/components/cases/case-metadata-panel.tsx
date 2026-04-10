import Link from "next/link";

import { SectionCard } from "@/components/ui/section-card";
import { TagChip } from "@/components/ui/tag-chip";
import type { CaseRecord } from "@/lib/types";

type CaseMetadataPanelProps = {
  item: CaseRecord;
};

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] py-3 last:border-b-0">
      <dt className="text-sm font-medium text-[var(--muted-foreground)]">{label}</dt>
      <dd className="text-right text-sm font-semibold text-[var(--foreground)]">{value}</dd>
    </div>
  );
}

export function CaseMetadataPanel({ item }: CaseMetadataPanelProps) {
  return (
    <div className="space-y-5 xl:sticky xl:top-[96px]">
      <SectionCard title="数据库属性" description="用于筛选、复核和持续沉淀的结构化索引。">
        <dl>
          <MetadataRow label="公司" value={`${item.company_name} / ${item.company_code}`} />
          <MetadataRow label="年度 / 期间" value={`${item.fiscal_year} / ${item.fiscal_period}`} />
          <MetadataRow label="科目" value={`${item.account_name} / ${item.account_code}`} />
          <MetadataRow label="问题类型" value={item.issue_type} />
          <MetadataRow label="凭证 / 资料编号" value={item.voucher_reference || "未录入"} />
          <MetadataRow label="录入人" value={item.created_by} />
          <MetadataRow label="数据来源" value={item.source_type} />
        </dl>
      </SectionCard>

      <SectionCard title="标签与资料" description="这一组信息负责支撑跨人员、跨年度的追溯。">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.length ? (
                item.tags.map((tag) => <TagChip key={tag} label={tag} />)
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">暂无标签。</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">附件与资料链接</p>
            <div className="mt-3 space-y-3">
              {item.attachment_links.length ? (
                item.attachment_links.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-3 text-sm font-medium text-[var(--accent-strong)] transition hover:border-[var(--accent-strong)]"
                  >
                    {link}
                  </a>
                ))
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">暂无附件链接。</p>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="下一步动作" description="把详情页重新连回 workflow。">
        <div className="grid gap-3">
          <Link
            href="/search"
            className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-white"
          >
            返回案例库继续检索
          </Link>
          <Link
            href="/ai"
            className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-white"
          >
            带着这条案例去问助手
          </Link>
          <Link
            href="/cases/new"
            className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-white"
          >
            继续录入新的案例
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
