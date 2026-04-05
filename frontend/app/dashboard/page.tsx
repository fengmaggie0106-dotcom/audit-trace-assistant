"use client";

import { useEffect, useState } from "react";

import { fetchDashboard, fetchDisplayConfig, fetchRiskRules } from "@/lib/api";
import type { DashboardData, DisplayConfig, DistributionItem, RiskRule } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";

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
          <div className="h-2 rounded-full bg-[var(--panel-subtle)]">
            <div
              className="h-2 rounded-full bg-[linear-gradient(90deg,#0f766e,#0ea5e9)]"
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
    show_recent_cases?: boolean;
  };

  return (
    <div className="space-y-8 py-6 md:py-8">
      <PageHeader
        eyebrow="风险看板"
        title={configValue.headline || "高频错账、热点科目与调整趋势"}
        description={
          configValue.subline ||
          "看板页重点用于比赛展示：证明平台不仅能沉淀案例，还能形成风险前移能力。"
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard label="案例总量" value={dashboard.total_cases} helper="用于沉淀跨年度经验" tone="default" />
        <StatCard label="高风险案例" value={dashboard.high_risk_cases} helper="适合作为重点复核样本" tone="critical" />
        <StatCard label="已确认案例" value={dashboard.confirmed_cases} helper="可直接复用的审核通过案例" tone="positive" />
        <StatCard label="待审核案例" value={dashboard.pending_cases} helper="提醒继续补录和审核" tone="accent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="问题类型分布" description="说明平台沉淀的是问题画像，而不仅仅是列表。">
          <DistributionList
            items={dashboard.issue_type_distribution}
            maxValue={Math.max(...dashboard.issue_type_distribution.map((item) => item.value), 1)}
          />
        </SectionCard>

        <SectionCard title="风险等级分布" description="高风险样本可继续被 AI 助手优先召回。">
          <DistributionList
            items={dashboard.risk_distribution}
            maxValue={Math.max(...dashboard.risk_distribution.map((item) => item.value), 1)}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="热点科目" description="观察哪些科目最容易重复出现错误或争议。">
          <DistributionList
            items={dashboard.hot_accounts}
            maxValue={Math.max(...dashboard.hot_accounts.map((item) => item.value), 1)}
          />
        </SectionCard>

        <SectionCard title="年度趋势" description="体现平台具备跨年度持续积累能力。">
          <DistributionList
            items={dashboard.yearly_trend}
            maxValue={Math.max(...dashboard.yearly_trend.map((item) => item.value), 1)}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="风险规则" description="这些规则可由管理员后台直接编辑。">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-[22px] border border-[var(--border)] bg-white p-5">
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

        <SectionCard title="近期案例" description="看板可选择是否展示最近更新的案例。">
          <div className="space-y-4">
            {(configValue.show_recent_cases === false ? [] : dashboard.recent_cases).map((item) => (
              <div key={item.id} className="rounded-[22px] border border-[var(--border)] bg-[var(--panel-subtle)] p-5">
                <p className="text-base font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {item.company_name} / {item.fiscal_year} / {item.account_name}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
