"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearAdminToken } from "@/lib/api";

const adminLinks = [
  { href: "/admin", label: "后台总览" },
  { href: "/admin/content", label: "首页内容" },
  { href: "/admin/cases", label: "案例内容" },
  { href: "/admin/rules", label: "风险规则" },
  { href: "/admin/display", label: "展示配置" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {adminLinks.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[var(--foreground)] text-white"
                : "border border-[var(--border)] bg-white text-[var(--foreground)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => {
          clearAdminToken();
          router.replace("/admin/login");
        }}
        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
      >
        退出登录
      </button>
    </div>
  );
}
