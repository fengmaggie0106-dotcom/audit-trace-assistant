export type CaseRecord = {
  id: number;
  title: string;
  company_code: string;
  company_name: string;
  fiscal_year: string;
  fiscal_period: string;
  account_code: string;
  account_name: string;
  issue_type: string;
  voucher_reference?: string | null;
  summary: string;
  background: string;
  dispute_process: string;
  judgment_basis: string;
  conclusion: string;
  reference_entry: string;
  attachment_links: string[];
  tags: string[];
  risk_level: string;
  source_type: string;
  status: string;
  created_by: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FilterOptions = {
  companies: string[];
  years: string[];
  accounts: string[];
  tags: string[];
};

export type DistributionItem = {
  label: string;
  value: number;
};

export type DashboardData = {
  total_cases: number;
  high_risk_cases: number;
  confirmed_cases: number;
  pending_cases: number;
  issue_type_distribution: DistributionItem[];
  risk_distribution: DistributionItem[];
  hot_accounts: DistributionItem[];
  yearly_trend: DistributionItem[];
  recent_cases: CaseRecord[];
};

export type StatsData = {
  total_cases: number;
  high_risk_cases: number;
  confirmed_cases: number;
};

export type AssistantMatchedCase = {
  id: number;
  title: string;
  company_name: string;
  fiscal_year: string;
  account_name: string;
  conclusion: string;
  risk_level: string;
  tags: string[];
};

export type AssistantResponse = {
  answer: string;
  matched_cases: AssistantMatchedCase[];
  next_actions: string[];
};

export type SiteContent = {
  section_key: string;
  title: string;
  body: string;
  items: Record<string, unknown>;
  is_published: boolean;
  updated_by: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type RiskRule = {
  id: number;
  name: string;
  description: string;
  risk_level: string;
  trigger_account: string;
  keyword_pattern: string;
  suggestion: string;
  enabled: boolean;
  sort_order: number;
  updated_by: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type DisplayConfig = {
  config_key: string;
  description: string;
  config_value: Record<string, unknown>;
  updated_by: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminLoginResponse = {
  token: string;
  username: string;
  expires_at: string;
};

export type AdminMe = {
  username: string;
  is_active: boolean;
};

export type CaseFilters = {
  keyword?: string;
  company?: string;
  year?: string;
  account?: string;
  tag?: string;
};

export type CasePayload = Omit<CaseRecord, "id" | "created_at" | "updated_at">;
