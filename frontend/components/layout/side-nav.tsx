"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive, navigationGroups, secondaryNavigation } from "@/lib/navigation";

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:w-[280px] lg:shrink-0">
      <div className="flex gap-4 overflow-x-auto py-4 lg:block lg:h-full lg:overflow-y-auto lg:border-r lg:border-[var(--border)] lg:pr-6">
        {navigationGroups.map((group) => (
          <div key={group.id} className="min-w-[240px] space-y-3 lg:min-w-0 lg:pb-6">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {group.title}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => {
                const active = isNavItemActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-[18px] border px-4 py-4 transition ${
                      active
                        ? "border-[var(--border-strong)] bg-white shadow-[var(--shadow-card)]"
                        : "border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--panel-subtle)]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="hidden rounded-[18px] border border-[var(--border)] bg-[var(--panel-subtle)] p-4 text-sm text-[var(--muted-foreground)] lg:block">
          <p className="font-semibold text-[var(--foreground)]">二级能力</p>
          <div className="mt-3 space-y-3">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-[14px] border border-[var(--border)] bg-white px-4 py-3 transition hover:border-[var(--border-strong)]"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
