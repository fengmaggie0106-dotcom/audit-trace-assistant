import { FieldBlock, controlClassName } from "@/components/ui/form-controls";

type SearchFilterValues = {
  keyword: string;
  company: string;
  year: string;
  account: string;
  tag: string;
};

type SearchFilterProps = {
  values: SearchFilterValues;
  companies: string[];
  years: string[];
  accounts: string[];
  tags: string[];
  onChange: (field: keyof SearchFilterValues, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export function CaseSearchFilters({
  values,
  companies,
  years,
  accounts,
  tags,
  onChange,
  onSubmit,
  onReset,
}: SearchFilterProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <FieldBlock
            label="关键词"
            hint="适合先用争议事项、判断口径或会计处理关键词缩小范围。"
          >
            <input
              className={controlClassName}
              value={values.keyword}
              onChange={(event) => onChange("keyword", event.target.value)}
              placeholder="例如：收入提前确认"
            />
          </FieldBlock>
        </div>

        <FieldBlock label="公司">
          <select
            className={controlClassName}
            value={values.company}
            onChange={(event) => onChange("company", event.target.value)}
          >
            <option value="">全部公司</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </FieldBlock>

        <FieldBlock label="年度">
          <select
            className={controlClassName}
            value={values.year}
            onChange={(event) => onChange("year", event.target.value)}
          >
            <option value="">全部年度</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </FieldBlock>

        <FieldBlock label="标签">
          <select
            className={controlClassName}
            value={values.tag}
            onChange={(event) => onChange("tag", event.target.value)}
          >
            <option value="">全部标签</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </FieldBlock>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldBlock label="科目">
          <select
            className={controlClassName}
            value={values.account}
            onChange={(event) => onChange("account", event.target.value)}
          >
            <option value="">全部科目</option>
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </FieldBlock>

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--foreground-soft)]"
          >
            应用筛选
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-strong)] hover:text-[var(--accent-strong)]"
          >
            清空条件
          </button>
        </div>
      </div>
    </div>
  );
}
