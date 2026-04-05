# 部署说明

本文档用于把“业审追溯助手”部署成一个长期可访问、可分享链接、可后台编辑的网站。

## 1. 本地运行步骤

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

后端默认会：

- 自动建表
- 自动写入示例案例
- 自动初始化管理员账号

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 本地访问地址

- 前端首页：`http://127.0.0.1:3000`
- 管理员后台：`http://127.0.0.1:3000/admin/login`
- 后端健康检查：`http://127.0.0.1:8000/health`

## 2. GitHub 仓库准备

1. 将当前仓库推送到 GitHub
2. 确保前后端目录结构保持不变
3. 使用 monorepo 部署：
   - Vercel Root Directory：`frontend`
   - Railway Root Directory：`backend`

## 3. 前端部署到 Vercel

### 创建项目

1. 登录 Vercel
2. 导入 GitHub 仓库
3. Root Directory 选择 `frontend`
4. Framework Preset 选择 `Next.js`

### 构建配置

- Install Command：`npm install`
- Build Command：`npm run build`
- Output Directory：留空

### 前端环境变量

```env
NEXT_PUBLIC_API_BASE=https://your-backend.up.railway.app
```

### 路由刷新

当前前端使用 Next.js App Router，部署到 Vercel 后，刷新 `/cases/1`、`/admin/content` 这类深层路由不需要额外配置 SPA rewrite。

### 自定义域名

Vercel 项目部署完成后，在：

- `Project Settings > Domains`

中绑定你的正式域名。

## 4. 后端部署到 Railway

### 创建服务

1. 登录 Railway
2. 从 GitHub 创建新项目
3. Root Directory 选择 `backend`
4. Railway 会读取 `backend/railway.toml`

### 启动命令

```bash
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### 后端环境变量

至少需要：

```env
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DBNAME
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-in-production
```

可选兼容变量：

```env
MYSQL_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DBNAME
PORT=8000
```

说明：

- 后端优先读取 `DATABASE_URL`
- 若未提供，则读取 `MYSQL_URL`
- 两者都未提供时仅适合本地 SQLite demo

## 5. MySQL 配置

推荐做法：

1. 在 Railway 创建 MySQL 服务，或使用已有 MySQL
2. 复制 MySQL 连接串
3. 填入后端的 `DATABASE_URL`

示例：

```env
DATABASE_URL=mysql+pymysql://root:password@mysql.railway.internal:3306/railway
```

### 当前数据库初始化方式

当前版本为最小改动方案：

- 使用 SQLAlchemy `create_all()` 自动建表
- 首次启动自动写入默认内容和管理员账号

这适合当前正式网站 MVP 上线。后续如果继续迭代字段结构，建议补接 Alembic。

## 6. 环境变量填写示例

### 前端 `.env.local`

```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

### 前端 Vercel 环境变量

```env
NEXT_PUBLIC_API_BASE=https://your-backend.up.railway.app
```

### 后端 `.env`

```env
DATABASE_URL=sqlite:///./audit_trace_assistant.db
CORS_ORIGINS=http://127.0.0.1:3000
PORT=8000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 后端 Railway 环境变量

```env
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DBNAME
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
PORT=8000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-in-production
```

## 7. 管理员后台如何使用

管理员登录入口：

- `https://your-frontend-domain/admin/login`

登录后可编辑：

1. 首页内容
2. 案例内容
3. 风险规则
4. 展示配置

这意味着网站上线后，你后续既可以：

- 继续通过代码更新功能
- 也可以直接通过后台改核心内容

## 8. 自定义域名接入位置

### 前端域名

- 平台：Vercel
- 入口：`Project Settings > Domains`

### 后端域名

- 平台：Railway
- 入口：服务设置中的 Domain / Networking

建议：

- 前端使用主域名：`https://audit-assistant.example.com`
- 后端使用子域名：`https://api.audit-assistant.example.com`

## 9. 常见报错排查

### 前端能打开，但没有数据

检查：

- `NEXT_PUBLIC_API_BASE` 是否正确
- Railway 后端是否在线
- `CORS_ORIGINS` 是否包含前端域名

### 后台登录失败

检查：

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- 后端是否已重启并加载新环境变量

### 后台保存后前台没变化

检查：

- 是否保存到了正确的内容键，例如 `homepage`
- 前端调用的是否是线上后端地址
- 后台是否编辑了 `is_published=true` 的内容

### Railway 后端启动失败

检查：

- `DATABASE_URL` 是否正确
- MySQL 服务是否可用
- `pymysql` 是否在依赖中
- Root Directory 是否选了 `backend`

### MySQL 连接失败

检查：

- 用户名密码是否正确
- Host、Port 是否来自 Railway MySQL 服务
- 数据库名是否存在

## 10. 上线后如何验证

建议按下面顺序验收：

1. 打开前端首页
2. 打开历史查询页，确认列表正常
3. 点击一个案例进入详情页
4. 打开风险看板和 AI 助手
5. 打开管理员后台登录页
6. 登录后台
7. 修改首页 Hero 文案并保存
8. 回到首页刷新，确认文案已更新
9. 修改一个案例内容并保存
10. 回到详情页刷新，确认案例内容已更新
11. 修改一条风险规则并保存
12. 回到看板或 AI 助手页确认规则结果已更新
13. 重启后端服务后再次检查，确认 MySQL 数据仍存在

## 11. 上线验收标准

满足以下几点即可认为网站达到“正式可用”：

1. 外部用户可通过公开 URL 访问首页
2. 深层页面链接可直接分享访问
3. 管理员可网页登录后台
4. 首页、案例、规则、展示配置都能编辑
5. 编辑结果持久化到 MySQL
6. 前后端都能独立重新部署
