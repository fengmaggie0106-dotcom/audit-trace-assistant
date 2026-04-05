"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchCases, getAdminToken, updateAdminCase } from "@/lib/api";
import type { CasePayload, CaseRecord } from "@/lib/types";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

function toPayload(item: CaseRecord): CasePayload {
  return {
    title: item.title,
    company_code: item.company_code,
    company_name: item.company_name,
    fiscal_year: item.fiscal_year,
    fiscal_period: item.fiscal_period,
    account_code: item.account_code,
    account_name: item.account_name,
    issue_type: item.issue_type,
    voucher_reference: item.voucher_reference || null,
    summary: item.summary,
    background: item.background,
    dispute_process: item.dispute_process,
    judgment_basis: item.judgment_basis,
    conclusion: item.conclusion,
    reference_entry: item.reference_entry,
    attachment_links: item.attachment_links,
    tags: item.tags,
    risk_level: item.risk_level,
    source_type: item.source_type,
    status: item.status,
    created_by: item.created_by,
  };
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<CasePayload | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const items = await fetchCases();
      setCases(items);
      if (items.length) {
        setSelectedId(items[0].id);
        setForm(toPayload(items[0]));
      }
    }
    void load();
  }, []);

  const selectedCase = useMemo(
    () => cases.find((item) => item.id === selectedId) || null,
    [cases, selectedId],
  );

  return (
    <AdminGuard>
      {() => (
        <div className="space-y-8 py-6 md:py-8">
          <PageHeader
            eyebrow="案例内容编辑"
            title="管理员可直接维护案例内容，不需要再回到代码中改种子数据。"
            description="适合后续持续运营：修改案例摘要、背景、争议过程、依据、结论、标签、附件和展示状态。"
          />
          <AdminNav />
          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <SectionCard title="案例列表" description="选择一条案例进入编辑。">
              <div className="space-y-3">
                {cases.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setForm(toPayload(item));
                    }}
                    className={`w-full rounded-2xl border px-4 py-4 text-left ${
                      item.id === selectedId
                        ? "border-[var(--accent-strong)] bg-[var(--panel-subtle)]"
                        : "border-[var(--border)] bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {item.company_name} / {item.fiscal_year} / {item.account_name}
                    </p>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="编辑案例" description="保存后前台详情页和查询页会读取最新内容。">
              {selectedCase && form ? (
                <form
                  className="space-y-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await updateAdminCase(selectedCase.id, form, getAdminToken());
                    setMessage("案例内容已保存。");
                  }}
                >
                  <input className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                  <textarea className="min-h-[100px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
                  <textarea className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.background} onChange={(event) => setForm({ ...form, background: event.target.value })} />
                  <textarea className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.dispute_process} onChange={(event) => setForm({ ...form, dispute_process: event.target.value })} />
                  <textarea className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.judgment_basis} onChange={(event) => setForm({ ...form, judgment_basis: event.target.value })} />
                  <textarea className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.conclusion} onChange={(event) => setForm({ ...form, conclusion: event.target.value })} />
                  <textarea className="min-h-[100px] w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.reference_entry} onChange={(event) => setForm({ ...form, reference_entry: event.target.value })} />
                  <input className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.tags.join(", ")} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="标签，逗号分隔" />
                  <input className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm" value={form.attachment_links.join(", ")} onChange={(event) => setForm({ ...form, attachment_links: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="附件链接，逗号分隔" />
                  <button type="submit" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                    保存案例
                  </button>
                  {message ? <p className="text-sm text-[var(--accent-strong)]">{message}</p> : null}
                </form>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">暂无案例数据。</p>
              )}
            </SectionCard>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
