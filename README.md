# 业审追溯助手

业审追溯助手是一套面向会计师事务所乙方审计团队的审计知识追溯与风险提示工作台。平台不替代 ERP，也不替代底稿系统，而是把项目过程中分散的判断依据、争议过程和处理结论沉淀成可复用的案例资产。

当前版本的核心目标有三件事：

- 让首页真正成为工作台，而不是宣传页
- 让案例库成为唯一的列表事实源
- 让“录入 -> 追溯 -> 复核 -> 风险提示”形成连贯 workflow

## 功能概览

- 工作台：首页展示事务所定位、当前 workflow、最近案例和二级能力入口
- 案例库：统一检索、筛选、浏览历史案例
- 新建记录：按“结构化索引 / 判断过程 / 结论与留痕”录入案例
- 案例详情：以文档页方式沉淀背景、争议、依据、结论和参考分录
- 风险洞察：聚合高频问题、风险等级、热点科目和年度趋势
- AI 助手：基于历史案例生成辅助解释和下一步建议
- 管理后台：支持更新首页文案、案例、风险规则和显示配置

## 技术栈

- 前端：Next.js
- 后端：FastAPI + SQLAlchemy
- 数据库：默认 SQLite，可切换到 MySQL

## 项目结构

```text
frontend/      Next.js 前端
backend/       FastAPI 后端
deliverables/  静态 HTML 交付物
docs/          部署与方案文档
```

## 首次克隆安装

### 1. 后端环境

```powershell
cd .\backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
cd ..
```

### 2. 前端依赖

```powershell
cd .\frontend
npm install
cd ..
```

## 本地启动

推荐直接在仓库根目录使用一键脚本（每次使用前需完成上面的首次安装步骤）。

### 启动整个平台

```powershell
powershell -ExecutionPolicy Bypass -File .\start-platform.ps1
```

### 查看运行状态

```powershell
powershell -ExecutionPolicy Bypass -File .\status-platform.ps1
```

### 停止整个平台

```powershell
powershell -ExecutionPolicy Bypass -File .\stop-platform.ps1
```

### 重新补种示例数据

```powershell
powershell -ExecutionPolicy Bypass -File .\refresh-demo-data.ps1
```

## 浏览器访问地址

- 工作台：`http://127.0.0.1:3000/`
- 案例库：`http://127.0.0.1:3000/search`
- 新建记录：`http://127.0.0.1:3000/cases/new`
- 风险洞察：`http://127.0.0.1:3000/dashboard`
- AI 助手：`http://127.0.0.1:3000/ai`
- 管理后台登录：`http://127.0.0.1:3000/admin/login`
- 后端健康检查：`http://127.0.0.1:8000/health`

默认管理员账号：

- 用户名：`admin`
- 密码：`admin123`

## 单独运行前后端

### 后端

```powershell
cd .\backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 前端

```powershell
cd .\frontend
$env:NEXT_PUBLIC_API_BASE='http://127.0.0.1:8000'
npm run dev
```

## 数据库与示例案例

应用启动时会自动完成：

- 建表
- 初始化管理员账号
- 补种系统默认首页内容
- 补种风险规则和页面显示配置
- 补种多样化审计案例

当前示例案例覆盖的主题包括：

- 收入提前确认
- 存货跌价准备
- 银行函证差异
- 费用截止与预提
- 研发支出资本化
- 关联方往来减值
- 政府补助收益匹配
- 质保预计负债
- 商誉减值测试
- 应收账款函证替代程序
- 在建工程转固时点
- 递延所得税资产确认
- 合同负债结转收入

默认数据库为 `backend/audit_trace_assistant.db`。如果你提供 `DATABASE_URL` 或 `MYSQL_URL`，系统会优先连接对应数据库。

## 测试与构建

### 后端测试

```powershell
.\backend\.venv\Scripts\python.exe -m pytest backend\tests\test_api.py -v
```

### 前端代码检查

```powershell
cd .\frontend
npm exec eslint .
```

### 前端生产构建

```powershell
cd .\frontend
npm run build
```

## 部署说明

- 前端部署说明见 `frontend/README.md`
- 完整部署说明见 `docs/deployment.md`

## 交付物入口

静态 HTML 演示页仍然保留，启动平台后可通过以下地址访问：

- `http://127.0.0.1:3000/deliverables/static-html-demo/index.html`
- `http://127.0.0.1:8092/deliverables/static-html-demo/index.html`

## GitHub 提交注意事项

以下文件/目录已在 `.gitignore` 中排除，**不要**手动强制提交：

- `backend/.venv/`：Python 虚拟环境，克隆后用 `pip install -r requirements.txt` 重建
- `frontend/node_modules/`：Node 依赖，克隆后用 `npm install` 重建
- `frontend/.next/`：构建产物，用 `npm run build` 重建
- `backend/audit_trace_assistant.db`：SQLite 数据库，首次启动时自动 seed
- `*.log`、`*.pid`：运行时产生的临时文件
- `.env.local`、`.env`：本地环境配置，用 `.env.example` 为模板自行创建
