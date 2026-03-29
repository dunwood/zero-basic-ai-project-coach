# 零基础 AI 项目教练

这是一个基于 Next.js App Router、TypeScript、Tailwind CSS、Prisma 和 PostgreSQL 的 Web App，当前已经整理到适合部署到 Vercel 的状态。

## 本地开发

1. 安装依赖：`npm install`
2. 准备环境变量：复制 `.env.example` 到 `.env`
3. 启动开发：`npm run dev`

## Vercel 部署最小要求

### 必填环境变量

- `DATABASE_URL`
  - 用途：Next.js 运行期和 Prisma Client 访问 Supabase Postgres
  - 推荐来源：Supabase 项目的 pooled connection string

### 可选环境变量

- `DIRECT_URL`
  - 用途：仅在你本地运行 `prisma migrate` 时，作为直连数据库使用
  - 推荐来源：Supabase 项目的 direct connection string

## Vercel 部署

1. 把仓库推到 GitHub
2. 在 Vercel 中 `Add New -> Project`
3. 选择这个 GitHub 仓库并导入
4. 在项目设置里的 `Environment Variables` 添加 `DATABASE_URL`
5. 点击 `Deploy`

部署完成后，Vercel 会分配一个 `*.vercel.app` 域名。

## Cloudflare 子域名接入

1. 打开 Cloudflare 对应站点
2. 进入 `DNS`
3. 新增 `CNAME`
4. `Name` 填你要用的子域名，例如 `app`
5. `Target` 填 Vercel 分配的 `*.vercel.app`
6. 代理状态建议先设为 `DNS only`
7. 回到 Vercel 项目 `Settings -> Domains`，把这个子域名加进去

等 Vercel 验证通过后即可访问。
