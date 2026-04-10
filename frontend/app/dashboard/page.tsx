"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchDashboard, fetchDisplayConfig, fetchRiskRules } from "@/lib/api";
import type { DashboardData, DisplayConfig, DistributionItem, RiskRule } from "@/lib/types";

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

const emptyConfig: DisplayConfig = {
  config_key: "dashboard",
  description: "",
  config_value: {},
  updated_by: "system",
};

function DistributionList({
  items,
  maxValue,
}: {
  items: DistributionItem[];
  maxValue: number;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="font-medium text-[var(--foreground)]">{item.label}</p>
            <p className="font-semibold text-[var(--muted-foreground)]">{item.value}</p>
          </div>
          <div className="h-2 rounded-full bg-[var(--panel-muted)]">
            <div
              className="h-2 rounded-full bg-[var(--accent-strong)]"
              style={{ width: `${(item.value / Math.max(maxValue, 1)) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [rules, setRules] = useState<RiskRule[]>([]);
  const [config, setConfig] = useState(emptyConfig);

  useEffect(() => {
    async function load() {
      try {
        const [dashboardData, ruleData, displayConfig] = await Promise.all([
          fetchDashboard(),
          fetchRiskRules(),
          fetchDisplayConfig("dashboard"),
        ]);
        setDashboard(dashboardData);
        setRules(ruleData);
        setConfig(displayConfig);
      } catch (error) {
        console.error(error);
      }
    }

    void load();
  }, []);

  const configValue = config.config_value as {
    headline?: string;
    subline?: string;
  };

  return (
    <div className="space-y-8 py-4 md:py-2">
      <PageHeader
        eyebrow="风险洞察"
        title={configValue.headline || "把分散案例整理成事务所可提前使用的风险视图"}
        description={
          configValue.subline ||
          "洞察页是二级能力页面，服务于项目准备、经理复核和热点问题复盘，不再承担首页导航职责。"
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard label="案例总量" value={dashboard.total_cases} helper="事务所全部沉淀案例资产。" tone="default" />
        <StatCard label="高风险案例" value={dashboard.high_risk_cases} helper="优先复核的高风险样本。" tone="critical" />
        <StatCard label="已确认案例" value={dashboard.confirmed_cases} helper="可直接复用的确认案例。" tone="positive" />
        <StatCard label="待审核案例" value={dashboard.pending_cases} helper="当前待闭环的新记录。" tone="accent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="问题类型分布" description="观察事务所案例资产主要集中在哪些争议类型。">
          <DistributionList
            items={dashboard.issue_type_distribution}
            maxValue={Math.max(...dashboard.issue_type_distribution.map((item) => item.value), 1)}
          />
        </SectionCard>

        <SectionCard title="风险等级分布" description="高风险样本越集中，越适合形成标准关注清单。">
          <DistributionList
            items={dashboard.risk_distribution}
            maxValue={Math.max(...dashboard.risk_distribution.map((item) => item.value), 1)}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="热点科目" description="哪些科目最容易重复出现错报、争议或复核压力。">
          <DistributionList
            items={dashboard.hot_accounts}
            maxValue={Math.max(...dashboard.hot_accounts.map((item) => item.value), 1)}
          />
        </SectionCard>

        <SectionCard title="年度趋势" description="用跨年度视角观察知识资产是否持续积累。">
          <DistributionList
            items={dashboard.yearly_trend}
            maxValue={Math.max(...dashboard.yearly_trend.map((item) => item.value), 1)}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="风险规则" description="规则用于把历史高频问题沉淀为更稳定的复核提示。">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-[18px] border border-[var(--border)] bg-white p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-[var(--foreground)]">{rule.name}</p>
                  <StatusBadge label={rule.risk_level} kind="risk" />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {rule.description}
                </p>
                <p className="mt-3 text-sm text-[var(--foreground)]">
                  触发科目：{rule.trigger_account || "未限定"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  建议动作：{rule.suggestion}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="复核提示" description="用简短提示替代重复入口，让洞察页回到分析职责。">
          <div className="grid gap-3">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">待审核积压</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                当前还有 {dashboard.pending_cases} 条案例处于待审核状态，建议优先处理高风险记录。
              </p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">热点科目复盘</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {dashboard.hot_accounts[0]?.label
                  ? `近期最值得优先复盘的科目是 ${dashboard.hot_accounts[0].label}。`
                  : "等待更多案例沉淀后，这里会自动提示热点科目。"}
              </p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--panel-subtle)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">交接一致性</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                建议把高风险案例和热点科目对应到规则维护页，减少项目成员轮换时的口径漂移。
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
