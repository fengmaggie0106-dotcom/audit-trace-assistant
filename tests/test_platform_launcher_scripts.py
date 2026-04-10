import pathlib
import subprocess
import unittest


class PlatformLauncherScriptsTest(unittest.TestCase):
    def setUp(self):
        self.root = pathlib.Path(__file__).resolve().parents[1]

    def test_launcher_entrypoints_exist(self):
        expected = [
            self.root / "start-platform.ps1",
            self.root / "stop-platform.ps1",
            self.root / "status-platform.ps1",
            self.root / "start-platform.bat",
        ]
        for path in expected:
            self.assertTrue(path.exists(), f"Missing launcher file: {path}")

    def test_status_script_is_invokable(self):
        status_script = self.root / "status-platform.ps1"
        self.assertTrue(status_script.exists(), f"Missing launcher file: {status_script}")

        completed = subprocess.run(
            [
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(status_script),
            ],
            cwd=self.root,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertIn("Platform status", completed.stdout)

    def test_launcher_scripts_manage_deliverables_server(self):
        start_script = (self.root / "start-platform.ps1").read_text(encoding="utf-8")
        status_script = (self.root / "status-platform.ps1").read_text(encoding="utf-8")
        stop_script = (self.root / "stop-platform.ps1").read_text(encoding="utf-8")

        for content in [start_script, status_script, stop_script]:
            self.assertIn(".deliverables_server_pid", content)
            self.assertIn("8092", content)

        self.assertIn("deliverables/static-html-demo/index.html", start_script)
        self.assertIn("Deliverables", status_script)
        self.assertIn("Deliverables", stop_script)

    def test_frontend_has_filesystem_deliverables_route(self):
        route_file = self.root / "frontend" / "app" / "deliverables" / "[...path]" / "route.ts"
        self.assertTrue(route_file.exists(), f"Missing deliverables route: {route_file}")

        content = route_file.read_text(encoding="utf-8")
        self.assertIn('from "node:fs/promises"', content)
        self.assertIn('from "node:path"', content)
        self.assertIn('"deliverables"', content)
        self.assertIn("text/html", content)
        self.assertIn("export async function GET", content)

if __name__ == "__main__":
    unittest.main()
