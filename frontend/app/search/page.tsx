"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CaseResultsTable } from "@/components/cases/case-results-table";
import { CaseSearchFilters } from "@/components/cases/case-search-filters";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { fetchCases, fetchFilterOptions } from "@/lib/api";
import type { CaseRecord, FilterOptions } from "@/lib/types";

const defaultFilters = {
  keyword: "",
  company: "",
  year: "",
  account: "",
  tag: "",
};

const emptyOptions: FilterOptions = {
  companies: [],
  years: [],
  accounts: [],
  tags: [],
};

export default function SearchPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [options, setOptions] = useState(emptyOptions);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((value) => value.trim()).length,
    [filters],
  );

  const loadCases = async (activeFilters = filters) => {
    setLoading(true);
    setMessage("");
    try {
      const data = await fetchCases(activeFilters);
      setCases(data);
    } catch (error) {
      console.error(error);
      setMessage("案例查询失败，请确认后端服务已经启动。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function bootstrap() {
      try {
        const [optionData, caseData] = await Promise.all([fetchFilterOptions(), fetchCases()]);
        setOptions(optionData);
        setCases(caseData);
      } catch (error) {
        console.error(error);
        setMessage("初始化案例库失败，请检查接口状态。");
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  return (
    <div className="space-y-8 py-4 md:py-2">
      <PageHeader
        eyebrow="案例库"
        title="让事务所历史判断可以被快速追溯、比较和继续调用"
        description="案例库是主 workflow 中唯一的列表事实源，面向连续审计客户追溯、新客户类案参考、项目交接与复核支撑。"
        actions={
          <Link
            href="/cases/new"
            className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            新建案例记录
          </Link>
        }
      />

      <SectionCard
        title="检索条件"
        description="先用结构字段缩小范围，再用关键词定位具体争议事项和判断链。"
        tone="muted"
      >
        <CaseSearchFilters
          values={filters}
          companies={options.companies}
          years={options.years}
          accounts={options.accounts}
          tags={options.tags}
          onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
          onSubmit={() => void loadCases()}
          onReset={() => {
            setFilters(defaultFilters);
            void loadCases(defaultFilters);
          }}
        />
      </SectionCard>

      <SectionCard
        title={loading ? "正在加载案例库..." : `案例结果 · ${cases.length} 条记录`}
        description={
          activeFilterCount
            ? `当前已启用 ${activeFilterCount} 个筛选条件，事务所项目成员会基于同一份历史记录开展追溯。`
            : "未启用筛选条件时，案例库展示全部案例资产，适合先理解事务所知识结构。"
        }
      >
        {message ? <p className="mb-4 text-sm font-medium text-rose-700">{message}</p> : null}
        <CaseResultsTable cases={cases} />
      </SectionCard>
    </div>
  );
}
