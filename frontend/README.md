# Frontend

前端基于 Next.js App Router，页面包含：

- 首页 `/`
- 案例录入 `/cases/new`
- 历史查询 `/search`
- 案例详情 `/cases/[id]`
- 风险看板 `/dashboard`
- AI 助手 `/ai`
- 管理员后台 `/admin`

## 本地运行

1. 在 `frontend` 目录准备环境变量：

```bash
cp .env.example .env.local
```

Windows PowerShell 可直接新建 `.env.local`，内容参考 `.env.example`。

2. 安装依赖并启动开发环境：

```bash
npm install
npm run dev
```

3. 浏览器打开 `http://127.0.0.1:3000`

## 环境变量

- `NEXT_PUBLIC_API_BASE`
  - 前端请求 FastAPI 后端的地址
  - 本地示例：`http://127.0.0.1:8000`
  - 线上示例：`https://your-backend.up.railway.app`

## 生产构建

```bash
npm run build
npm run start
```

## Vercel 部署

### 推荐配置

- Framework Preset：`Next.js`
- Build Command：`npm run build`
- Install Command：`npm install`
- Output Directory：留空，使用 Vercel 对 Next.js 的自动识别

### 需要配置的环境变量

- `NEXT_PUBLIC_API_BASE=https://your-backend.up.railway.app`

### 路由刷新

当前前端使用 Next.js App Router。在 Vercel 上部署时，页面刷新和深层路由访问由 Next.js 原生处理，不需要额外的 SPA rewrite 配置。

### GitHub 持续部署步骤

1. 将仓库推送到 GitHub
2. 登录 Vercel 并导入仓库
3. Root Directory 选择 `frontend`
4. 填写 `NEXT_PUBLIC_API_BASE`
5. 点击 Deploy

### 自定义域名

部署完成后，在 Vercel 项目的 `Settings > Domains` 中绑定自定义域名。

## 管理员后台

管理员后台入口：

- `/admin/login`

后台功能包括：

- 首页文案编辑
- 案例内容编辑
- 风险规则编辑
- 展示配置编辑

默认管理员账号密码由后端环境变量控制：

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
