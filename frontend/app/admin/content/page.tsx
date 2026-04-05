"use client";

import { useEffect, useState } from "react";

import { fetchAdminSiteContent, getAdminToken, updateAdminSiteContent } from "@/lib/api";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function AdminContentPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [itemsText, setItemsText] = useState("{}");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const content = await fetchAdminSiteContent("homepage", getAdminToken());
        setTitle(content.title);
        setBody(content.body);
        setItemsText(JSON.stringify(content.items, null, 2));
      } catch (error) {
        console.error(error);
        setMessage("读取首页内容失败。");
      }
    }
    void load();
  }, []);

  return (
    <AdminGuard>
      {() => (
        <div className="space-y-8 py-6 md:py-8">
          <PageHeader
            eyebrow="首页内容编辑"
            title="管理员可以直接修改首页文案和首页结构化展示内容。"
            description="当前后台提供正文编辑和结构化 JSON 编辑两层能力，既能快速改文案，也能继续调整首页模块内容。"
          />
          <AdminNav />
          <SectionCard title="首页内容" description="保存后首页会直接读取数据库中的最新内容。">
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  const items = JSON.parse(itemsText);
                  await updateAdminSiteContent(
                    "homepage",
                    {
                      title,
                      body,
                      items,
                      is_published: true,
                    },
                    getAdminToken(),
                  );
                  setMessage("首页内容已保存。");
                } catch (error) {
                  console.error(error);
                  setMessage("保存失败，请检查 JSON 格式。");
                }
              }}
            >
              <input className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="内容标题" />
              <textarea className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={body} onChange={(event) => setBody(event.target.value)} placeholder="内容说明" />
              <textarea className="min-h-[420px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 font-mono text-xs" value={itemsText} onChange={(event) => setItemsText(event.target.value)} />
              <button type="submit" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                保存首页内容
              </button>
              {message ? <p className="text-sm text-[var(--accent-strong)]">{message}</p> : null}
            </form>
          </SectionCard>
        </div>
      )}
    </AdminGuard>
  );
}
