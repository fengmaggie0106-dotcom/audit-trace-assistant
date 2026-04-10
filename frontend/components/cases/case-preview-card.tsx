import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { TagChip } from "@/components/ui/tag-chip";

type CasePreviewCardProps = {
  href: string;
  title: string;
  meta: string;
  summary: string;
  issueType?: string;
  riskLevel?: string;
  tags?: string[];
};

export function CasePreviewCard({
  href,
  title,
  meta,
  summary,
  issueType,
  riskLevel,
  tags = [],
}: CasePreviewCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-[18px] border border-[var(--border)] bg-white px-5 py-4 transition hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
        {issueType ? <TagChip label={issueType} /> : null}
        {riskLevel ? <StatusBadge label={riskLevel} kind="risk" /> : null}
      </div>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{meta}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground-soft)]">{summary}</p>
      {tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      ) : null}
    </Link>
  );
}
