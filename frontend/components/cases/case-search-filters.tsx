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

function inputClassName() {
  return "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-strong)] focus:ring-4 focus:ring-[color:rgba(20,184,166,0.12)]";
}

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
    <div className="grid gap-4 lg:grid-cols-5">
      <input
        className={inputClassName()}
        value={values.keyword}
        onChange={(event) => onChange("keyword", event.target.value)}
        placeholder="关键词：如 收入提前确认"
      />

      <select
        className={inputClassName()}
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

      <select
        className={inputClassName()}
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

      <select
        className={inputClassName()}
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

      <select
        className={inputClassName()}
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

      <div className="flex flex-wrap gap-3 lg:col-span-5">
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
          重置条件
        </button>
      </div>
    </div>
  );
}
