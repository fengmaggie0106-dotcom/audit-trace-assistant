import { CaseForm } from "@/components/cases/case-form";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function CaseIntakePage() {
  return (
    <div className="space-y-8 py-6 md:py-8">
      <PageHeader
        eyebrow="案例录入"
        title="把问题背景、争议过程、判断依据和参考分录一次沉淀成可追溯案例。"
        description="录入页优先服务于案例资产化，而不是普通工单流转。字段结构直接对齐后续查询、看板与 AI 助手的使用方式。"
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <CaseForm />

        <div className="space-y-6">
          <SectionCard
            title="录入标准"
            description="比赛演示时建议按以下顺序讲字段的业务含义。"
          >
            <div className="space-y-4 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>1. 先录结构化索引字段，确保可按公司、年度、科目、标签追溯。</p>
              <p>2. 再录问题背景和争议过程，说明案例不是只有结论。</p>
              <p>3. 最后录判断依据、结论、参考分录和附件链接，形成完整处理链路。</p>
            </div>
          </SectionCard>

          <SectionCard
            title="沉淀目标"
            description="系统记录的不只是最终处理结果。"
          >
            <div className="grid gap-3">
              {["问题背景", "争议过程", "判断依据", "最终结论", "参考分录", "附件/链接"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-3 text-sm font-medium text-[var(--foreground)]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
