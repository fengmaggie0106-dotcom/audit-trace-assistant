"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FieldBlock, controlClassName, textareaControlClassName } from "@/components/ui/form-controls";
import { SectionCard } from "@/components/ui/section-card";
import { createCase } from "@/lib/api";
import type { CasePayload } from "@/lib/types";

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
      setMessage("提交失败，请确认后端服务已启动，并检查必填字段。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <SectionCard
        title="1. 结构化索引"
        description="这些字段决定案例未来能否被快速检索、交接和复核。"
        tone="muted"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <FieldBlock label="案例主题" hint="一句话概括这条记录的核心问题。">
            <input
              className={controlClassName}
              placeholder="例如：收入提前确认导致跨期错报"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="公司编码">
            <input
              className={controlClassName}
              placeholder="例如：BJ-001"
              value={form.company_code}
              onChange={(event) => updateField("company_code", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="公司名称">
            <input
              className={controlClassName}
              placeholder="输入公司名称"
              value={form.company_name}
              onChange={(event) => updateField("company_name", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="年度">
            <input
              className={controlClassName}
              placeholder="例如：2025"
              value={form.fiscal_year}
              onChange={(event) => updateField("fiscal_year", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="期间">
            <input
              className={controlClassName}
              placeholder="例如：2025-Q4"
              value={form.fiscal_period}
              onChange={(event) => updateField("fiscal_period", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="问题类型">
            <input
              className={controlClassName}
              placeholder="例如：收入确认"
              value={form.issue_type}
              onChange={(event) => updateField("issue_type", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="科目编码">
            <input
              className={controlClassName}
              placeholder="输入科目编码"
              value={form.account_code}
              onChange={(event) => updateField("account_code", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="科目名称">
            <input
              className={controlClassName}
              placeholder="输入科目名称"
              value={form.account_name}
              onChange={(event) => updateField("account_name", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="凭证或资料编号" hint="没有时可以留空。">
            <input
              className={controlClassName}
              placeholder="输入凭证、底稿或资料编号"
              value={form.voucher_reference}
              onChange={(event) => updateField("voucher_reference", event.target.value)}
            />
          </FieldBlock>
          <FieldBlock label="风险等级">
            <select
              className={controlClassName}
              value={form.risk_level}
              onChange={(event) => updateField("risk_level", event.target.value)}
            >
              <option value="高">高风险</option>
              <option value="中">中风险</option>
              <option value="低">低风险</option>
            </select>
          </FieldBlock>
          <FieldBlock label="审核状态">
            <select
              className={controlClassName}
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              <option value="待审核">待审核</option>
              <option value="已确认">已确认</option>
            </select>
          </FieldBlock>
          <FieldBlock label="录入人">
            <input
              className={controlClassName}
              placeholder="输入录入人"
              value={form.created_by}
              onChange={(event) => updateField("created_by", event.target.value)}
            />
          </FieldBlock>
        </div>
      </SectionCard>

      <SectionCard
        title="2. 判断过程"
        description="系统保留的不只是结论，而是完整的背景、争议与依据。"
        tone="muted"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <FieldBlock label="问题摘要" hint="给案例库和详情页提供第一眼判断依据。">
            <textarea
              className={textareaControlClassName}
              placeholder="简述问题核心、影响范围和争议焦点"
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="问题背景">
            <textarea
              className={textareaControlClassName}
              placeholder="说明问题发生的业务场景、时间节点和相关前提"
              value={form.background}
              onChange={(event) => updateField("background", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="争议过程">
            <textarea
              className={textareaControlClassName}
              placeholder="记录项目成员、经理或客户之间的讨论过程"
              value={form.dispute_process}
              onChange={(event) => updateField("dispute_process", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="判断依据">
            <textarea
              className={textareaControlClassName}
              placeholder="整理准则、合同条款、证据链和审核逻辑"
              value={form.judgment_basis}
              onChange={(event) => updateField("judgment_basis", event.target.value)}
              required
            />
          </FieldBlock>
        </div>
      </SectionCard>

      <SectionCard
        title="3. 结论与留痕"
        description="把结论、分录和附件一起沉淀，形成可追责、可复用的正式案例。"
        tone="muted"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <FieldBlock label="最终结论">
            <textarea
              className={textareaControlClassName}
              placeholder="填写最终处理结果和执行建议"
              value={form.conclusion}
              onChange={(event) => updateField("conclusion", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="参考分录">
            <textarea
              className={textareaControlClassName}
              placeholder="把结论转化为可执行的会计处理或披露动作"
              value={form.reference_entry}
              onChange={(event) => updateField("reference_entry", event.target.value)}
              required
            />
          </FieldBlock>
          <FieldBlock label="标签" hint="支持逗号、顿号或换行分隔。">
            <textarea
              className={textareaControlClassName}
              placeholder="例如：收入确认、跨期调整、合同审阅"
              value={form.tags_text}
              onChange={(event) => updateField("tags_text", event.target.value)}
            />
          </FieldBlock>
          <FieldBlock label="附件与资料链接" hint="每行一个链接，便于后续直接打开。">
            <textarea
              className={textareaControlClassName}
              placeholder="粘贴资料链接、底稿地址或网盘路径"
              value={form.attachment_links_text}
              onChange={(event) => updateField("attachment_links_text", event.target.value)}
            />
          </FieldBlock>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "提交中..." : "保存并进入案例详情"}
        </button>
        {message ? <p className="text-sm font-medium text-[var(--accent-strong)]">{message}</p> : null}
      </div>
    </form>
  );
}
