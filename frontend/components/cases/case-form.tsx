"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createCase } from "@/lib/api";
import type { CasePayload } from "@/lib/types";
import { SectionCard } from "@/components/ui/section-card";

const emptyForm = {
  title: "",
  company_code: "",
  company_name: "",
  fiscal_year: "",
  fiscal_period: "",
  account_code: "",
  account_name: "",
  issue_type: "",
  voucher_reference: "",
  summary: "",
  background: "",
  dispute_process: "",
  judgment_basis: "",
  conclusion: "",
  reference_entry: "",
  tags_text: "",
  attachment_links_text: "",
  risk_level: "中",
  source_type: "manual",
  status: "待审核",
  created_by: "system",
};

function inputClassName() {
  return "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[color:rgba(20,184,166,0.12)]";
}

function textareaClassName() {
  return `${inputClassName()} min-h-[128px] resize-y`;
}

export function CaseForm() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (name: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload: CasePayload = {
      title: form.title,
      company_code: form.company_code,
      company_name: form.company_name,
      fiscal_year: form.fiscal_year,
      fiscal_period: form.fiscal_period,
      account_code: form.account_code,
      account_name: form.account_name,
      issue_type: form.issue_type,
      voucher_reference: form.voucher_reference || null,
      summary: form.summary,
      background: form.background,
      dispute_process: form.dispute_process,
      judgment_basis: form.judgment_basis,
      conclusion: form.conclusion,
      reference_entry: form.reference_entry,
      attachment_links: form.attachment_links_text
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      tags: form.tags_text
        .split(/[\n,，、]/)
        .map((item) => item.trim())
        .filter(Boolean),
      risk_level: form.risk_level,
      source_type: form.source_type,
      status: form.status,
      created_by: form.created_by,
    };

    try {
      const result = await createCase(payload);
      setMessage("案例已录入，正在跳转到详情页。");
      setForm(emptyForm);
      router.push(`/cases/${result.id}`);
    } catch (error) {
      console.error(error);
      setMessage("提交失败，请确认后端服务已启动并检查必填字段。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <SectionCard
        title="结构化录入"
        description="先固化索引字段，确保后续可以按公司、年度、科目、标签进行精准追溯。"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input className={inputClassName()} placeholder="案例主题" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
          <input className={inputClassName()} placeholder="公司编码，如 BJ-001" value={form.company_code} onChange={(event) => updateField("company_code", event.target.value)} required />
          <input className={inputClassName()} placeholder="公司名称" value={form.company_name} onChange={(event) => updateField("company_name", event.target.value)} required />
          <input className={inputClassName()} placeholder="年度，如 2025" value={form.fiscal_year} onChange={(event) => updateField("fiscal_year", event.target.value)} required />
          <input className={inputClassName()} placeholder="期间，如 2025-Q4" value={form.fiscal_period} onChange={(event) => updateField("fiscal_period", event.target.value)} required />
          <input className={inputClassName()} placeholder="科目代码" value={form.account_code} onChange={(event) => updateField("account_code", event.target.value)} required />
          <input className={inputClassName()} placeholder="科目名称" value={form.account_name} onChange={(event) => updateField("account_name", event.target.value)} required />
          <input className={inputClassName()} placeholder="问题类型，如 收入确认" value={form.issue_type} onChange={(event) => updateField("issue_type", event.target.value)} required />
          <input className={inputClassName()} placeholder="凭证或资料编号" value={form.voucher_reference} onChange={(event) => updateField("voucher_reference", event.target.value)} />
          <select className={inputClassName()} value={form.risk_level} onChange={(event) => updateField("risk_level", event.target.value)}>
            <option value="高">高风险</option>
            <option value="中">中风险</option>
            <option value="低">低风险</option>
          </select>
          <select className={inputClassName()} value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="待审核">待审核</option>
            <option value="已确认">已确认</option>
          </select>
          <input className={inputClassName()} placeholder="录入人" value={form.created_by} onChange={(event) => updateField("created_by", event.target.value)} />
        </div>
      </SectionCard>

      <SectionCard
        title="追溯内容"
        description="案例库不仅记录结论，还要完整保留背景、争议过程和判断依据。"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea className={textareaClassName()} placeholder="问题摘要" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} required />
          <textarea className={textareaClassName()} placeholder="问题背景" value={form.background} onChange={(event) => updateField("background", event.target.value)} required />
          <textarea className={textareaClassName()} placeholder="争议过程" value={form.dispute_process} onChange={(event) => updateField("dispute_process", event.target.value)} required />
          <textarea className={textareaClassName()} placeholder="判断依据" value={form.judgment_basis} onChange={(event) => updateField("judgment_basis", event.target.value)} required />
          <textarea className={textareaClassName()} placeholder="最终结论" value={form.conclusion} onChange={(event) => updateField("conclusion", event.target.value)} required />
          <textarea className={textareaClassName()} placeholder="参考分录" value={form.reference_entry} onChange={(event) => updateField("reference_entry", event.target.value)} required />
          <textarea className={textareaClassName()} placeholder="标签，支持逗号、顿号或换行分隔" value={form.tags_text} onChange={(event) => updateField("tags_text", event.target.value)} />
          <textarea className={textareaClassName()} placeholder="附件或资料链接，每行一个" value={form.attachment_links_text} onChange={(event) => updateField("attachment_links_text", event.target.value)} />
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--foreground-soft)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "提交中..." : "提交并进入详情页"}
        </button>
        {message ? (
          <p className="text-sm font-medium text-[var(--accent-strong)]">{message}</p>
        ) : null}
      </div>
    </form>
  );
}
