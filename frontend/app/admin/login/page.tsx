"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminLogin, setAdminToken } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState("");

  const inputClassName =
    "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[color:rgba(20,184,166,0.12)]";

  return (
    <div className="space-y-8 py-6 md:py-8">
      <PageHeader
        eyebrow="管理员登录"
        title="登录后台后，可以直接编辑首页文案、案例内容、风险规则和展示配置。"
        description="当前采用轻量管理员体系，不引入复杂权限模型。生产环境建议通过 Railway 环境变量配置管理员账号密码。"
      />

      <div className="max-w-xl">
        <SectionCard title="登录信息" description="默认本地演示账号可在环境变量中调整。">
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                const result = await adminLogin(username, password);
                setAdminToken(result.token);
                router.push("/admin");
              } catch (error) {
                console.error(error);
                setMessage("登录失败，请检查账号密码或后端环境变量。");
              }
            }}
          >
            <input className={inputClassName} value={username} onChange={(event) => setUsername(event.target.value)} placeholder="管理员账号" />
            <input className={inputClassName} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="管理员密码" type="password" />
            <button
              type="submit"
              className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white"
            >
              登录后台
            </button>
            {message ? <p className="text-sm text-rose-700">{message}</p> : null}
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
