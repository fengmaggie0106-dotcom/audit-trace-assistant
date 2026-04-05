import importlib
import os
import sys
import unittest
from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

TEST_DB_PATH = BACKEND_DIR / f"test_audit_trace_assistant_{uuid4().hex}.db"
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.as_posix()}"
os.environ["ADMIN_USERNAME"] = "admin"
os.environ["ADMIN_PASSWORD"] = "admin123"

database = importlib.import_module("database")
models = importlib.import_module("models")
main = importlib.import_module("main")


class AuditTraceApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = create_engine(
            os.environ["DATABASE_URL"],
            connect_args={"check_same_thread": False},
        )
        cls.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=cls.engine,
        )
        models.Base.metadata.drop_all(bind=cls.engine)
        models.Base.metadata.create_all(bind=cls.engine)

        def override_get_db():
            db = cls.SessionLocal()
            try:
                yield db
            finally:
                db.close()

        main.app.dependency_overrides[main.get_db] = override_get_db
        main.ensure_seeded()
        cls.client = TestClient(main.app)

    @classmethod
    def tearDownClass(cls):
        main.app.dependency_overrides.clear()
        models.Base.metadata.drop_all(bind=cls.engine)
        cls.engine.dispose()
        if TEST_DB_PATH.exists():
            try:
                TEST_DB_PATH.unlink()
            except PermissionError:
                pass

    def login_admin(self):
        response = self.client.post(
            "/admin/login",
            json={"username": "admin", "password": "admin123"},
        )
        self.assertEqual(response.status_code, 200)
        token = response.json()["token"]
        return {"Authorization": f"Bearer {token}"}

    def test_create_case_returns_trace_fields(self):
        payload = {
            "title": "收入确认时点争议",
            "company_code": "BJ-001",
            "company_name": "北方制造",
            "fiscal_year": "2025",
            "fiscal_period": "2025-Q4",
            "account_code": "6001",
            "account_name": "主营业务收入",
            "issue_type": "收入确认",
            "voucher_reference": "V-2025-188",
            "summary": "年末发货未签收提前确认收入。",
            "background": "客户签收单据滞后，财务按发货单确认收入。",
            "dispute_process": "财务认为风险报酬已转移，审计要求补充签收依据。",
            "judgment_basis": "依据企业会计准则第14号及合同条款判断控制权转移时点。",
            "conclusion": "建议冲回收入并待签收后确认。",
            "reference_entry": "借：主营业务收入 120000；贷：应收账款 120000",
            "risk_level": "高",
            "tags": ["收入", "截止测试", "跨年度"],
            "attachment_links": [
                "https://example.com/contracts/1",
                "https://example.com/pbc/receipt-proof",
            ],
            "source_type": "manual",
            "status": "已确认",
            "created_by": "audit.manager",
        }

        response = self.client.post("/cases", json=payload)

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["company_name"], "北方制造")
        self.assertEqual(body["judgment_basis"], payload["judgment_basis"])
        self.assertEqual(body["tags"], payload["tags"])
        self.assertEqual(body["attachment_links"], payload["attachment_links"])

    def test_list_cases_supports_business_filters(self):
        self.client.post(
            "/cases",
            json={
                "title": "存货跌价准备补提",
                "company_code": "SH-101",
                "company_name": "华东商贸",
                "fiscal_year": "2024",
                "fiscal_period": "2024-12",
                "account_code": "1405",
                "account_name": "库存商品",
                "issue_type": "存货减值",
                "summary": "库龄过长但未计提跌价准备。",
                "background": "积压存货在库超过18个月。",
                "dispute_process": "业务部门认为仍可出售，审计关注可变现净值。",
                "judgment_basis": "根据期后售价和在手订单测算可变现净值。",
                "conclusion": "补提存货跌价准备。",
                "reference_entry": "借：资产减值损失；贷：存货跌价准备",
                "risk_level": "中",
                "tags": ["存货", "减值"],
                "attachment_links": [],
                "source_type": "manual",
                "status": "已确认",
                "created_by": "finance.lead",
            },
        )

        response = self.client.get(
            "/cases",
            params={
                "company": "华东商贸",
                "year": "2024",
                "account": "库存商品",
                "tag": "减值",
                "keyword": "可变现净值",
            },
        )

        self.assertEqual(response.status_code, 200)
        items = response.json()
        self.assertTrue(any(item["issue_type"] == "存货减值" for item in items))

    def test_dashboard_and_assistant_endpoints_return_demo_data(self):
        dashboard_response = self.client.get("/dashboard")
        assistant_response = self.client.post(
            "/assistant/query",
            json={"question": "收入提前确认应该参考哪些历史案例？"},
        )

        self.assertEqual(dashboard_response.status_code, 200)
        self.assertIn("issue_type_distribution", dashboard_response.json())
        self.assertEqual(assistant_response.status_code, 200)
        self.assertIn("answer", assistant_response.json())
        self.assertIn("matched_cases", assistant_response.json())

    def test_admin_can_update_homepage_content(self):
        headers = self.login_admin()

        read_response = self.client.get("/admin/site-content/homepage", headers=headers)
        self.assertEqual(read_response.status_code, 200)

        update_response = self.client.put(
            "/admin/site-content/homepage",
            headers=headers,
            json={
                "title": "首页内容",
                "body": "管理员已更新首页定位。",
                "items": {
                    "hero_title": "业审追溯助手正式版",
                    "hero_description": "支持长期在线访问与后台编辑。",
                },
                "is_published": True,
            },
        )

        self.assertEqual(update_response.status_code, 200)
        public_response = self.client.get("/site-content/homepage")
        self.assertEqual(public_response.status_code, 200)
        self.assertEqual(
            public_response.json()["items"]["hero_title"],
            "业审追溯助手正式版",
        )

    def test_admin_can_edit_case_and_manage_risk_rule(self):
        headers = self.login_admin()

        case_response = self.client.get("/cases")
        self.assertEqual(case_response.status_code, 200)
        case_id = case_response.json()[0]["id"]

        update_case = self.client.put(
            f"/admin/cases/{case_id}",
            headers=headers,
            json={
                "title": "收入提前确认导致跨期错报",
                "company_code": "BJ-001",
                "company_name": "北方制造",
                "fiscal_year": "2025",
                "fiscal_period": "2025-Q4",
                "account_code": "6001",
                "account_name": "主营业务收入",
                "issue_type": "收入确认",
                "voucher_reference": "V-2025-188",
                "summary": "管理员已更新摘要。",
                "background": "管理员已更新背景。",
                "dispute_process": "管理员已更新争议过程。",
                "judgment_basis": "管理员已更新判断依据。",
                "conclusion": "管理员已更新结论。",
                "reference_entry": "借：主营业务收入；贷：应收账款",
                "risk_level": "高",
                "tags": ["收入", "后台编辑"],
                "attachment_links": ["https://example.com/updated-proof"],
                "source_type": "manual",
                "status": "已确认",
                "created_by": "admin",
            },
        )
        self.assertEqual(update_case.status_code, 200)
        self.assertEqual(update_case.json()["summary"], "管理员已更新摘要。")

        create_rule = self.client.post(
            "/admin/risk-rules",
            headers=headers,
            json={
                "name": "收入截止风险提示",
                "description": "当收入集中在期末确认时提醒复核签收依据。",
                "risk_level": "高",
                "trigger_account": "主营业务收入",
                "keyword_pattern": "签收,提前确认,截止",
                "suggestion": "优先核查签收单据与控制权转移时点。",
                "enabled": True,
                "sort_order": 10,
            },
        )
        self.assertEqual(create_rule.status_code, 200)

        public_rules = self.client.get("/risk-rules")
        self.assertEqual(public_rules.status_code, 200)
        self.assertGreaterEqual(len(public_rules.json()), 1)

    def test_admin_can_update_display_config(self):
        headers = self.login_admin()

        response = self.client.put(
            "/admin/display-configs/dashboard",
            headers=headers,
            json={
                "description": "看板展示配置",
                "config_value": {
                    "headline": "高频错账与调整趋势",
                    "show_recent_cases": True,
                },
            },
        )

        self.assertEqual(response.status_code, 200)
        public_response = self.client.get("/display-configs/dashboard")
        self.assertEqual(public_response.status_code, 200)
        self.assertEqual(
            public_response.json()["config_value"]["headline"],
            "高频错账与调整趋势",
        )


if __name__ == "__main__":
    unittest.main()
