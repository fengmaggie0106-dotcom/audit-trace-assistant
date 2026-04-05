"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { askAssistant, fetchDisplayConfig } from "@/lib/api";
import type { AssistantResponse, DisplayConfig } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TagChip } from "@/components/ui/tag-chip";

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
      "AI 建议基于历史案例，不替代审计师和财务人员的专业判断。",
  );

  return (
    <div className="space-y-8 py-6 md:py-8">
      <PageHeader
        eyebrow="AI 助手"
        title="先有历史参照，再形成专业判断。"
        description="当前版本以历史案例检索增强为主，重点展示相似案例、处理结论和建议动作。"
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title="提问区" description={disclaimer}>
          <div className="space-y-4">
            <textarea
              className="min-h-[180px] w-full rounded-[24px] border border-[var(--border)] bg-white px-4 py-4 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[color:rgba(20,184,166,0.12)]"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
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
                className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--foreground-soft)]"
              >
                {loading ? "生成中..." : "生成建议"}
              </button>
              <Link
                href="/search"
                className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                先去历史查询
              </Link>
            </div>
            {message ? <p className="text-sm font-medium text-rose-700">{message}</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="建议结果" description="展示 AI 基于历史案例和规则生成的解释与动作。">
          <div className="space-y-6">
            <div className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5">
              <p className="text-sm font-semibold text-[var(--foreground)]">AI 解释</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {response.answer || "点击“生成建议”后，这里会展示基于历史案例生成的解释。"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">相似案例</p>
              <div className="mt-3 space-y-4">
                {response.matched_cases.map((item) => (
                  <Link
                    key={item.id}
                    href={`/cases/${item.id}`}
                    className="block rounded-[22px] border border-[var(--border)] bg-white p-5 transition hover:border-[var(--accent-strong)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-[var(--foreground)]">
                        {item.title}
                      </p>
                      <StatusBadge label={item.risk_level} kind="risk" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      {item.company_name} / {item.fiscal_year} / {item.account_name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                      {item.conclusion}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <TagChip key={tag} label={tag} />
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">建议动作</p>
              <div className="mt-3 grid gap-3">
                {response.next_actions.map((action) => (
                  <div
                    key={action}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-3 text-sm text-[var(--muted-foreground)]"
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
