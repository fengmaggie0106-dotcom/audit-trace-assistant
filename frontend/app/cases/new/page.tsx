import Link from "next/link";

import { CaseForm } from "@/components/cases/case-form";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const workflowNotes = [
  "先补齐结构化索引，保证案例库可检索、可交接。",
  "再写清争议过程和判断依据，确保复核时能看懂为什么这样做。",
  "最后补结论、分录和资料链接，让案例真正成为事务所的可复用资产。",
];

const reuseNotes = [
  "案例库会直接读取这里的结构化字段，支持连续审计客户的历史追溯。",
  "案例详情页会把背景、争议、依据和结论渲染成完整判断链。",
  "风险洞察与助手会使用风险等级、问题类型和标签做复盘与辅助解释。",
];

export default function CaseIntakePage() {
  return (
    <div className="space-y-8 py-4 md:py-2">
      <PageHeader
        eyebrow="新建记录"
        title="把项目判断过程沉淀成事务所可复用的正式案例"
        description="录入页只承担沉淀职责，不再堆叠过多入口。视觉上也进一步压浅，让用户更清楚当前是在填表、不是在看展示页面。"
        actions={
          <Link
            href="/search"
            className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
          >
            返回案例库
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[22px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(238,245,242,0.9),rgba(252,251,248,0.96))] p-4 md:p-5">
          <CaseForm />
        </div>

        <div className="space-y-6 xl:sticky xl:top-[96px] xl:self-start">
          <SectionCard
            title="录入顺序"
            description="只保留必要的指导信息，帮助项目成员沿着同一条路径完成沉淀。"
            tone="muted"
          >
            <div className="space-y-3">
              {workflowNotes.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[16px] border border-[var(--border)] bg-white/90 px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="录入后会影响哪里" description="让字段和后续能力的关系保持明确。">
            <div className="space-y-3">
              {reuseNotes.map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-[var(--border)] bg-white/90 px-4 py-4 text-sm leading-6 text-[var(--muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
