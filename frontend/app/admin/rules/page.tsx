"use client";

import { useEffect, useState } from "react";

import { createAdminRiskRule, fetchAdminRiskRules, getAdminToken, updateAdminRiskRule } from "@/lib/api";
import type { RiskRule } from "@/lib/types";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const emptyRule = {
  name: "",
  description: "",
  risk_level: "中",
  trigger_account: "",
  keyword_pattern: "",
  suggestion: "",
  enabled: true,
  sort_order: 100,
};

export default function AdminRulesPage() {
  const [rules, setRules] = useState<RiskRule[]>([]);
  const [message, setMessage] = useState("");

  async function loadRules() {
    const result = await fetchAdminRiskRules(getAdminToken());
    setRules(result);
  }

  useEffect(() => {
    void loadRules();
  }, []);

  return (
    <AdminGuard>
      {() => (
        <div className="space-y-8 py-6 md:py-8">
          <PageHeader
            eyebrow="风险规则编辑"
            title="通过后台维护规则，让看板和 AI 助手具备可运营的风险提示能力。"
            description="每条规则包含名称、说明、触发科目、关键词模式和建议动作。"
          />
          <AdminNav />
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <SectionCard title="新增规则" description="先补一条规则，再持续维护。">
              <form
                className="space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  await createAdminRiskRule(
                    {
                      name: String(form.get("name") || ""),
                      description: String(form.get("description") || ""),
                      risk_level: String(form.get("risk_level") || "中"),
                      trigger_account: String(form.get("trigger_account") || ""),
                      keyword_pattern: String(form.get("keyword_pattern") || ""),
                      suggestion: String(form.get("suggestion") || ""),
                      enabled: true,
                      sort_order: Number(form.get("sort_order") || 100),
                    },
                    getAdminToken(),
                  );
                  setMessage("规则已新增。");
                  await loadRules();
                  event.currentTarget.reset();
                }}
              >
                {["name", "description", "trigger_account", "keyword_pattern", "suggestion", "sort_order"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                    placeholder={field}
                  />
                ))}
                <select name="risk_level" className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm">
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
                <button type="submit" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                  新增规则
                </button>
                {message ? <p className="text-sm text-[var(--accent-strong)]">{message}</p> : null}
              </form>
            </SectionCard>

            <SectionCard title="已有关联规则" description="当前保留快速启停和内容调整。">
              <div className="space-y-4">
                {rules.map((rule) => (
                  <form
                    key={rule.id}
                    className="rounded-2xl border border-[var(--border)] bg-white p-4"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const form = new FormData(event.currentTarget);
                      await updateAdminRiskRule(
                        rule.id,
                        {
                          name: String(form.get("name") || ""),
                          description: String(form.get("description") || ""),
                          risk_level: String(form.get("risk_level") || "中"),
                          trigger_account: String(form.get("trigger_account") || ""),
                          keyword_pattern: String(form.get("keyword_pattern") || ""),
                          suggestion: String(form.get("suggestion") || ""),
                          enabled: form.get("enabled") === "on",
                          sort_order: Number(form.get("sort_order") || 100),
                        },
                        getAdminToken(),
                      );
                      setMessage(`规则“${rule.name}”已更新。`);
                      await loadRules();
                    }}
                  >
                    <div className="grid gap-3">
                      <input name="name" defaultValue={rule.name} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm" />
                      <input name="description" defaultValue={rule.description} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm" />
                      <input name="trigger_account" defaultValue={rule.trigger_account} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm" />
                      <input name="keyword_pattern" defaultValue={rule.keyword_pattern} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm" />
                      <input name="suggestion" defaultValue={rule.suggestion} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm" />
                      <div className="grid gap-3 md:grid-cols-3">
                        <select name="risk_level" defaultValue={rule.risk_level} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm">
                          <option value="高">高</option>
                          <option value="中">中</option>
                          <option value="低">低</option>
                        </select>
                        <input name="sort_order" defaultValue={rule.sort_order} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm" />
                        <label className="flex items-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm">
                          <input name="enabled" type="checkbox" defaultChecked={rule.enabled} />
                          启用规则
                        </label>
                      </div>
                      <button type="submit" className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-white">
                        保存规则
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
