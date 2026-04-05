"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    title: "平台首页",
    description: "平台定位、价值与业务闭环",
  },
  {
    href: "/cases/new",
    title: "案例录入",
    description: "结构化沉淀问题背景与判断过程",
  },
  {
    href: "/search",
    title: "历史查询",
    description: "按公司、年度、科目与标签追溯",
  },
  {
    href: "/dashboard",
    title: "风险看板",
    description: "查看高频错账、趋势与热点科目",
  },
  {
    href: "/ai",
    title: "AI 助手",
    description: "基于历史案例提供建议输出",
  },
  {
    href: "/admin",
    title: "后台管理",
    description: "管理员登录后可编辑首页、案例、规则和展示配置",
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="md:sticky md:top-[88px] md:h-[calc(100vh-104px)] md:w-[280px] md:shrink-0">
      <div className="flex gap-3 overflow-x-auto px-5 py-5 md:flex-col md:px-8 md:py-8">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-w-[220px] rounded-[22px] border px-4 py-4 transition md:min-w-0 ${
                active
                  ? "border-[var(--accent-strong)] bg-[var(--panel)] shadow-[var(--shadow-card)]"
                  : "border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--panel)]"
              }`}
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {item.description}
              </p>
            </Link>
          );
        })}

        <div className="hidden rounded-[22px] border border-[var(--border)] bg-[var(--panel)] p-4 text-sm text-[var(--muted-foreground)] md:block">
          <p className="font-semibold text-[var(--foreground)]">比赛演示提示</p>
          <p className="mt-2 leading-6">
            首页先讲定位，再从历史查询进入案例详情，最后演示风险看板和 AI 助手。
          </p>
        </div>
      </div>
    </aside>
  );
}
