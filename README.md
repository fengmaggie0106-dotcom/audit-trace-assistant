# 业审追溯助手

业审追溯助手是一套面向会计师事务所乙方审计团队的审计知识追溯与风险提示工作台。平台不替代 ERP，也不替代底稿系统，而是把项目过程中分散的判断依据、争议过程和处理结论沉淀成可复用的案例资产。

当前版本的核心目标有三件事：

- 让首页真正成为工作台，而不是宣传页
- 让案例库成为唯一的列表事实源
- 让"录入 -> 追溯 -> 复核 -> 风险提示"形成连贯 workflow

## 功能概览

| 页面 | 说明 |
|------|------|
| 工作台 | 首页展示事务所定位、当前 workflow、最近案例和二级能力入口 |
| 案例库 | 统一检索、筛选、浏览历史案例 |
| 新建记录 | 按"结构化索引 / 判断过程 / 结论与留痕"录入案例 |
| 案例详情 | 以文档页方式沉淀背景、争议、依据、结论和参考分录 |
| 风险洞察 | 聚合高频问题、风险等级、热点科目和年度趋势 |
| AI 助手 | 基于历史案例生成辅助解释和下一步建议 |
| 管理后台 | 支持更新首页文案、案例、风险规则和显示配置 |

## 技术栈

- **前端**：Next.js 16 + Tailwind CSS 4 + TypeScript
- **后端**：FastAPI + SQLAlchemy + Uvicorn
- **数据库**：默认 SQLite（零配置），可切换 MySQL

## 项目结构

```text
backend/       FastAPI 后端（Python）
frontend/      Next.js 前端（TypeScript）
deliverables/  静态 HTML 交付物
docs/          部署与方案文档
tests/         平台级集成测试
```

## 前提条件

克隆前请确认本地已安装：

- **Python 3.11+**（用于后端 venv）
- **Node.js 20+** + **npm 10+**（用于前端）
- **Git**

## 首次克隆安装

```powershell
# 克隆仓库
git clone https://github.com/fengmaggie0106-dotcom/audit-trace-assistant.git
cd audit-trace-assistant

# 1. 后端：创建虚拟环境并安装依赖
cd .\backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
cd ..

# 2. 前端：安装依赖
cd .\frontend
npm install
cd ..

# 3. 创建前端本地环境变量文件
echo NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000 > .\frontend\.env.local
```

## 本地启动（一键脚本）

在仓库根目录的 PowerShell 中运行：

```powershell
# 启动前后端 + 交付物服务器
powershell -ExecutionPolicy Bypass -File .\start-platform.ps1

# 查看运行状态
powershell -ExecutionPolicy Bypass -File .\status-platform.ps1

# 停止所有服务
powershell -ExecutionPolicy Bypass -File .\stop-platform.ps1

# 重新补种示例数据（不重启）
powershell -ExecutionPolicy Bypass -File .\refresh-demo-data.ps1
```

> `start-platform.ps1` 会自动完成前端 `npm run build`，首次启动约需 2-3 分钟。

## 浏览器访问地址

| 页面 | 地址 |
|------|------|
| 工作台（首页） | http://127.0.0.1:3000/ |
| 案例库 | http://127.0.0.1:3000/search |
| 新建记录 | http://127.0.0.1:3000/cases/new |
| 风险洞察 | http://127.0.0.1:3000/dashboard |
| AI 助手 | http://127.0.0.1:3000/ai |
| 管理后台 | http://127.0.0.1:3000/admin/login |
| 后端健康检查 | http://127.0.0.1:8000/health |

默认管理员账号：用户名 `admin`，密码 `admin123`

## 单独运行前后端（开发模式）

### 后端（带热重载）

```powershell
cd .\backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 前端（开发模式，即时热更新）

```powershell
cd .\frontend
npm run dev
```

> 开发模式使用 `npm run dev`，无需提前 build。`start-platform.ps1` 使用的是生产模式（build + standalone server）。

## 数据库与示例数据

后端启动时自动完成：

1. SQLite 建表（`backend/audit_trace_assistant.db`，首次启动自动创建）
2. 初始化管理员账号（`admin` / `admin123`）
3. 补种首页内容、风险规则、显示配置
4. 补种 17 条多样化示例审计案例

示例案例覆盖主题：收入确认截止、存货减值、银行函证、费用预提、研发资本化、关联方往来、政府补助、质保负债、商誉减值、函证替代程序、在建工程转固、递延所得税、合同负债结转。

如需切换到 MySQL，在 `backend/` 目录创建 `.env` 文件：

```env
MYSQL_URL=mysql+pymysql://user:password@host:3306/dbname
```

## 测试

### 后端接口测试

```powershell
# 从项目根目录运行（使用 unittest，无需额外安装）
.\backend\.venv\Scripts\python.exe -m unittest backend.tests.test_api -v
```

### 前端 ESLint 检查

```powershell
cd .\frontend
npm exec eslint .
```

### 前端生产构建验证

```powershell
cd .\frontend
npm run build
```

## GitHub 提交注意事项

以下内容已在 `.gitignore` 中排除，**不要**手动强制提交：

| 排除路径 | 原因 |
|----------|------|
| `backend/.venv/` | Python 虚拟环境，克隆后用 `pip install -r requirements.txt` 重建 |
| `frontend/node_modules/` | Node 依赖，克隆后用 `npm install` 重建 |
| `frontend/.next/` | 构建产物，用 `npm run build` 重建 |
| `backend/audit_trace_assistant.db` | SQLite 数据库，后端启动时自动 seed |
| `backend/test_audit_trace_assistant*.db` | 测试用临时数据库 |
| `*.log`、`*.pid` | 运行时临时文件 |
| `.env`、`.env.local` | 本地环境配置，用 `.env.example` 为模板创建 |
| `.claude/` | Claude Code 本地状态 |

## 部署到云端

- 前端推荐部署到 **Vercel**（项目根目录已有 `vercel.json`）
- 后端推荐部署到 **Railway**（`backend/railway.toml` 已配置）

部署时需在 Vercel 设置环境变量 `NEXT_PUBLIC_API_BASE` 指向 Railway 后端地址。
