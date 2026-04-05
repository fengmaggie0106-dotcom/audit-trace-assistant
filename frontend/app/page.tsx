"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { fetchDashboard, fetchSiteContent, fetchStats } from "@/lib/api";
import type { DashboardData, SiteContent, StatsData } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { TagChip } from "@/components/ui/tag-chip";

const defaultStats: StatsData = {
  total_cases: 0,
  high_risk_cases: 0,
  confirmed_cases: 0,
};

const defaultDashboard: DashboardData = {
  total_cases: 0,
  high_risk_cases: 0,
  confirmed_cases: 0,
  pending_cases: 0,
  issue_type_distribution: [],
  risk_distribution: [],
  hot_accounts: [],
  yearly_trend: [],
  recent_cases: [],
};

const defaultContent: SiteContent = {
  section_key: "homepage",
  title: "首页内容",
  body: "",
  is_published: true,
  updated_by: "system",
  items: {
    hero_eyebrow: "平台定位",
    hero_title:
      "不是 ERP，也不替代审计判断，而是把跨年度、跨人员、跨项目的经验真正留存下来。",
    hero_description:
      "业审追溯助手面向甲方财务人员、乙方审计团队和管理审核角色，围绕“问题发生 -> 结构化录入 -> 历史追溯 -> AI解释 -> 风险提示”构建审计与合规经验的闭环平台。",
    boundary_cards: [],
    role_values: [],
    core_values: [],
    flow_steps: [],
    scenario_links: [],
  },
};

export default function HomePage() {
  const [stats, setStats] = useState(defaultStats);
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, dashboardData, siteContent] = await Promise.all([
          fetchStats(),
          fetchDashboard(),
          fetchSiteContent("homepage"),
        ]);
        setStats(statsData);
        setDashboard(dashboardData);
        setContent(siteContent);
      } catch (error) {
        console.error(error);
      }
    }

    void load();
  }, []);

  const homepage = useMemo(() => content.items as Record<string, any>, [content.items]);
  const boundaryCards = Array.isArray(homepage.boundary_cards) ? homepage.boundary_cards : [];
  const roleValues = Array.isArray(homepage.role_values) ? homepage.role_values : [];
  const coreValues = Array.isArray(homepage.core_values) ? homepage.core_values : [];
  const flowSteps = Array.isArray(homepage.flow_steps) ? homepage.flow_steps : [];
  const scenarioLinks = Array.isArray(homepage.scenario_links) ? homepage.scenario_links : [];

  return (
    <div className="space-y-8 py-6 md:py-8">
      <PageHeader
        eyebrow={String(homepage.hero_eyebrow || "平台定位")}
        title={String(homepage.hero_title || defaultContent.items.hero_title)}
        description={String(
          homepage.hero_description || defaultContent.items.hero_description,
        )}
        actions={
          <>
            <Link
              href="/search"
              className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--foreground-soft)]"
            >
              进入历史查询
            </Link>
            <Link
              href="/cases/new"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
            >
              录入案例
            </Link>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard label="案例资产总量" value={stats.total_cases} helper="覆盖可长期积累的结构化案例记录" tone="default" />
        <StatCard label="高风险案例" value={stats.high_risk_cases} helper="适合用于前置预警和重点复核" tone="critical" />
        <StatCard label="已确认案例" value={stats.confirmed_cases} helper="审核通过后可被持续复用" tone="positive" />
        <StatCard label="热点科目" value={dashboard.hot_accounts[0]?.label || "待生成"} helper="看板持续聚焦高频错账和争议科目" tone="accent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <SectionCard title="平台边界" description={content.body || "平台定位与现有系统边界说明。"}>
          <div className="grid gap-4 md:grid-cols-3">
            {boundaryCards.map((item: { title: string; description: string }) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="双角色价值" description="同一套案例资产同时服务甲方财务和乙方审计。">
          <div className="grid gap-4">
            {roleValues.map((card: { title: string; points: string[] }) => (
              <div key={card.title} className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">{card.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.points.map((point) => (
                    <TagChip key={point} label={point} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.2fr]">
        <SectionCard title="核心能力" description="首页 10 秒内说明白系统做什么。">
          <div className="grid gap-4 md:grid-cols-2">
            {coreValues.map((item: { title: string; description: string }) => (
              <div key={item.title} className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5">
                <p className="text-base font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="业务闭环" description="从问题发生到形成长期能力，平台记录的不只是处理结论。">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {flowSteps.map((step: string, index: number) => (
              <div key={step} className="rounded-[22px] border border-[var(--border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-base font-semibold text-[var(--foreground)]">{step}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard title="典型场景入口" description="答辩时可按场景直接跳转。">
          <div className="grid gap-4 md:grid-cols-2">
            {scenarioLinks.map(
              (item: { href: string; title: string; description: string }) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[22px] border border-[var(--border)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent-strong)] hover:shadow-[var(--shadow-card)]"
                >
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.description}
                  </p>
                </Link>
              ),
            )}
          </div>
        </SectionCard>

        <SectionCard title="近期案例样本" description="证明这不是普通知识库，而是过程可追溯系统。">
          <div className="space-y-4">
            {dashboard.recent_cases.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/cases/${item.id}`}
                className="block rounded-[22px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5 transition hover:border-[var(--accent-strong)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    {item.title}
                  </p>
                  <TagChip label={item.issue_type} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.company_name} / {item.fiscal_year} / {item.account_name}
                </p>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
