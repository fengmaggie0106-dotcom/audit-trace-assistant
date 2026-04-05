import type { CaseRecord } from "@/lib/types";
import { SectionCard } from "@/components/ui/section-card";
import { TagChip } from "@/components/ui/tag-chip";

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
    <div className="space-y-5">
      <SectionCard title="元数据" description="用于筛选、复核和持续沉淀的结构化索引。">
        <dl>
          <MetadataRow label="公司" value={`${item.company_name} / ${item.company_code}`} />
          <MetadataRow label="年度 / 期间" value={`${item.fiscal_year} / ${item.fiscal_period}`} />
          <MetadataRow label="科目" value={`${item.account_name} / ${item.account_code}`} />
          <MetadataRow label="问题类型" value={item.issue_type} />
          <MetadataRow
            label="凭证或资料编号"
            value={item.voucher_reference || "未录入"}
          />
          <MetadataRow label="录入人" value={item.created_by} />
          <MetadataRow label="数据来源" value={item.source_type} />
        </dl>
      </SectionCard>

      <SectionCard title="标签与资料" description="支持跨年度、跨人员、跨项目追溯。">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
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
    </div>
  );
}
