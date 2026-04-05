"use client";

import { useEffect, useState } from "react";

import { fetchCases, fetchFilterOptions } from "@/lib/api";
import type { CaseRecord, FilterOptions } from "@/lib/types";
import { CaseResultsTable } from "@/components/cases/case-results-table";
import { CaseSearchFilters } from "@/components/cases/case-search-filters";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

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

  const loadCases = async (activeFilters = filters) => {
    setLoading(true);
    setMessage("");
    try {
      const data = await fetchCases(activeFilters);
      setCases(data);
    } catch (error) {
      console.error(error);
      setMessage("案例查询失败，请确认后端服务已启动。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function bootstrap() {
      try {
        const [optionData, caseData] = await Promise.all([
          fetchFilterOptions(),
          fetchCases(),
        ]);
        setOptions(optionData);
        setCases(caseData);
      } catch (error) {
        console.error(error);
        setMessage("初始化查询页失败，请检查接口状态。");
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  return (
    <div className="space-y-8 py-6 md:py-8">
      <PageHeader
        eyebrow="历史查询"
        title="围绕公司、年度、科目、关键词和标签，快速反查同类问题的处理路径。"
        description="查询页不是普通列表，而是案例追溯入口。评委可以从这里直接跳到任意案例详情，看到背景、争议过程、依据、结论和参考分录。"
      />

      <SectionCard
        title="筛选条件"
        description="优先用结构化字段定位，再用关键词和标签细化到具体争议事项。"
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
        title={loading ? "正在查询案例..." : `查询结果（${cases.length}）`}
        description="支持从结果表格直接进入详情页，演示完整追溯链路。"
      >
        {message ? (
          <p className="mb-4 text-sm font-medium text-rose-700">{message}</p>
        ) : null}
        <CaseResultsTable cases={cases} />
      </SectionCard>
    </div>
  );
}
