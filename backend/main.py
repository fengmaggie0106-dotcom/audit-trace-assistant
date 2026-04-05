import os
import re
from collections import Counter

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_
from sqlalchemy.orm import Session

import models
import schemas
from auth import get_current_admin
from database import SessionLocal, engine
from seed import seed_demo_cases
from security import generate_session_token, hash_session_token, session_expiry, utc_now, verify_password


models.Base.metadata.create_all(bind=engine)


def get_allowed_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS", "*")
    origins = [item.strip() for item in raw_origins.split(",") if item.strip()]
    return origins or ["*"]


app = FastAPI(
    title="Audit Trace Assistant API",
    description="API for the 业审追溯助手 formal web platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_seeded() -> None:
    db = SessionLocal()
    try:
        seed_demo_cases(db)
    finally:
        db.close()


ensure_seeded()


def build_case_query(
    db: Session,
    keyword: str | None = None,
    company: str | None = None,
    year: str | None = None,
    account: str | None = None,
):
    query = db.query(models.CaseRecord)

    if company:
        like_value = f"%{company}%"
        query = query.filter(
            or_(
                models.CaseRecord.company_code.ilike(like_value),
                models.CaseRecord.company_name.ilike(like_value),
            )
        )

    if year:
        query = query.filter(models.CaseRecord.fiscal_year == year)

    if account:
        like_value = f"%{account}%"
        query = query.filter(
            or_(
                models.CaseRecord.account_code.ilike(like_value),
                models.CaseRecord.account_name.ilike(like_value),
            )
        )

    if keyword:
        like_value = f"%{keyword}%"
        query = query.filter(
            or_(
                models.CaseRecord.title.ilike(like_value),
                models.CaseRecord.summary.ilike(like_value),
                models.CaseRecord.background.ilike(like_value),
                models.CaseRecord.dispute_process.ilike(like_value),
                models.CaseRecord.judgment_basis.ilike(like_value),
                models.CaseRecord.conclusion.ilike(like_value),
                models.CaseRecord.issue_type.ilike(like_value),
                models.CaseRecord.company_name.ilike(like_value),
                models.CaseRecord.account_name.ilike(like_value),
            )
        )

    return query.order_by(models.CaseRecord.updated_at.desc(), models.CaseRecord.id.desc())


def apply_tag_filter(cases: list[models.CaseRecord], tag: str | None = None) -> list[models.CaseRecord]:
    if not tag:
        return cases
    return [case for case in cases if tag in (case.tags or [])]


def build_distribution(counter: Counter, limit: int | None = None) -> list[schemas.DistributionItem]:
    items = counter.most_common(limit)
    return [schemas.DistributionItem(label=label, value=value) for label, value in items]


def tokenize_question(question: str) -> list[str]:
    tokens = re.findall(r"[\u4e00-\u9fffA-Za-z0-9]+", question.lower())
    return [token for token in tokens if len(token) > 1]


def score_case(case: models.CaseRecord, tokens: list[str]) -> int:
    searchable = " ".join(
        [
            case.title,
            case.company_name,
            case.account_name,
            case.issue_type,
            case.summary,
            case.background,
            case.dispute_process,
            case.judgment_basis,
            case.conclusion,
            " ".join(case.tags or []),
        ]
    ).lower()
    score = sum(2 for token in tokens if token in searchable)
    if case.risk_level == "高":
        score += 1
    return score


def upsert_site_content(
    db: Session,
    section_key: str,
    payload: schemas.SiteContentUpsert,
    updated_by: str,
) -> models.SiteContent:
    content = db.query(models.SiteContent).filter(models.SiteContent.section_key == section_key).first()
    if not content:
        content = models.SiteContent(section_key=section_key)
        db.add(content)

    content.title = payload.title
    content.body = payload.body
    content.items = payload.items
    content.is_published = payload.is_published
    content.updated_by = updated_by
    db.commit()
    db.refresh(content)
    return content


def upsert_display_config(
    db: Session,
    config_key: str,
    payload: schemas.DisplayConfigUpsert,
    updated_by: str,
) -> models.DisplayConfig:
    config = db.query(models.DisplayConfig).filter(models.DisplayConfig.config_key == config_key).first()
    if not config:
        config = models.DisplayConfig(config_key=config_key)
        db.add(config)

    config.description = payload.description
    config.config_value = payload.config_value
    config.updated_by = updated_by
    db.commit()
    db.refresh(config)
    return config


@app.get("/")
def root():
    return {"message": "Audit Trace Assistant API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/admin/login", response_model=schemas.AdminLoginResponse)
def admin_login(payload: schemas.AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.query(models.AdminUser).filter(models.AdminUser.username == payload.username).first()
    if not admin or not admin.is_active:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(payload.password, admin.password_salt, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    raw_token = generate_session_token()
    session = models.AdminSession(
        admin_user_id=admin.id,
        token_hash=hash_session_token(raw_token),
        expires_at=session_expiry(),
    )
    admin.last_login_at = utc_now()
    db.add(session)
    db.commit()
    db.refresh(session)

    return schemas.AdminLoginResponse(
        token=raw_token,
        username=admin.username,
        expires_at=session.expires_at,
    )


@app.get("/admin/me", response_model=schemas.AdminMeResponse)
def admin_me(admin: models.AdminUser = Depends(get_current_admin)):
    return schemas.AdminMeResponse(username=admin.username, is_active=admin.is_active)


@app.get("/cases", response_model=list[schemas.CaseResponse])
def list_cases(
    keyword: str | None = Query(default=None),
    company: str | None = Query(default=None),
    year: str | None = Query(default=None),
    account: str | None = Query(default=None),
    tag: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    cases = build_case_query(db, keyword=keyword, company=company, year=year, account=account).all()
    return apply_tag_filter(cases, tag=tag)


@app.get("/cases/{case_id}", response_model=schemas.CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(models.CaseRecord).filter(models.CaseRecord.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@app.post("/cases", response_model=schemas.CaseResponse)
def create_case(payload: schemas.CaseCreate, db: Session = Depends(get_db)):
    new_case = models.CaseRecord(**payload.model_dump())
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case


@app.put("/admin/cases/{case_id}", response_model=schemas.CaseResponse)
def update_case(
    case_id: int,
    payload: schemas.CaseUpdate,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    case = db.query(models.CaseRecord).filter(models.CaseRecord.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    for key, value in payload.model_dump().items():
        setattr(case, key, value)
    case.created_by = admin.username
    db.commit()
    db.refresh(case)
    return case


@app.get("/filters", response_model=schemas.FilterOptions)
def get_filter_options(db: Session = Depends(get_db)):
    cases = db.query(models.CaseRecord).all()
    company_values = sorted({case.company_name for case in cases})
    account_values = sorted({case.account_name for case in cases})
    year_values = sorted({case.fiscal_year for case in cases}, reverse=True)
    tag_values = sorted({tag for case in cases for tag in (case.tags or [])})
    return schemas.FilterOptions(
        companies=company_values,
        years=year_values,
        accounts=account_values,
        tags=tag_values,
    )


@app.get("/site-content/{section_key}", response_model=schemas.SiteContentResponse)
def get_site_content(section_key: str, db: Session = Depends(get_db)):
    content = (
        db.query(models.SiteContent)
        .filter(models.SiteContent.section_key == section_key, models.SiteContent.is_published.is_(True))
        .first()
    )
    if not content:
        raise HTTPException(status_code=404, detail="Site content not found")
    return content


@app.get("/admin/site-content/{section_key}", response_model=schemas.SiteContentResponse)
def get_site_content_admin(
    section_key: str,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    content = db.query(models.SiteContent).filter(models.SiteContent.section_key == section_key).first()
    if not content:
        raise HTTPException(status_code=404, detail="Site content not found")
    return content


@app.put("/admin/site-content/{section_key}", response_model=schemas.SiteContentResponse)
def update_site_content(
    section_key: str,
    payload: schemas.SiteContentUpsert,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    return upsert_site_content(db, section_key, payload, admin.username)


@app.get("/risk-rules", response_model=list[schemas.RiskRuleResponse])
def list_risk_rules(db: Session = Depends(get_db)):
    return (
        db.query(models.RiskRule)
        .filter(models.RiskRule.enabled.is_(True))
        .order_by(models.RiskRule.sort_order.asc(), models.RiskRule.id.asc())
        .all()
    )


@app.get("/admin/risk-rules", response_model=list[schemas.RiskRuleResponse])
def list_risk_rules_admin(
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    return db.query(models.RiskRule).order_by(models.RiskRule.sort_order.asc(), models.RiskRule.id.asc()).all()


@app.post("/admin/risk-rules", response_model=schemas.RiskRuleResponse)
def create_risk_rule(
    payload: schemas.RiskRuleCreate,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    rule = models.RiskRule(**payload.model_dump(), updated_by=admin.username)
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


@app.put("/admin/risk-rules/{rule_id}", response_model=schemas.RiskRuleResponse)
def update_risk_rule(
    rule_id: int,
    payload: schemas.RiskRuleUpdate,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    rule = db.query(models.RiskRule).filter(models.RiskRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Risk rule not found")
    for key, value in payload.model_dump().items():
        setattr(rule, key, value)
    rule.updated_by = admin.username
    db.commit()
    db.refresh(rule)
    return rule


@app.get("/display-configs/{config_key}", response_model=schemas.DisplayConfigResponse)
def get_display_config(config_key: str, db: Session = Depends(get_db)):
    config = db.query(models.DisplayConfig).filter(models.DisplayConfig.config_key == config_key).first()
    if not config:
        raise HTTPException(status_code=404, detail="Display config not found")
    return config


@app.get("/admin/display-configs/{config_key}", response_model=schemas.DisplayConfigResponse)
def get_display_config_admin(
    config_key: str,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    return get_display_config(config_key, db)


@app.put("/admin/display-configs/{config_key}", response_model=schemas.DisplayConfigResponse)
def update_display_config(
    config_key: str,
    payload: schemas.DisplayConfigUpsert,
    db: Session = Depends(get_db),
    admin: models.AdminUser = Depends(get_current_admin),
):
    return upsert_display_config(db, config_key, payload, admin.username)


@app.get("/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    cases = db.query(models.CaseRecord).order_by(models.CaseRecord.updated_at.desc()).all()
    issue_counter = Counter(case.issue_type for case in cases)
    risk_counter = Counter(case.risk_level for case in cases)
    account_counter = Counter(f"{case.account_code} {case.account_name}" for case in cases)
    year_counter = Counter(case.fiscal_year for case in cases)
    confirmed_cases = sum(case.status == "已确认" for case in cases)
    high_risk_cases = sum(case.risk_level == "高" for case in cases)
    return schemas.DashboardResponse(
        total_cases=len(cases),
        high_risk_cases=high_risk_cases,
        confirmed_cases=confirmed_cases,
        pending_cases=len(cases) - confirmed_cases,
        issue_type_distribution=build_distribution(issue_counter, limit=6),
        risk_distribution=build_distribution(risk_counter, limit=4),
        hot_accounts=build_distribution(account_counter, limit=5),
        yearly_trend=build_distribution(year_counter),
        recent_cases=cases[:5],
    )


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    dashboard = get_dashboard(db)
    return {
        "total_cases": dashboard.total_cases,
        "high_risk_cases": dashboard.high_risk_cases,
        "confirmed_cases": dashboard.confirmed_cases,
    }


@app.post("/assistant/query", response_model=schemas.AssistantResponse)
def assistant_query(payload: schemas.AssistantQuery, db: Session = Depends(get_db)):
    tokens = tokenize_question(payload.question)
    cases = db.query(models.CaseRecord).all()
    rules = (
        db.query(models.RiskRule)
        .filter(models.RiskRule.enabled.is_(True))
        .order_by(models.RiskRule.sort_order.asc())
        .all()
    )

    ranked_cases = sorted(cases, key=lambda case: score_case(case, tokens), reverse=True)
    matched_cases = [case for case in ranked_cases if score_case(case, tokens) > 0][:3]

    matched_rule_suggestions = []
    for rule in rules:
        patterns = [item.strip().lower() for item in rule.keyword_pattern.split(",") if item.strip()]
        if any(pattern in payload.question.lower() for pattern in patterns):
            matched_rule_suggestions.append(rule.suggestion)

    if not matched_cases:
        next_actions = matched_rule_suggestions or [
            "先在历史查询页按公司和科目缩小范围",
            "补录问题背景、争议过程和判断依据",
            "将新增案例纳入知识库后再进行二次检索",
        ]
        return schemas.AssistantResponse(
            answer="当前问题在案例库中没有直接命中。建议先按公司、年度、科目筛选后补录判断依据和争议过程，再形成可追溯案例。",
            matched_cases=[],
            next_actions=next_actions,
        )

    lead_case = matched_cases[0]
    answer = (
        f"基于历史案例，当前问题更接近“{lead_case.title}”。"
        f" 该案例发生在 {lead_case.company_name} {lead_case.fiscal_year} 年，"
        f"核心处理结论是：{lead_case.conclusion}"
        " 建议优先核查问题背景是否一致，再比对判断依据和参考分录。"
    )

    next_actions = matched_rule_suggestions or [
        "核对本次问题与历史案例的业务背景是否一致",
        "重点复核争议过程中的判断依据和支持材料",
        "如处理结论拟采纳，请同步补录本次附件和分录依据",
    ]

    return schemas.AssistantResponse(
        answer=answer,
        matched_cases=[
            schemas.AssistantMatchedCase(
                id=case.id,
                title=case.title,
                company_name=case.company_name,
                fiscal_year=case.fiscal_year,
                account_name=case.account_name,
                conclusion=case.conclusion,
                risk_level=case.risk_level,
                tags=case.tags or [],
            )
            for case in matched_cases
        ],
        next_actions=next_actions,
    )
