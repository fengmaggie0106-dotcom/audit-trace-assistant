import pathlib
import unittest


class StaticHtmlDeliverablesTest(unittest.TestCase):
    def test_expected_entry_points_exist(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        expected = [
            root / "deliverables" / "static-html-demo" / "index.html",
            root / "deliverables" / "html-export" / "index.html",
        ]
        for path in expected:
            self.assertTrue(path.exists(), f"Missing deliverable file: {path}")

    def test_shared_assets_exist_with_expected_markers(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        assets = [
            root / "deliverables" / "static-html-demo" / "assets" / "styles.css",
            root / "deliverables" / "static-html-demo" / "assets" / "app.js",
            root / "deliverables" / "html-export" / "assets" / "styles.css",
            root / "deliverables" / "html-export" / "assets" / "app.js",
        ]
        for path in assets:
            self.assertTrue(path.exists(), f"Missing shared asset: {path}")

        for stylesheet in [assets[0], assets[2]]:
            content = stylesheet.read_text(encoding="utf-8")
            self.assertIn(":root", content)
            self.assertIn(".topbar", content)
            self.assertIn(".sidebar", content)

        for script in [assets[1], assets[3]]:
            content = script.read_text(encoding="utf-8")
            self.assertIn("window.demoData", content)
            self.assertIn("showToast", content)

    def test_static_html_demo_pages_have_core_structure(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        pages = [
            root / "deliverables" / "static-html-demo" / "index.html",
            root / "deliverables" / "static-html-demo" / "case-entry.html",
            root / "deliverables" / "static-html-demo" / "search.html",
            root / "deliverables" / "static-html-demo" / "case-detail.html",
            root / "deliverables" / "static-html-demo" / "dashboard.html",
            root / "deliverables" / "static-html-demo" / "ai.html",
            root / "deliverables" / "static-html-demo" / "admin.html",
        ]
        for path in pages:
            self.assertTrue(path.exists(), f"Missing static demo page: {path}")
            content = path.read_text(encoding="utf-8")
            self.assertIn("<title>", content)
            self.assertIn('assets/styles.css', content)
            self.assertTrue("首页" in content or "风险看板" in content or "案例" in content)

    def test_html_export_pages_have_route_aligned_structure(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        pages = [
            root / "deliverables" / "html-export" / "index.html",
            root / "deliverables" / "html-export" / "search.html",
            root / "deliverables" / "html-export" / "cases-new.html",
            root / "deliverables" / "html-export" / "case-1.html",
            root / "deliverables" / "html-export" / "dashboard.html",
            root / "deliverables" / "html-export" / "ai.html",
            root / "deliverables" / "html-export" / "admin-login.html",
            root / "deliverables" / "html-export" / "admin-content.html",
            root / "deliverables" / "html-export" / "admin-cases.html",
            root / "deliverables" / "html-export" / "admin-rules.html",
            root / "deliverables" / "html-export" / "admin-display.html",
        ]
        for path in pages:
            self.assertTrue(path.exists(), f"Missing html export page: {path}")
            content = path.read_text(encoding="utf-8")
            self.assertIn("<title>", content)
            self.assertIn('assets/styles.css', content)
            self.assertTrue(
                "历史查询" in content or "案例详情" in content or "后台" in content or "首页" in content
            )

    def test_docs_reference_both_html_deliverables(self):
        root = pathlib.Path(__file__).resolve().parents[1]
        readme = (root / "README.md").read_text(encoding="utf-8")
        deployment = (root / "docs" / "deployment.md").read_text(encoding="utf-8")

        for content in [readme, deployment]:
            self.assertIn("deliverables/static-html-demo", content)
            self.assertIn("deliverables/html-export", content)


if __name__ == "__main__":
    unittest.main()
