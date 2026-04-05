from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class CaseBase(BaseModel):
    title: str
    company_code: str
    company_name: str
    fiscal_year: str
    fiscal_period: str
    account_code: str
    account_name: str
    issue_type: str
    voucher_reference: Optional[str] = None
    summary: str
    background: str
    dispute_process: str
    judgment_basis: str
    conclusion: str
    reference_entry: str
    attachment_links: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    risk_level: str = "中"
    source_type: str = "manual"
    status: str = "待审核"
    created_by: str = "system"


class CaseCreate(CaseBase):
    pass


class CaseUpdate(CaseBase):
    pass


class CaseResponse(CaseBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class FilterOptions(BaseModel):
    companies: list[str]
    years: list[str]
    accounts: list[str]
    tags: list[str]


class DistributionItem(BaseModel):
    label: str
    value: int


class DashboardResponse(BaseModel):
    total_cases: int
    high_risk_cases: int
    confirmed_cases: int
    pending_cases: int
    issue_type_distribution: list[DistributionItem]
    risk_distribution: list[DistributionItem]
    hot_accounts: list[DistributionItem]
    yearly_trend: list[DistributionItem]
    recent_cases: list[CaseResponse]


class AssistantQuery(BaseModel):
    question: str


class AssistantMatchedCase(BaseModel):
    id: int
    title: str
    company_name: str
    fiscal_year: str
    account_name: str
    conclusion: str
    risk_level: str
    tags: list[str] = Field(default_factory=list)


class AssistantResponse(BaseModel):
    answer: str
    matched_cases: list[AssistantMatchedCase]
    next_actions: list[str]


class SiteContentUpsert(BaseModel):
    title: str
    body: str = ""
    items: dict[str, Any] = Field(default_factory=dict)
    is_published: bool = True


class SiteContentResponse(SiteContentUpsert):
    section_key: str
    updated_by: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class RiskRuleBase(BaseModel):
    name: str
    description: str
    risk_level: str = "中"
    trigger_account: str = ""
    keyword_pattern: str = ""
    suggestion: str
    enabled: bool = True
    sort_order: int = 100


class RiskRuleCreate(RiskRuleBase):
    pass


class RiskRuleUpdate(RiskRuleBase):
    pass


class RiskRuleResponse(RiskRuleBase):
    id: int
    updated_by: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DisplayConfigUpsert(BaseModel):
    description: str = ""
    config_value: dict[str, Any] = Field(default_factory=dict)


class DisplayConfigResponse(DisplayConfigUpsert):
    config_key: str
    updated_by: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    username: str
    expires_at: datetime


class AdminMeResponse(BaseModel):
    username: str
    is_active: bool
