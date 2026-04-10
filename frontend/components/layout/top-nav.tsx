"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getCurrentNavItem } from "@/lib/navigation";

export function TopNav() {
  const pathname = usePathname();
  const currentItem = getCurrentNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(252,251,248,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-sm font-semibold text-[var(--accent-strong)] shadow-[var(--shadow-card)]">
            业审
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-lg font-semibold text-[var(--foreground)]"
              style={{ fontFamily: '"Iowan Old Style", "Noto Serif SC", "Songti SC", serif' }}
            >
              业审追溯助手
            </p>
            <p className="truncate text-sm text-[var(--muted-foreground)]">
              面向会计师事务所的审计知识追溯与风险提示工作台
            </p>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Current view
            </p>
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {currentItem?.title || "工作台"}
            </p>
          </div>
          <p className="hidden truncate text-sm text-[var(--muted-foreground)] xl:block">
            {currentItem?.description ||
              "帮助事务所项目成员完成案例沉淀、历史追溯、风险复盘和判断留痕。"}
          </p>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)] md:inline-flex"
          >
            案例库
          </Link>
          <Link
            href="/cases/new"
            className="rounded-full bg-[var(--accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            新建记录
          </Link>
        </nav>
      </div>
    </header>
  );
}
