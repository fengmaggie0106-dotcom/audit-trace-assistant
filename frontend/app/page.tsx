"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CasePreviewCard } from "@/components/cases/case-preview-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { fetchDashboard, fetchSiteContent } from "@/lib/api";
import type { DashboardData, SiteContent } from "@/lib/types";

const emptyDashboard: DashboardData = {
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
  title: "工作台",
  body: "",
  is_published: true,
  updated_by: "system",
  items: {
    hero_eyebrow: "事务所工作台",
    hero_title: "把分散在项目文件与个人经验里的审计判断，沉淀成可追溯的案例资产",
    hero_description:
      "平台面向会计师事务所乙方审计团队，服务于经验沉淀、案例追溯、风险提示和判断过程留痕，不替代审计判断，但帮助团队更快、更一致、更可追责地开展项目工作。",
    core_values: [],
    scenario_links: [],
  },
};

const workflowSteps = [
  {
    href: "/cases/new",
    title: "沉淀项目问题",
    description: "把问题背景、争议过程、判断依据和结论录入为标准案例。",
  },
  {
    href: "/search",
    title: "追溯历史判断",
    description: "按客户、年度、科目和标签回看事务所过往处理逻辑。",
  },
  {
    href: "/dashboard",
    title: "复盘风险分布",
    description: "从案例资产里观察高频问题、热点科目和待复核积压。",
  },
  {
    href: "/ai",
    title: "生成辅助建议",
    description: "在历史案例基础上组织解释、建议动作和类案参考。",
  },
];

const defaultPrinciples = [
  {
    title: "面向事务所，而非泛用户平台",
    description: "主用户是乙方审计团队，首页语言与路径全部围绕项目执行、复核和交接。",
  },
  {
    title: "保留完整判断链，而不是只存结论",
    description: "系统同时沉淀问题、争议、依据、结论和责任边界，方便后续复盘与自我保护。",
  },
  {
    title: "让知识跨年度、跨项目、跨人员延续",
    description: "案例库不是本年归档目录，而是事务所可持续积累与调用的知识资产。",
  },
];

const defaultScenarioLinks = [
  {
    href: "/search",
    title: "追溯连续审计客户问题",
    description: "快速定位去年如何判断、今年是否延续、哪些口径需要修订。",
  },
  {
    href: "/cases/new",
    title: "沉淀新项目判断过程",
    description: "把讨论记录、依据和最终结论及时固化为正式案例。",
  },
  {
    href: "/dashboard",
    title: "查看高频风险与热点科目",
    description: "从沉淀案例里提炼下一个项目最值得先关注的风险区域。",
  },
  {
    href: "/ai",
    title: "调用类案生成辅助建议",
    description: "在不替代专业判断的前提下，提高解释与准备效率。",
  },
];

