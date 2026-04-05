import os
from collections.abc import Iterable
from sqlalchemy.orm import Session

import models
from security import generate_salt, hash_password


DEMO_CASES = [
    {
        "title": "收入提前确认导致跨期错报",
        "company_code": "BJ-001",
        "company_name": "北方制造",
        "fiscal_year": "2025",
        "fiscal_period": "2025-Q4",
        "account_code": "6001",
        "account_name": "主营业务收入",
        "issue_type": "收入确认",
        "voucher_reference": "V-2025-188",
        "summary": "年末发货但客户尚未签收，财务已确认收入。",
        "background": "客户验收流程跨到次年1月，销售部门按出库节点推动财务确认收入。",
        "dispute_process": "财务认为风险报酬已转移，审计团队要求补充客户签收或控制权转移证据。",
        "judgment_basis": "依据企业会计准则第14号收入准则及合同条款，以控制权转移时点作为确认基础。",
        "conclusion": "冲回本期收入，待签收依据补齐后在次期确认。",
        "reference_entry": "借：主营业务收入 120000；贷：应收账款 120000",
        "attachment_links": [
            "https://example.com/contracts/revenue-control-transfer",
            "https://example.com/pbc/customer-receipt-proof",
        ],
        "tags": ["收入", "截止测试", "跨年度"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.manager",
    },
    {
        "title": "存货跌价准备计提不足",
        "company_code": "SH-101",
        "company_name": "华东商贸",
        "fiscal_year": "2024",
        "fiscal_period": "2024-12",
        "account_code": "1405",
        "account_name": "库存商品",
        "issue_type": "存货减值",
        "voucher_reference": "INV-2024-077",
        "summary": "长库龄库存未充分计提跌价准备。",
        "background": "多个SKU在库超过18个月，期后销售折价明显。",
        "dispute_process": "业务部门认为促销后可恢复销售，审计团队要求按可变现净值补测。",
        "judgment_basis": "结合期后售价、促销折扣和订单回款情况计算可变现净值。",
        "conclusion": "补提存货跌价准备并建立慢动销清单滚动复核机制。",
        "reference_entry": "借：资产减值损失；贷：存货跌价准备",
        "attachment_links": ["https://example.com/reports/inventory-aging"],
        "tags": ["存货", "减值", "期后事项"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "finance.lead",
    },
    {
        "title": "银行函证回函信息与账面不一致",
        "company_code": "GZ-305",
        "company_name": "广南科技",
        "fiscal_year": "2025",
        "fiscal_period": "2025-06",
        "account_code": "1002",
        "account_name": "银行存款",
        "issue_type": "资金核对",
        "voucher_reference": "BANK-2025-032",
        "summary": "函证回函余额低于账面余额，存在未达账项解释不完整。",
        "background": "财务在月末集中处理银企对账，部分手续费调整未及时入账。",
        "dispute_process": "财务先以未达账项解释差异，审计团队要求逐笔核对回单和手续费单据。",
        "judgment_basis": "根据银行回函、对账单、回单和银行手续费通知单交叉核验。",
        "conclusion": "补记手续费并清理长期未达账项，保留银行对账解释附件。",
        "reference_entry": "借：财务费用；贷：银行存款",
        "attachment_links": [
            "https://example.com/bank/confirmation-reply",
            "https://example.com/bank/reconciliation-sheet",
        ],
        "tags": ["银行", "函证", "未达账项"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "待审核",
        "created_by": "audit.senior",
    },
]

DEFAULT_SITE_CONTENT = {
    "homepage": {
        "title": "首页内容",
        "body": "用于首页展示的平台定位和核心信息。",
        "items": {
            "hero_eyebrow": "平台定位",
            "hero_title": "不是 ERP，也不替代审计判断，而是把跨年度、跨人员、跨项目的经验真正留存下来。",
            "hero_description": "业审追溯助手面向甲方财务人员、乙方审计团队和管理审核角色，围绕“问题发生 -> 结构化录入 -> 历史追溯 -> AI解释 -> 风险提示”构建审计与合规经验的闭环平台。",
            "boundary_cards": [
                {
                    "title": "与 ERP 的区别",
                    "description": "ERP 记录业务结果，业审追溯助手沉淀问题形成过程、争议路径和判断依据。",
                },
                {
                    "title": "与底稿系统的区别",
                    "description": "底稿反映本年项目执行，平台补足跨项目复用与后续追溯能力。",
                },
                {
                    "title": "平台核心价值",
                    "description": "让复杂问题不仅留下结论，还留下背景、依据、分录和附件链接。",
                },
            ],
            "role_values": [
                {
                    "title": "甲方财务人员",
                    "points": ["查询过往审计调整案例", "降低重复错账与口径偏差", "缩短新人上手周期"],
                },
                {
                    "title": "乙方审计团队",
                    "points": ["追溯历史争议事项与判断逻辑", "沉淀项目交接知识", "提高复杂事项判断一致性"],
                },
            ],
            "core_values": [
                {
                    "title": "经验沉淀",
                    "description": "把零散邮件、底稿口径和项目经验沉淀成可持续积累的案例资产。",
                },
                {
                    "title": "案例追溯",
                    "description": "支持按公司、年度、科目、标签和关键词反查同类问题与处理路径。",
                },
                {
                    "title": "风险提示",
                    "description": "把高频错账、调整趋势和热点科目前置到业务处理和项目交接阶段。",
                },
                {
                    "title": "智能推荐",
                    "description": "基于历史案例给出相似问题、处理结论和下一步核查建议。",
                },
            ],
            "flow_steps": ["问题发生", "结构化录入", "形成案例资产", "历史追溯查询", "AI辅助解释", "风险提示与前置预警"],
            "scenario_links": [
                {
                    "href": "/cases/new",
                    "title": "录入新的争议事项",
                    "description": "把问题背景、争议过程、依据和分录一次录全。",
                },
                {
                    "href": "/search",
                    "title": "追溯历史案例",
                    "description": "按公司、年份、科目、标签组合检索同类处理路径。",
                },
                {
                    "href": "/dashboard",
                    "title": "查看风险看板",
                    "description": "快速展示高频错账、热点科目和调整分布。",
                },
                {
                    "href": "/ai",
                    "title": "获取 AI 建议",
                    "description": "基于历史案例输出相似问题、解释和下一步建议。",
                },
            ],
        },
    }
}

DEFAULT_RISK_RULES = [
    {
        "name": "收入截止测试提醒",
        "description": "当主营业务收入在期末集中确认时，提醒复核签收和控制权转移依据。",
        "risk_level": "高",
        "trigger_account": "主营业务收入",
        "keyword_pattern": "签收,提前确认,截止,控制权",
        "suggestion": "优先核查签收单据、合同约定和控制权转移时点。",
        "enabled": True,
        "sort_order": 10,
    },
    {
        "name": "存货减值复核提醒",
        "description": "当库存商品库龄偏长或期后售价下滑时，提示补测可变现净值。",
        "risk_level": "中",
        "trigger_account": "库存商品",
        "keyword_pattern": "减值,库龄,可变现净值,跌价准备",
        "suggestion": "关注期后售价、滞销清单和减值测算过程。",
        "enabled": True,
        "sort_order": 20,
    },
]

DEFAULT_DISPLAY_CONFIGS = {
    "dashboard": {
        "description": "风险看板展示配置",
        "config_value": {
            "headline": "高频错账、热点科目与调整趋势",
            "subline": "用于答辩展示平台具备风险前移和经验复用价值。",
            "show_recent_cases": True,
        },
    },
    "ai": {
        "description": "AI 助手展示配置",
        "config_value": {
            "disclaimer": "AI 建议基于历史案例，不替代审计师和财务人员的专业判断。",
        },
    },
}


def _seed_cases(db: Session) -> None:
    if db.query(models.CaseRecord).first():
        return
    for item in DEMO_CASES:
        db.add(models.CaseRecord(**item))
    db.commit()


def _seed_site_content(db: Session) -> None:
    for section_key, payload in DEFAULT_SITE_CONTENT.items():
        existing = db.query(models.SiteContent).filter(models.SiteContent.section_key == section_key).first()
        if existing:
            continue
        db.add(
            models.SiteContent(
                section_key=section_key,
                title=payload["title"],
                body=payload["body"],
                items=payload["items"],
                is_published=True,
                updated_by="system",
            )
        )
    db.commit()


def _seed_risk_rules(db: Session) -> None:
    if db.query(models.RiskRule).first():
        return
    for item in DEFAULT_RISK_RULES:
        db.add(models.RiskRule(**item, updated_by="system"))
    db.commit()


def _seed_display_configs(db: Session) -> None:
    for config_key, payload in DEFAULT_DISPLAY_CONFIGS.items():
        existing = db.query(models.DisplayConfig).filter(models.DisplayConfig.config_key == config_key).first()
        if existing:
            continue
        db.add(
            models.DisplayConfig(
                config_key=config_key,
                description=payload["description"],
                config_value=payload["config_value"],
                updated_by="system",
            )
        )
    db.commit()


def _seed_admin_user(db: Session) -> None:
    username = os.getenv("ADMIN_USERNAME", "admin")
    password = os.getenv("ADMIN_PASSWORD", "admin123")
    existing = db.query(models.AdminUser).filter(models.AdminUser.username == username).first()
    if existing:
        return
    salt = generate_salt()
    db.add(
        models.AdminUser(
            username=username,
            password_salt=salt,
            password_hash=hash_password(password, salt),
            is_active=True,
        )
    )
    db.commit()


def seed_demo_cases(db: Session) -> None:
    _seed_cases(db)
    _seed_site_content(db)
    _seed_risk_rules(db)
    _seed_display_configs(db)
    _seed_admin_user(db)
