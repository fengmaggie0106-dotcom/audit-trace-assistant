import type { ReactNode } from "react";

import { SideNav } from "@/components/layout/side-nav";
import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--page-background)]">
      <TopNav />
      <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
        <SideNav />
        <main className="min-w-0 flex-1 px-5 pb-10 md:px-8 md:pb-14">{children}</main>
      </div>
    </div>
  );
}
