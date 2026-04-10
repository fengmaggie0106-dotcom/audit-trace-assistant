"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CasePreviewCard } from "@/components/cases/case-preview-card";
import { FieldBlock, textareaControlClassName } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { askAssistant, fetchDisplayConfig } from "@/lib/api";
import type { AssistantResponse, DisplayConfig } from "@/lib/types";

const emptyResponse: AssistantResponse = {
  answer: "",
  matched_cases: [],
  next_actions: [],
};

const emptyConfig: DisplayConfig = {
  config_key: "ai",
  description: "",
  config_value: {},
  updated_by: "system",
};

export default function AiAssistantPage() {
  const [question, setQuestion] = useState("收入提前确认应该参考哪些历史案例？");
  const [response, setResponse] = useState(emptyResponse);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [config, setConfig] = useState(emptyConfig);

  useEffect(() => {
    async function loadConfig() {
      try {
        const result = await fetchDisplayConfig("ai");
        setConfig(result);
      } catch (error) {
        console.error(error);
      }
    }

    void loadConfig();
  }, []);

  const disclaimer = String(
    (config.config_value as { disclaimer?: string }).disclaimer ||
      "AI 建议基于事务所历史案例，不替代审计师的专业判断与签字责任。",
  );

  return (
    <div className="space-y-8 py-4 md:py-2">
      <PageHeader
        eyebrow="助手"
        title="在事务所历史案例基础上组织解释、建议与类案参考"
        description="助手页是二级能力模块。它不单独定义主流程，而是在案例资产已经沉淀的前提下，为项目成员提供辅助解释与准备支持。"
        actions={
          <Link
            href="/search"
            className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
          >
            先去案例库
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title="提问区" description={disclaimer} tone="muted">
          <div className="space-y-4">
            <FieldBlock label="你的问题" hint="适合输入争议事项、审计关注点、复核动作或历史追溯问题。">
              <textarea
                className={textareaControlClassName}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </FieldBlock>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setMessage("");
                  try {
                    const result = await askAssistant(question);
                    setResponse(result);
                  } catch (error) {
                    console.error(error);
                    setMessage("AI 助手暂时无法连接后端接口。");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "生成中..." : "生成建议"}
              </button>
              <Link
                href="/search"
                className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
              >
                打开案例库
              </Link>
            </div>

            {message ? <p className="text-sm font-medium text-rose-700">{message}</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="建议结果" description="结果区拆成解释、相似案例和建议动作，方便项目成员直接复核。">
          <div className="space-y-6">
            <div className="rounded-[18px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5">
              <p className="text-sm font-semibold text-[var(--foreground)]">AI 解释</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {response.answer || "点击“生成建议”后，这里会展示基于事务所历史案例生成的解释。"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">相似案例</p>
              <div className="mt-3 space-y-4">
                {response.matched_cases.map((item) => (
                  <CasePreviewCard
                    key={item.id}
                    href={`/cases/${item.id}`}
                    title={item.title}
                    meta={`${item.company_name} / ${item.fiscal_year} / ${item.account_name}`}
                    summary={item.conclusion}
                    riskLevel={item.risk_level}
                    tags={item.tags}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">建议动作</p>
              <div className="mt-3 grid gap-3">
                {response.next_actions.map((action) => (
                  <div
                    key={action}
                    className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4 text-sm leading-6 text-[var(--muted-foreground)]"
                  >
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
