import type { CaseRecord } from "@/lib/types";
import { SectionCard } from "@/components/ui/section-card";

type CaseTraceSectionsProps = {
  item: CaseRecord;
};

export function CaseTraceSections({ item }: CaseTraceSectionsProps) {
  const sections = [
    {
      title: "问题背景",
      description: "说明问题发生的业务场景、时间节点与相关前提。",
      content: item.background,
    },
    {
      title: "争议过程",
      description: "保留甲乙双方或管理层在判断过程中的分歧与讨论路径。",
      content: item.dispute_process,
    },
    {
      title: "判断依据",
      description: "沉淀准则、合同条款、底稿证据与审核逻辑。",
      content: item.judgment_basis,
    },
    {
      title: "最终结论",
      description: "给出当前案例确认后的处理结果与执行建议。",
      content: item.conclusion,
    },
    {
      title: "参考分录",
      description: "将结论转化为可执行的会计处理或披露动作。",
      content: item.reference_entry,
    },
  ];

  return (
    <div className="space-y-5">
      <SectionCard
        title="问题摘要"
        description="当前案例沉淀的起点，用于快速判断是否属于同类问题。"
      >
        <p className="text-sm leading-7 text-[var(--foreground)]">{item.summary}</p>
      </SectionCard>

      {sections.map((section) => (
        <SectionCard
          key={section.title}
          title={section.title}
          description={section.description}
        >
          <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
            {section.content}
          </p>
        </SectionCard>
      ))}
    </div>
  );
}
