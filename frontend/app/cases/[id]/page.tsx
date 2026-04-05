"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { fetchCase } from "@/lib/api";
import type { CaseRecord } from "@/lib/types";
import { CaseDetailHeader } from "@/components/cases/case-detail-header";
import { CaseMetadataPanel } from "@/components/cases/case-metadata-panel";
import { CaseTraceSections } from "@/components/cases/case-trace-sections";

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<CaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setMessage("");
        const result = await fetchCase(Number(params.id));
        setItem(result);
      } catch (error) {
        console.error(error);
        setMessage("案例详情加载失败，请检查案例编号和后端服务。");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      void load();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-10 text-sm text-[var(--muted-foreground)]">正在加载案例详情...</div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-4 py-10">
        <p className="text-sm font-medium text-rose-700">{message || "未找到案例。"}</p>
        <Link
          href="/search"
          className="inline-flex rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
        >
          返回历史查询
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 md:py-8">
      <CaseDetailHeader item={item} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.62fr]">
        <CaseTraceSections item={item} />
        <CaseMetadataPanel item={item} />
      </div>
    </div>
  );
}
