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
      <div className="mx-auto flex max-w-[1480px] flex-col lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <SideNav />
        <main className="min-w-0 px-4 pb-14 pt-4 md:px-6 lg:px-0 lg:pb-18 lg:pr-6 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
