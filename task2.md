# task2.md - 任务包 2：数据库与路线卡数据层

## 任务目标
在现有 task1 项目骨架基础上，引入数据库和数据层，让路线卡不再完全依赖前端静态文件，而是可以从数据库读取。

这次任务只做“路线卡数据层 + Prisma 初始化 + 基础 API”，不要扩展到项目聊天、设计书生成、登录系统。

## 本次要完成的内容
1. 初始化 Prisma
2. 配置 PostgreSQL 连接（使用环境变量，不写死）
3. 创建以下数据模型：
   - Route
   - RouteStep
4. 编写 Prisma migration
5. 编写 seed 脚本，插入默认路线卡数据
6. 增加基础 API：
   - GET /api/routes
   - GET /api/routes/[id]
7. 将 /routes 页面从静态本地数据改为优先从 API 读取
8. 如果 API 读取失败，可保留静态兜底，但不要删除原有展示能力

## 严格限制
1. 不要接登录系统
2. 不要接用户表
3. 不要接 project / chat / design_doc 相关表
4. 不要实现真实筛选逻辑
5. 不要扩展到 task3 之后
6. 不要顺手做部署配置
7. 不要引入与当前任务无关的大型库

## 技术要求
- 继续使用 Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- 路线数据结构清晰、字段命名直白

## 建议数据模型

### Route
- id
- name
- modelName
- toolName
- shortDescription
- targetUsers
- usageCondition
- installDifficulty
- recommendationTag
- sortOrder
- isActive
- createdAt
- updatedAt

### RouteStep
- id
- routeId
- stepOrder
- title
- content
- successHint
- troubleshootingHint
- createdAt
- updatedAt

## 默认路线数据
至少插入以下 7 条 Route：

1. DeepSeek + OpenCode
2. 通义千问 + 通义灵码
3. 豆包 / 火山方舟 + TRAE
4. 百度千帆 / 文心 + 文心快码
5. ChatGPT + Codex CLI
6. Claude + Claude Code
7. Gemini + Gemini CLI

## API 约定

### GET /api/routes
返回路线列表，按 sortOrder 升序。

### GET /api/routes/[id]
返回单条路线详情，以及该路线关联的 RouteStep。

## 前端改动要求
1. 保持 /routes 页现有 UI 风格不大改
2. 增加数据读取逻辑
3. 优先读取 API 数据
4. 若读取失败，允许回退到本地静态 routes 数据
5. 不做复杂 loading 动画，简单即可

## 你要先做的事
在开始改代码前，请先输出：
1. 你准备新增或修改哪些文件
2. Prisma schema 会怎么设计
3. API 路由会放在哪些文件
4. 这次不会实现哪些内容

等我确认后再开始编码。

## 完成后你要汇报
1. 新增和修改的文件列表
2. migration 是否成功
3. seed 是否成功
4. 本地如何运行
5. 下一步最适合做什么
