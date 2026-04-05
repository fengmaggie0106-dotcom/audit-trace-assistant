"use client";

import { useEffect, useState } from "react";

import { fetchAdminDisplayConfig, getAdminToken, updateAdminDisplayConfig } from "@/lib/api";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function AdminDisplayPage() {
  const [dashboardText, setDashboardText] = useState("{}");
  const [aiText, setAiText] = useState("{}");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const [dashboardConfig, aiConfig] = await Promise.all([
        fetchAdminDisplayConfig("dashboard", getAdminToken()),
        fetchAdminDisplayConfig("ai", getAdminToken()),
      ]);
      setDashboardText(JSON.stringify(dashboardConfig.config_value, null, 2));
      setAiText(JSON.stringify(aiConfig.config_value, null, 2));
    }
    void load();
  }, []);

  return (
    <AdminGuard>
      {() => (
        <div className="space-y-8 py-6 md:py-8">
          <PageHeader
            eyebrow="展示配置"
            title="把看板和 AI 助手的说明、标题和可见配置独立出来，后台直接可调。"
            description="适合比赛前快速调整展示措辞，而不需要重新改代码发布。"
          />
          <AdminNav />
          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="看板配置" description="保存后看板页读取最新配置。">
              <form
                className="space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await updateAdminDisplayConfig(
                    "dashboard",
                    {
                      description: "风险看板展示配置",
                      config_value: JSON.parse(dashboardText),
                    },
                    getAdminToken(),
                  );
                  setMessage("展示配置已保存。");
                }}
              >
                <textarea className="min-h-[320px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 font-mono text-xs" value={dashboardText} onChange={(event) => setDashboardText(event.target.value)} />
                <button type="submit" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                  保存看板配置
                </button>
              </form>
            </SectionCard>

            <SectionCard title="AI 展示配置" description="保存后 AI 助手页读取最新提示语。">
              <form
                className="space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await updateAdminDisplayConfig(
                    "ai",
                    {
                      description: "AI 助手展示配置",
                      config_value: JSON.parse(aiText),
                    },
                    getAdminToken(),
                  );
                  setMessage("展示配置已保存。");
                }}
              >
                <textarea className="min-h-[320px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 font-mono text-xs" value={aiText} onChange={(event) => setAiText(event.target.value)} />
                <button type="submit" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                  保存 AI 配置
                </button>
              </form>
            </SectionCard>
          </div>
          {message ? <p className="text-sm text-[var(--accent-strong)]">{message}</p> : null}
        </div>
      )}
    </AdminGuard>
  );
}
