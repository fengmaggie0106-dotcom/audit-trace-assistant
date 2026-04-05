import Link from "next/link";

const quickLinks = [
  { href: "/cases/new", label: "录入案例" },
  { href: "/search", label: "历史查询" },
  { href: "/dashboard", label: "风险看板" },
  { href: "/ai", label: "AI 助手" },
  { href: "/admin", label: "后台管理" },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(247,249,252,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--foreground)] text-sm font-semibold text-white shadow-[var(--shadow-card)]">
            业审
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--foreground)]">
              业审追溯助手
            </p>
            <p className="truncate text-sm text-[var(--muted-foreground)]">
              面向审计方与被审计方的内控合规智能体平台
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
