import os

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
        "summary": "年末发货但客户尚未签收，财务已按照出库节点确认收入。",
        "background": "客户验收流程跨到次年 1 月，销售部门按发货节奏推动财务确认收入。",
        "dispute_process": "财务认为风险报酬已转移，审计团队要求补充客户签收或控制权转移证据。",
        "judgment_basis": "依据企业会计准则第 14 号收入准则及合同条款，以控制权转移时点作为确认基础。",
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
        "background": "多个 SKU 在库超过 18 个月，期后销售折价明显。",
        "dispute_process": "业务部门认为促销后可恢复销售，审计团队要求按可变现净值补测。",
        "judgment_basis": "结合期后售价、促销折扣和订单回款情况计算可变现净值。",
        "conclusion": "补提存货跌价准备并建立慢动销清单滚动复核机制。",
        "reference_entry": "借：资产减值损失；贷：存货跌价准备",
        "attachment_links": ["https://example.com/reports/inventory-aging"],
        "tags": ["存货", "减值", "期后事项"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.lead",
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
    {
        "title": "费用预提跨期导致成本少计",
        "company_code": "SZ-220",
        "company_name": "深港物流",
        "fiscal_year": "2025",
        "fiscal_period": "2025-12",
        "account_code": "6602",
        "account_name": "管理费用",
        "issue_type": "费用截止",
        "voucher_reference": "EXP-2025-411",
        "summary": "年末已发生咨询服务费未预提，导致当期费用少计。",
        "background": "服务已于 12 月完成，但供应商发票在次年 1 月才开具并入账。",
        "dispute_process": "财务以未收到发票为由暂不确认费用，审计团队要求按权责发生制补提。",
        "judgment_basis": "依据权责发生制和服务完成确认时点，结合合同与验收邮件认定费用归属期。",
        "conclusion": "补提本期费用并确认应付暂估，次年发票入账时转回暂估。",
        "reference_entry": "借：管理费用；贷：其他应付款-暂估应付",
        "attachment_links": [
            "https://example.com/contracts/consulting-service",
            "https://example.com/pbc/service-acceptance-email",
        ],
        "tags": ["费用", "截止测试", "暂估"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.manager",
    },
    {
        "title": "研发支出资本化时点判断偏早",
        "company_code": "HZ-118",
        "company_name": "杭芯软件",
        "fiscal_year": "2024",
        "fiscal_period": "2024-Q3",
        "account_code": "1701",
        "account_name": "开发支出",
        "issue_type": "研发资本化",
        "voucher_reference": "RD-2024-215",
        "summary": "项目尚未达到技术可行状态即转入开发支出资本化。",
        "background": "研发部门为了改善利润指标，在阶段评审未完成前就启动资本化处理。",
        "dispute_process": "管理层强调项目商业前景明确，审计团队要求提供技术可行性和资源匹配证据。",
        "judgment_basis": "依据研发支出资本化五项条件，重点核查技术可行性、资源保障和未来经济利益证据。",
        "conclusion": "将不符合条件部分转回费用化，并建立资本化评审清单。",
        "reference_entry": "借：研发费用；贷：开发支出",
        "attachment_links": [
            "https://example.com/rd/stage-review-minutes",
            "https://example.com/rd/capitalization-checklist",
        ],
        "tags": ["研发", "资本化", "技术可行性"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "待审核",
        "created_by": "audit.specialist",
    },
    {
        "title": "关联方往来长期挂账未充分计提减值",
        "company_code": "NJ-509",
        "company_name": "宁远集团",
        "fiscal_year": "2025",
        "fiscal_period": "2025-Q2",
        "account_code": "1123",
        "account_name": "其他应收款",
        "issue_type": "往来减值",
        "voucher_reference": "AR-2025-089",
        "summary": "关联方借款长期挂账且无明确回款计划，减值测试不足。",
        "background": "集团内部资金调拨频繁，部分历史借款多年未清理。",
        "dispute_process": "财务认为关联方整体可控无需计提，审计团队要求结合回款能力与清偿安排重新评估。",
        "judgment_basis": "结合账龄、后续回款、还款承诺和关联方经营情况判断信用风险是否显著增加。",
        "conclusion": "补提信用减值准备，并要求管理层提供后续回款安排。",
        "reference_entry": "借：信用减值损失；贷：坏账准备",
        "attachment_links": [
            "https://example.com/related-party/aging-report",
            "https://example.com/related-party/repayment-plan",
        ],
        "tags": ["关联方", "往来", "减值"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.manager",
    },
    {
        "title": "政府补助确认时点与收益匹配不一致",
        "company_code": "CD-066",
        "company_name": "成川装备",
        "fiscal_year": "2024",
        "fiscal_period": "2024-11",
        "account_code": "6051",
        "account_name": "其他收益",
        "issue_type": "政府补助",
        "voucher_reference": "GOV-2024-043",
        "summary": "政府补助在批复阶段一次性确认收益，未按资产使用期分摊。",
        "background": "公司取得设备补助后，财务为提升利润在当期全额确认。",
        "dispute_process": "管理层认为批复即满足确认条件，审计团队关注补助与对应资产折旧期的匹配关系。",
        "judgment_basis": "依据政府补助准则，区分与资产相关或与收益相关，并按受益期间系统确认。",
        "conclusion": "调整为递延收益并按资产折旧期分摊至损益。",
        "reference_entry": "借：其他收益；贷：递延收益",
        "attachment_links": [
            "https://example.com/government/subsidy-approval",
            "https://example.com/government/asset-schedule",
        ],
        "tags": ["政府补助", "递延收益", "收益匹配"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.senior",
    },
    {
        "title": "质保预计负债计提依据不足",
        "company_code": "WH-330",
        "company_name": "武汉设备",
        "fiscal_year": "2025",
        "fiscal_period": "2025-Q1",
        "account_code": "2611",
        "account_name": "预计负债",
        "issue_type": "预计负债",
        "voucher_reference": "PROV-2025-017",
        "summary": "售后质保成本连续上升，但预计负债计提比例沿用历史低值。",
        "background": "本期新型号设备故障率明显上升，售后返修和备件支出增加。",
        "dispute_process": "业务部门认为故障率只是短期波动，审计团队要求重新测算质保成本区间。",
        "judgment_basis": "根据期后维修数据、历史返修率和在保设备规模重新估算最佳负债金额。",
        "conclusion": "提高质保预计负债计提比例，并建立按产品线复盘机制。",
        "reference_entry": "借：销售费用；贷：预计负债",
        "attachment_links": [
            "https://example.com/warranty/repair-report",
            "https://example.com/warranty/product-failure-rate",
        ],
        "tags": ["质保", "预计负债", "售后成本"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "待审核",
        "created_by": "audit.senior",
    },
    {
        "title": "商誉减值测试关键假设过于乐观",
        "company_code": "SU-715",
        "company_name": "苏新消费",
        "fiscal_year": "2025",
        "fiscal_period": "2025-12",
        "account_code": "1801",
        "account_name": "商誉",
        "issue_type": "商誉减值",
        "voucher_reference": "GW-2025-052",
        "summary": "现金流预测继续沿用高增长假设，与门店实际经营表现不匹配。",
        "background": "被收购业务连续两年未达成预算，但管理层仍采用并购时的扩张节奏预测未来收入。",
        "dispute_process": "管理层强调行业回暖在即，审计团队要求补充预算审批依据和敏感性分析。",
        "judgment_basis": "依据资产组减值测试要求，复核现金流预测、增长率、折现率与外部市场数据的一致性。",
        "conclusion": "下调未来现金流预测并补计商誉减值，保留关键参数敏感性分析底稿。",
        "reference_entry": "借：资产减值损失；贷：商誉",
        "attachment_links": [
            "https://example.com/goodwill/cashflow-forecast",
            "https://example.com/goodwill/sensitivity-analysis",
        ],
        "tags": ["商誉", "减值测试", "关键假设"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.partner.office",
    },
    {
        "title": "应收账款函证未回函替代程序执行不足",
        "company_code": "XM-188",
        "company_name": "厦门医械",
        "fiscal_year": "2024",
        "fiscal_period": "2024-Q4",
        "account_code": "1122",
        "account_name": "应收账款",
        "issue_type": "函证替代",
        "voucher_reference": "ARCONF-2024-091",
        "summary": "大额客户函证未回函后，仅查看销售台账，替代程序支撑不足。",
        "background": "客户集中在海外，年末回函率偏低，项目组时间紧张导致替代程序执行简化。",
        "dispute_process": "项目组认为期后回款已能覆盖风险，复核经理要求补充签收、对账和回款链路证据。",
        "judgment_basis": "依据函证审计程序要求，对未回函项目执行期后回款、发货签收、对账单等替代程序并形成交叉验证。",
        "conclusion": "补做替代程序并按客户维度整理证据链，未取得充分证据的余额列入重点复核清单。",
        "reference_entry": "借：无需调整分录；贷：补充审计程序记录",
        "attachment_links": [
            "https://example.com/ar/post-collection",
            "https://example.com/ar/customer-reconciliation",
        ],
        "tags": ["应收账款", "函证", "替代程序"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.review.manager",
    },
    {
        "title": "在建工程转固时点滞后导致折旧少计",
        "company_code": "CQ-420",
        "company_name": "重川能源",
        "fiscal_year": "2025",
        "fiscal_period": "2025-Q3",
        "account_code": "1604",
        "account_name": "在建工程",
        "issue_type": "转固时点",
        "voucher_reference": "FA-2025-244",
        "summary": "设备已达到预定可使用状态，但仍长期挂在在建工程，折旧未及时计提。",
        "background": "生产线 7 月已开始试生产并形成稳定产出，财务为避免影响利润延后转固。",
        "dispute_process": "财务以验收单未完结为由暂不转固，审计团队要求结合试运行记录和产量数据判断。",
        "judgment_basis": "依据固定资产准则，以达到预定可使用状态而非最终结算作为转固判断时点。",
        "conclusion": "补办转固并追补折旧，同时更新项目验收与财务转固联动流程。",
        "reference_entry": "借：固定资产；贷：在建工程",
        "attachment_links": [
            "https://example.com/fixed-assets/trial-production",
            "https://example.com/fixed-assets/capitalization-transfer",
        ],
        "tags": ["固定资产", "在建工程", "转固"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "待审核",
        "created_by": "audit.industry.specialist",
    },
    {
        "title": "递延所得税资产确认依据不足",
        "company_code": "TJ-560",
        "company_name": "津海生物",
        "fiscal_year": "2024",
        "fiscal_period": "2024-12",
        "account_code": "1802",
        "account_name": "递延所得税资产",
        "issue_type": "所得税",
        "voucher_reference": "TAX-2024-118",
        "summary": "亏损企业继续确认大额递延所得税资产，但缺乏未来可抵扣利润的充分证据。",
        "background": "企业近三年持续亏损，管理层依赖尚未落地的新产品上市计划预测未来盈利。",
        "dispute_process": "管理层认为商业化拐点临近，审计团队要求提供董事会预算、订单和监管批文支持。",
        "judgment_basis": "依据所得税准则，只有在未来很可能取得足够应纳税所得额时方可确认递延所得税资产。",
        "conclusion": "冲回缺乏支撑的递延所得税资产，仅保留有明确盈利证据对应部分。",
        "reference_entry": "借：所得税费用；贷：递延所得税资产",
        "attachment_links": [
            "https://example.com/tax/profit-forecast",
            "https://example.com/tax/board-budget-approval",
        ],
        "tags": ["所得税", "递延所得税资产", "盈利预测"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "tax.audit.specialist",
    },
    {
        "title": "合同负债结转收入缺少履约证据",
        "company_code": "QD-276",
        "company_name": "青岛系统集成",
        "fiscal_year": "2025",
        "fiscal_period": "2025-Q2",
        "account_code": "2203",
        "account_name": "合同负债",
        "issue_type": "合同履约",
        "voucher_reference": "CON-2025-067",
        "summary": "项目预收款在实施中途转收入，但缺乏阶段性验收或客户确认。",
        "background": "项目经理依据内部里程碑完成情况通知财务结转收入，外部验收资料未同步归档。",
        "dispute_process": "业务认为客户已默认接受进度，审计团队要求核查验收邮件、上线确认和交付日志。",
        "judgment_basis": "依据收入准则中履约义务满足条件，判断是否具备按时段确认收入的证据基础。",
        "conclusion": "未取得外部验收依据前暂不结转收入，保留合同负债并督促补齐交付证据。",
        "reference_entry": "借：主营业务收入；贷：合同负债",
        "attachment_links": [
            "https://example.com/contracts/performance-obligation",
            "https://example.com/delivery/acceptance-log",
        ],
        "tags": ["合同负债", "收入确认", "履约义务"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "待审核",
        "created_by": "audit.project.lead",
    },
    {
        "title": "连续审计下收入截止口径延续失真",
        "company_code": "BJ-001",
        "company_name": "北方制造",
        "fiscal_year": "2024",
        "fiscal_period": "2024-Q4",
        "account_code": "6001",
        "account_name": "主营业务收入",
        "issue_type": "收入确认",
        "voucher_reference": "REV-2024-126",
        "summary": "沿用上年收入确认口径处理年末发货，但合同验收条款已调整，导致截止判断失真。",
        "background": "客户在 2024 年更新了交付验收条款，项目组仍沿用旧版底稿口径判断控制权转移。",
        "dispute_process": "项目成员认为与上年情形相同，复核经理指出本年合同对安装验收节点有新增约束。",
        "judgment_basis": "以当年合同条款、安装验收记录和客户确认邮件重新判断履约义务是否完成，不能简单沿用上年结论。",
        "conclusion": "撤回拟确认收入，要求项目组按新合同重新整理截止测试证据，并在案例库标记为连续审计口径变更样本。",
        "reference_entry": "借：主营业务收入；贷：合同负债",
        "attachment_links": [
            "https://example.com/revenue/annual-contract-update",
            "https://example.com/revenue/installation-acceptance",
        ],
        "tags": ["收入", "连续审计", "口径变更"],
        "risk_level": "高",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.review.manager",
    },
    {
        "title": "存货减值测试在连续复盘中发现预测偏乐观",
        "company_code": "SH-101",
        "company_name": "华东商贸",
        "fiscal_year": "2025",
        "fiscal_period": "2025-Q1",
        "account_code": "1405",
        "account_name": "库存商品",
        "issue_type": "存货减值",
        "voucher_reference": "INV-2025-031",
        "summary": "上期已计提跌价准备的品类在复盘时仍未消化，管理层可变现净值预测过于乐观。",
        "background": "2024 年末重点清理的积压品类在 2025 年一季度销售改善有限，但管理层预计二季度可恢复正常售价。",
        "dispute_process": "业务部门以新促销计划为由申请转回部分跌价准备，项目组要求结合实际成交价格重新测算。",
        "judgment_basis": "以期后真实成交价、渠道退货率和促销方案执行情况复核可变现净值，不采用单纯预算价。",
        "conclusion": "维持原有跌价准备并追加补提，对同类滞销品建立季度复盘标签，供后续项目直接追溯。",
        "reference_entry": "借：资产减值损失；贷：存货跌价准备",
        "attachment_links": [
            "https://example.com/inventory/q1-sellthrough-report",
            "https://example.com/inventory/promotion-execution-review",
        ],
        "tags": ["存货", "减值", "连续复盘"],
        "risk_level": "中",
        "source_type": "manual",
        "status": "已确认",
        "created_by": "audit.senior",
    },
]

DEFAULT_SITE_CONTENT = {
    "homepage": {
        "title": "首页内容",
        "body": "用于工作台展示事务所定位、工作流和核心价值。",
        "items": {
            "hero_eyebrow": "事务所工作台",
            "hero_title": "《业审追溯助手》是面向会计师事务所的审计知识追溯与风险提示工作台。",
            "hero_description": "平台只服务乙方审计团队，围绕经验沉淀、案例追溯、风险提示与判断留痕展开，帮助项目成员、项目经理和复核人员在连续审计、新客户项目和复杂事项处理中保持更高的一致性、效率与责任边界。",
            "boundary_cards": [
                {
                    "title": "不是 ERP",
                    "description": "ERP 记录业务结果，平台沉淀审计问题的背景、争议、依据和处理路径。",
                },
                {
                    "title": "不等同底稿系统",
                    "description": "底稿强调本年归档，平台强调跨年度、跨项目、跨人员的知识延续与追溯。",
                },
                {
                    "title": "不只是问答工具",
                    "description": "平台要求先完成结构化录入与判断链沉淀，确保后续检索、洞察和 AI 输出可追溯。",
                },
            ],
            "role_values": [
                {
                    "title": "项目成员",
                    "points": ["快速回看同类案例", "减少重复解释与查找", "保留判断依据与沟通痕迹"],
                },
                {
                    "title": "项目经理与复核人",
                    "points": ["提高复核透明度", "减少口径漂移", "保护项目一致性与责任边界"],
                },
            ],
            "core_values": [
                {
                    "title": "经验沉淀",
                    "description": "把零散邮件、底稿口径和个人经验沉淀成事务所可长期积累的案例资产。",
                },
                {
                    "title": "案例追溯",
                    "description": "支持按公司、年度、科目、标签和关键词反查同类问题与处理路径。",
                },
                {
                    "title": "风险提示",
                    "description": "把高频错报、热点科目和高风险样本前置到项目准备和复核阶段。",
                },
                {
                    "title": "判断留痕",
                    "description": "系统保留的是完整判断链，而不只是结论，便于交接、复核和自我保护。",
                },
            ],
            "flow_steps": ["问题识别", "结构化录入", "形成案例资产", "历史追溯", "风险复盘", "AI辅助解释"],
            "scenario_links": [
                {
                    "href": "/search",
                    "title": "追溯连续审计客户问题",
                    "description": "回看去年如何判断、今年是否延续、哪些口径需要修订。",
                },
                {
                    "href": "/cases/new",
                    "title": "沉淀新项目判断过程",
                    "description": "把问题背景、争议、依据和结论及时固化为正式案例。",
                },
                {
                    "href": "/dashboard",
                    "title": "查看高频风险与热点科目",
                    "description": "从案例资产中提炼项目准备阶段最值得优先关注的事项。",
                },
                {
                    "href": "/ai",
                    "title": "调用类案生成辅助建议",
                    "description": "在不替代专业判断的前提下，提高解释和准备效率。",
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
        "name": "费用截止预提提醒",
        "description": "当费用在期后集中入账时，提示复核是否存在跨期未预提。",
        "risk_level": "高",
        "trigger_account": "管理费用",
        "keyword_pattern": "暂估,预提,发票,截止",
        "suggestion": "核查服务完成时点、验收证据和权责发生制归属。",
        "enabled": True,
        "sort_order": 15,
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
    {
        "name": "应收函证替代程序提醒",
        "description": "当应收账款函证未回函时，提示补做期后回款与客户对账的替代程序。",
        "risk_level": "高",
        "trigger_account": "应收账款",
        "keyword_pattern": "函证,未回函,替代程序,期后回款",
        "suggestion": "补充客户对账单、签收记录、期后回款和发票链路的交叉证据。",
        "enabled": True,
        "sort_order": 30,
    },
    {
        "name": "商誉减值关键假设复核",
        "description": "当商誉减值测试沿用高增长预测时，提示复核现金流、折现率和敏感性分析。",
        "risk_level": "高",
        "trigger_account": "商誉",
        "keyword_pattern": "商誉,减值,现金流预测,敏感性",
        "suggestion": "对比历史预算达成率与外部市场数据，复核核心假设是否过于乐观。",
        "enabled": True,
        "sort_order": 40,
    },
    {
        "name": "在建工程转固时点提醒",
        "description": "当在建工程已试生产或形成稳定产出时，提示复核是否达到预定可使用状态。",
        "risk_level": "中",
        "trigger_account": "在建工程",
        "keyword_pattern": "转固,试生产,预定可使用状态,折旧",
        "suggestion": "结合试运行记录、产量和验收资料判断转固时点并追补折旧。",
        "enabled": True,
        "sort_order": 50,
    },
]

DEFAULT_DISPLAY_CONFIGS = {
    "dashboard": {
        "description": "风险看板展示配置",
        "config_value": {
            "headline": "把事务所零散案例整理成可提前使用的风险视图",
            "subline": "用于项目准备、经理复核和热点问题复盘的二级洞察页面。",
            "show_recent_cases": False,
        },
    },
    "ai": {
        "description": "AI 助手展示配置",
        "config_value": {
            "disclaimer": "AI 建议基于事务所历史案例，不替代审计师的专业判断与签字责任。",
        },
    },
}


def _case_identity(item: dict) -> tuple[str, str, str]:
    return (item["title"], item["company_name"], item["fiscal_year"])


def _seed_cases(db: Session) -> None:
    existing_cases = {
        (case.title, case.company_name, case.fiscal_year): case
        for case in db.query(models.CaseRecord).all()
    }

    created = False
    for item in DEMO_CASES:
        if _case_identity(item) in existing_cases:
            continue
        db.add(models.CaseRecord(**item))
        created = True

    if created:
        db.commit()


def _seed_site_content(db: Session) -> None:
    for section_key, payload in DEFAULT_SITE_CONTENT.items():
        content = db.query(models.SiteContent).filter(models.SiteContent.section_key == section_key).first()
        if not content:
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
            continue

        if content.updated_by == "system":
            content.title = payload["title"]
            content.body = payload["body"]
            content.items = payload["items"]
            content.is_published = True
            content.updated_by = "system"

    db.commit()


def _seed_risk_rules(db: Session) -> None:
    existing_rules = {
        rule.name: rule for rule in db.query(models.RiskRule).all()
    }

    created = False
    for item in DEFAULT_RISK_RULES:
        if item["name"] in existing_rules:
            continue
        db.add(models.RiskRule(**item, updated_by="system"))
        created = True

    if created:
        db.commit()


def _seed_display_configs(db: Session) -> None:
    for config_key, payload in DEFAULT_DISPLAY_CONFIGS.items():
        config = db.query(models.DisplayConfig).filter(models.DisplayConfig.config_key == config_key).first()
        if not config:
            db.add(
                models.DisplayConfig(
                    config_key=config_key,
                    description=payload["description"],
                    config_value=payload["config_value"],
                    updated_by="system",
                )
            )
            continue

        if config.updated_by == "system":
            config.description = payload["description"]
            config.config_value = payload["config_value"]
            config.updated_by = "system"

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


if __name__ == "__main__":
    from database import SessionLocal

    db = SessionLocal()
    try:
        seed_demo_cases(db)
        case_count = db.query(models.CaseRecord).count()
        rule_count = db.query(models.RiskRule).count()
        print(f"Seed completed. Cases: {case_count}, rules: {rule_count}")
    finally:
        db.close()
