# 业审追溯助手

“业审追溯助手”是一个面向审计方与被审计方的内控合规智能体平台。项目核心价值聚焦四点：

- 经验沉淀
- 案例追溯
- 风险提示
- 智能推荐

系统主线为：

`问题发生 -> 结构化录入 -> 形成案例资产 -> 历史追溯查询 -> 风险提示 -> AI辅助解释`

## 当前能力

- 首页：说明平台定位、双角色价值、核心能力和业务闭环
- 案例录入页：录入结构化字段和描述性字段
- 历史查询页：支持公司、年份、科目、关键词、标签筛选
- 案例详情页：展示背景、争议过程、判断依据、结论、分录、附件和元数据
- 风险看板页：展示问题类型分布、风险等级分布、热点科目和年度趋势
- AI 助手页：基于历史案例输出相似案例和建议动作
- 管理员后台：支持网页登录后直接编辑首页文案、案例内容、风险规则和展示配置

## 项目结构

```text
frontend/   Next.js 前端
backend/    FastAPI 后端
docs/       方案与部署文档
```

## 本地运行

### 1. 启动后端

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

后端默认支持：

- `DATABASE_URL`
- `MYSQL_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- 若都未提供，则回退到本地 SQLite：`sqlite:///./audit_trace_assistant.db`

### 2. 启动前端

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

浏览器访问：

- 前端：`http://127.0.0.1:3000`
- 后端健康检查：`http://127.0.0.1:8000/health`
- 管理员后台：`http://127.0.0.1:3000/admin/login`

## 测试与构建

### 后端测试

```bash
cd backend
python -m unittest tests.test_api -v
```

### 前端类型检查

```bash
cd frontend
npx tsc --noEmit
```

### 前端生产构建

```bash
cd frontend
npm run build
```

## 部署

- 前端部署说明：见 [frontend/README.md](/c:/Users/fjy06/Desktop/audit-trace-assistant/frontend/README.md)
- 完整上线说明：见 [docs/deployment.md](/c:/Users/fjy06/Desktop/audit-trace-assistant/docs/deployment.md)

## 环境变量

根目录 `.env.example` 提供了一份联调示例，前后端也分别提供：

- `frontend/.env.example`
- `backend/.env.example`

## 当前部署策略

- 前端：Vercel
- 后端：Railway
- 数据库：Railway MySQL 或自管 MySQL

当前版本首次启动时会自动建表并写入示例数据，同时按环境变量初始化管理员账号。后续如需正式化迁移，建议补接 Alembic。
