# 零基础 AI 项目教练

这是一个基于 Next.js App Router、TypeScript、Tailwind CSS、Prisma 和 PostgreSQL 的 Web App。当前默认部署指导路径已经统一为 Cloudflare。

## 本地开发

1. 安装依赖：`npm install`
2. 准备环境变量：复制 `.env.example` 到 `.env`
3. 启动开发：`npm run dev`

## Cloudflare 部署最小要求

### 必填环境变量

- `DATABASE_URL`
  - 用途：Next.js 运行期和 Prisma Client 访问 Supabase Postgres
  - 推荐来源：Supabase 项目的 pooled connection string

### 可选环境变量

- `DIRECT_URL`
  - 用途：仅在你本地运行 `prisma migrate` 时，作为直连数据库使用
  - 推荐来源：Supabase 项目的 direct connection string

## Cloudflare 默认部署路径

1. 把仓库推到 GitHub
2. 打开 Cloudflare Dashboard
3. 进入 `Workers & Pages`
4. 选择创建 Pages 项目并连接 GitHub 仓库
5. 在项目设置里补齐 `DATABASE_URL`
6. 完成构建和部署

如果你后面要接自定义域名，也建议继续走 Cloudflare 的域名和 Pages 配置路径。

## 兼容说明

- 当前项目的用户默认指引已经统一为 Cloudflare
- 如果你的网络环境合适，技术上也可以自行改走 Vercel，但它不再作为默认推荐路径
