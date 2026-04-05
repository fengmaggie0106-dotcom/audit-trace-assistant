"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { clearAdminToken, fetchAdminMe, getAdminToken } from "@/lib/api";
import type { AdminMe } from "@/lib/types";

type AdminGuardProps = {
  children: (admin: AdminMe) => ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getAdminToken();
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const me = await fetchAdminMe(token);
        setAdmin(me);
      } catch (error) {
        console.error(error);
        clearAdminToken();
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [pathname, router]);

  if (loading || !admin) {
    return <div className="py-10 text-sm text-[var(--muted-foreground)]">正在验证管理员身份...</div>;
  }

  return <>{children(admin)}</>;
}
