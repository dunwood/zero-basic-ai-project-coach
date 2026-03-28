# task_db_setup.md - 数据库连接与 Prisma 落地

## 任务目标
基于已经完成的 task2 代码，把 Supabase PostgreSQL 真正接入当前项目，并跑通 Prisma generate、migration、seed。

## 本次只做这些
1. 检查当前 Prisma 配置是否完整
2. 创建或更新项目根目录下的 `.env`（如果需要，先给出模板，不要擅自写入真实密钥）
3. 确认 `.gitignore` 已忽略 `.env`
4. 检查 `package.json` 里的 Prisma 脚本是否可用
5. 在我提供 DATABASE_URL / DIRECT_URL 后，指导或执行：
   - npm run prisma:generate
   - npx prisma migrate dev --name init_routes
   - npm run prisma:seed
6. 如果命令失败，优先修复最小范围问题
7. 成功后验证 `/api/routes` 能返回数据
8. 成功后验证 `/routes` 页面优先读 API，失败时仍可 fallback

## 严格限制
1. 不要扩展到 task3
2. 不要接登录系统
3. 不要新加无关表
4. 不要改首页和其他无关页面
5. 不要顺手做部署配置
6. 不要提交真实密钥到 Git

## 你开始前先做的事
先输出：
1. 你将检查或修改哪些文件
2. 你需要我提供什么 Supabase 连接信息
3. 你准备执行哪些命令
4. 这次不会做哪些内容

等我确认后再执行。

## 完成后你要汇报
1. 最终新增/修改了哪些文件
2. generate 是否成功
3. migrate 是否成功
4. seed 是否成功
5. `/api/routes` 是否可访问
6. `/routes` 是否已优先读取数据库