export default function HomePage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [content, setContent] = useState(defaultContent);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setMessage("");
        const [dashboardData, siteContent] = await Promise.all([
          fetchDashboard(),
          fetchSiteContent("homepage"),
        ]);
        setDashboard(dashboardData);
        setContent(siteContent);
      } catch (error) {
        console.error(error);
        setMessage("工作台暂时无法同步后端数据，当前展示的是本地兜底内容。请确认后端服务已启动。");
      }
    }

    void load();
  }, []);

  const homepage = useMemo(() => content.items as Record<string, unknown>, [content.items]);
  const principles = Array.isArray(homepage.core_values)
    ? (homepage.core_values as Array<{ title: string; description: string }>)
    : [];
  const scenarioLinks = Array.isArray(homepage.scenario_links)
    ? (homepage.scenario_links as Array<{ href: string; title: string; description: string }>)
    : [];

  const resolvedPrinciples = principles.length ? principles.slice(0, 3) : defaultPrinciples;
  const resolvedLinks = scenarioLinks.length ? scenarioLinks.slice(0, 4) : defaultScenarioLinks;

  return (
    <div className="space-y-8 py-4 md:py-2">
      <PageHeader
        eyebrow={String(homepage.hero_eyebrow || "事务所工作台")}
        title={String(homepage.hero_title || defaultContent.items.hero_title)}
        description={String(homepage.hero_description || defaultContent.items.hero_description)}
        actions={
          <>
            <Link
              href="/search"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
            >
              打开案例库
            </Link>
            <Link
              href="/cases/new"
              className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              新建记录
            </Link>
          </>
        }
      />

      {message ? (
        <div className="rounded-[18px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label="案例资产"
          value={dashboard.total_cases}
          helper="事务所当前已沉淀、可被持续调用的结构化审计案例总量。"
          tone="default"
        />
        <StatCard
          label="高风险案例"
          value={dashboard.high_risk_cases}
          helper="适合优先复核和项目准备阶段重点参考的高风险样本。"
          tone="critical"
        />
        <StatCard
          label="已确认案例"
          value={dashboard.confirmed_cases}
          helper="经过审核确认，可作为后续项目判断参考的案例底稿。"
          tone="positive"
        />
        <StatCard
          label="待复核记录"
          value={dashboard.pending_cases}
          helper="提醒团队哪些新沉淀记录尚未完成复核闭环。"
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="事务所主 workflow" description="把主路径控制在少数页面里，让逻辑更连续。">
          <div className="grid gap-3">
            {workflowSteps.map((step, index) => (
              <Link
                key={step.href}
                href={step.href}
                className="flex items-start gap-4 rounded-[18px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4 transition hover:border-[var(--border-strong)] hover:bg-white"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-sm font-semibold text-[var(--accent-strong)]">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                    {step.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="平台定义"
          description="用更克制、更专业的方式说明平台定位和边界。"
          tone="muted"
        >
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            {content.body ||
              "这是一个面向会计师事务所乙方审计团队的审计知识追溯与风险提示工作台。它不替代 ERP，也不替代审计师判断，而是把原本分散在底稿、邮件、纪要和个人经验中的判断依据，沉淀成事务所可长期积累和持续调用的案例资产。"}
          </p>
          <div className="mt-5 grid gap-3">
            {resolvedPrinciples.map((item) => (
              <div
                key={item.title}
                className="rounded-[16px] border border-[var(--border)] bg-white px-4 py-4"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="最近更新的案例"
          description="首页只保留最近活动，不再把更多页面入口平铺在主流程前面。"
          actions={
            <Link
              href="/search"
              className="text-sm font-semibold text-[var(--accent-strong)] transition hover:opacity-80"
            >
              查看全部案例
            </Link>
          }
        >
          <div className="space-y-4">
            {dashboard.recent_cases.length ? (
              dashboard.recent_cases.slice(0, 4).map((item) => (
                <CasePreviewCard
                  key={item.id}
                  href={`/cases/${item.id}`}
                  title={item.title}
                  meta={`${item.company_name} / ${item.fiscal_year} / ${item.account_name}`}
                  summary={item.summary}
                  issueType={item.issue_type}
                />
              ))
            ) : (
              <EmptyState
                title="还没有最近案例"
                description="先录入一条案例，工作台会把它作为最近活动展示在这里。"
                action={
                  <Link
                    href="/cases/new"
                    className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    去新建记录
                  </Link>
                }
              />
            )}
          </div>
        </SectionCard>

        <SectionCard title="二级能力入口" description="把洞察和助手收为能力模块，避免主导航显得过多。">
          <div className="grid gap-4 md:grid-cols-2">
            {resolvedLinks.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[18px] border border-[var(--border)] bg-[var(--panel-subtle)] px-5 py-5 transition hover:border-[var(--border-strong)] hover:bg-white"
              >
                <p className="text-base font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[18px] border border-[var(--border)] bg-white px-5 py-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">当前重点关注</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {dashboard.hot_accounts[0]?.label
                ? `近期事务所案例里最值得优先复盘的热点科目是 ${dashboard.hot_accounts[0].label}。`
                : "等待更多案例沉淀后，这里会自动提示值得优先复盘的热点科目。"}
            </p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="典型使用场景" description="把平台价值落到连续审计、新客户和问题留痕三类真实场景。">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {resolvedLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[18px] border border-[var(--border)] bg-[var(--panel-subtle)] px-5 py-5 transition hover:border-[var(--border-strong)] hover:bg-white"
            >
              <p className="text-base font-semibold text-[var(--foreground)]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
