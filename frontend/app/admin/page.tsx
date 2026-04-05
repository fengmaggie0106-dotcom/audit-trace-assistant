"use client";

import Link from "next/link";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const adminCards = [
  {
    href: "/admin/content",
    title: "首页内容",
    description: "修改首页 Hero 文案、边界说明、双角色价值和场景入口。",
  },
  {
    href: "/admin/cases",
    title: "案例内容",
    description: "直接编辑案例摘要、背景、争议过程、依据、结论和分录。",
  },
  {
    href: "/admin/rules",
    title: "风险规则",
    description: "维护风险提示规则、关键词模式和建议动作。",
  },
  {
    href: "/admin/display",
    title: "展示配置",
    description: "调整看板和 AI 助手的展示标题、说明和配置项。",
  },
];

export default function AdminHomePage() {
  return (
    <AdminGuard>
      {(admin) => (
        <div className="space-y-8 py-6 md:py-8">
          <PageHeader
            eyebrow="管理员后台"
            title={`欢迎，${admin.username}。这里负责把网站从“只能代码维护”升级为“网页直接可编辑”。`}
            description="后台仅覆盖核心内容的直接编辑：首页文案、案例内容、风险规则和展示配置。代码发布能力仍然保留。"
          />
          <AdminNav />
          <div className="grid gap-4 md:grid-cols-2">
            {adminCards.map((item) => (
              <Link key={item.href} href={item.href}>
                <SectionCard title={item.title} description={item.description}>
                  <p className="text-sm text-[var(--accent-strong)]">进入编辑</p>
                </SectionCard>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
