export type AppNavItem = {
  href: string;
  title: string;
  shortLabel: string;
  description: string;
};

export type AppNavGroup = {
  id: string;
  title: string;
  items: AppNavItem[];
};

export const primaryNavigation: AppNavItem[] = [
  {
    href: "/",
    title: "工作台",
    shortLabel: "工作台",
    description: "围绕事务所审计团队的当前任务、近期案例和推荐动作组织首页。",
  },
  {
    href: "/search",
    title: "案例库",
    shortLabel: "案例库",
    description: "作为唯一列表事实源，统一检索、筛选和回看历史审计案例。",
  },
  {
    href: "/cases/new",
    title: "新建记录",
    shortLabel: "新建",
    description: "按同一条审计知识 workflow 录入基础索引、判断过程和结论留痕。",
  },
];

export const secondaryNavigation: AppNavItem[] = [
  {
    href: "/dashboard",
    title: "风险洞察",
    shortLabel: "洞察",
    description: "从案例资产中聚合高频问题、热点科目和待复核风险。",
  },
  {
    href: "/ai",
    title: "助手",
    shortLabel: "助手",
    description: "基于事务所历史案例生成解释、建议与类案参考。",
  },
];

export const navigationGroups: AppNavGroup[] = [
  {
    id: "workflow",
    title: "Workflow",
    items: primaryNavigation,
  },
  {
    id: "system",
    title: "System",
    items: [
      {
        href: "/admin",
        title: "管理",
        shortLabel: "管理",
        description: "维护案例内容、展示配置和风险规则。",
      },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentNavItem(pathname: string) {
  return [...primaryNavigation, ...secondaryNavigation, ...navigationGroups.flatMap((group) => group.items)]
    .find((item) => isNavItemActive(pathname, item.href));
}
