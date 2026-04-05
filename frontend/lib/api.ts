import type {
  AdminLoginResponse,
  AdminMe,
  AssistantResponse,
  CaseFilters,
  CasePayload,
  CaseRecord,
  DashboardData,
  DisplayConfig,
  FilterOptions,
  RiskRule,
  SiteContent,
  StatsData,
} from "@/lib/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(
  /\/$/,
  "",
);

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function buildQueryString(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(text || "API request failed", response.status);
  }

  return response.json() as Promise<T>;
}

export function getAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem("audit-trace-admin-token") || "";
}

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("audit-trace-admin-token", token);
  }
}

export function clearAdminToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("audit-trace-admin-token");
  }
}

function adminHeaders(token?: string) {
  const resolvedToken = token || getAdminToken();
  return resolvedToken
    ? ({ Authorization: `Bearer ${resolvedToken}` } as Record<string, string>)
    : ({} as Record<string, string>);
}

export async function fetchStats() {
  return apiFetch<StatsData>("/stats");
}

export async function fetchDashboard() {
  return apiFetch<DashboardData>("/dashboard");
}

export async function fetchFilterOptions() {
  return apiFetch<FilterOptions>("/filters");
}

export async function fetchCases(filters: CaseFilters = {}) {
  return apiFetch<CaseRecord[]>(`/cases${buildQueryString(filters)}`);
}

export async function fetchCase(caseId: number) {
  return apiFetch<CaseRecord>(`/cases/${caseId}`);
}

export async function createCase(payload: CasePayload) {
  return apiFetch<CaseRecord>("/cases", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function askAssistant(question: string) {
  return apiFetch<AssistantResponse>("/assistant/query", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function fetchSiteContent(sectionKey: string) {
  return apiFetch<SiteContent>(`/site-content/${sectionKey}`);
}

export async function fetchRiskRules() {
  return apiFetch<RiskRule[]>("/risk-rules");
}

export async function fetchDisplayConfig(configKey: string) {
  return apiFetch<DisplayConfig>(`/display-configs/${configKey}`);
}

export async function adminLogin(username: string, password: string) {
  return apiFetch<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchAdminMe(token?: string) {
  return apiFetch<AdminMe>("/admin/me", {
    headers: adminHeaders(token),
  });
}

export async function fetchAdminSiteContent(sectionKey: string, token?: string) {
  return apiFetch<SiteContent>(`/admin/site-content/${sectionKey}`, {
    headers: adminHeaders(token),
  });
}

export async function updateAdminSiteContent(
  sectionKey: string,
  payload: Pick<SiteContent, "title" | "body" | "items" | "is_published">,
  token?: string,
) {
  return apiFetch<SiteContent>(`/admin/site-content/${sectionKey}`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCase(caseId: number, payload: CasePayload, token?: string) {
  return apiFetch<CaseRecord>(`/admin/cases/${caseId}`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminRiskRules(token?: string) {
  return apiFetch<RiskRule[]>("/admin/risk-rules", {
    headers: adminHeaders(token),
  });
}

export async function createAdminRiskRule(
  payload: Omit<RiskRule, "id" | "updated_by" | "created_at" | "updated_at">,
  token?: string,
) {
  return apiFetch<RiskRule>("/admin/risk-rules", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function updateAdminRiskRule(
  ruleId: number,
  payload: Omit<RiskRule, "id" | "updated_by" | "created_at" | "updated_at">,
  token?: string,
) {
  return apiFetch<RiskRule>(`/admin/risk-rules/${ruleId}`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminDisplayConfig(configKey: string, token?: string) {
  return apiFetch<DisplayConfig>(`/admin/display-configs/${configKey}`, {
    headers: adminHeaders(token),
  });
}

export async function updateAdminDisplayConfig(
  configKey: string,
  payload: Pick<DisplayConfig, "description" | "config_value">,
  token?: string,
) {
  return apiFetch<DisplayConfig>(`/admin/display-configs/${configKey}`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload),
  });
}
