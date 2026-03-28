# task11 — 设计书确认页 + 进入任务执行主流程

## 目标
在当前已完成 task1 ~ task10 的基础上，补上一个更像正式产品流程的“设计书确认页”，让用户在完成需求澄清后，可以先查看设计书摘要，再点击主按钮进入任务执行阶段。

本次重点不是新增复杂能力，而是把已有流程串得更顺：

- 工作区 `/workspace/[id]`
- 设计书预览 `/workspace/[id]/design`
- 新增确认页 `/workspace/[id]/review`
- 任务执行页 `/workspace/[id]/tasks`

形成更清晰的主链路。

---

## 本次范围

### 需要完成
1. **新增 `/workspace/[id]/review` 页面**
2. **把 review 页作为“设计书确认并进入任务执行”的正式入口**
3. **补齐三个页面之间的入口衔接**
   - workspace
   - design
   - review
4. **优化当前阶段与 next step 展示**
5. **基础异常处理**
   - not found
   - 未完成澄清时禁止进入正式 review 流程

### 不要做
- 不要接真实 AI
- 不要新增数据库表
- 不要做设计书编辑
- 不要做任务拖拽/复杂状态
- 不要做项目编辑/删除
- 不要接登录系统
- 不要超范围重构

---

## 页面设计

### 1. `/workspace/[id]/review`
这个页面的定位：
**在用户准备正式进入执行前，做一次“设计书确认”。**

建议包含这些区块：

#### 页面头部
- 标题：`确认你的项目设计书`
- 简短说明：
  - 例如：`在进入任务执行前，先确认这个版本是否已经足够清晰。当前版本先基于你的项目想法和需求澄清整理而成。`

#### 项目摘要区块
复用已有 design brief 逻辑，把这些内容做摘要展示：
- 项目名称
- 一句话概述
- 目标用户
- 核心问题
- 核心功能（精简版）
- MVP

#### 当前阶段区块
展示类似：
- 当前状态：`clarified`
- 当前阶段：`设计书确认`
- 下一步：`进入任务执行`

#### 主操作区块
至少要有两个入口：
- `返回设计书预览`
- `确认并进入任务执行`

点击“确认并进入任务执行”后：
- 直接跳转到 `/workspace/[id]/tasks`
- 本次不要求额外写数据库状态
- 重点是完成流程层面的正式入口

---

## 入口衔接要求

### 1. `/workspace/[id]`
在 clarified 项目下，工作区要能更明确地区分：
- 查看设计书预览
- 确认设计书并进入任务执行
- 查看任务清单 / 任务执行面板

不一定三个按钮都很重，但至少要让用户能理解主流程。

### 2. `/workspace/[id]/design`
设计书预览页要增加：
- `去确认这份设计书`
- `直接查看任务清单`（可以保留）

但视觉上，`去确认这份设计书` 应该更像主入口。

### 3. `/workspace/[id]/review`
确认页承担“正式过渡”作用：
- 从 design 来
- 去 tasks

---

## 状态处理

### clarified 项目
- 可以访问 `/workspace/[id]/review`
- 可以正常看到确认页内容
- 可以点击进入 `/workspace/[id]/tasks`

### draft / clarifying 项目
访问 `/workspace/[id]/review` 时：
- 不直接崩溃
- 给出友好提示：`你还没有完成需求澄清，暂时不能确认设计书。`
- 提供返回工作区 / 去完成澄清入口

### not found
访问不存在项目：
- 显示友好提示
- 提供回到项目创建页入口

---

## 复用建议

尽量复用已有：
- `lib/server/design-brief.ts`
- `lib/server/projects.ts`
- `lib/project-stage.ts`
- 当前 workspace / design 页面已有样式与状态卡片风格

目标是：
**少造新轮子，优先复用已有数据整理逻辑。**

---

## 验收标准

### 功能验收
1. clarified 项目可以访问 `/workspace/[id]/review`
2. review 页可以展示设计书摘要内容
3. review 页可以跳转回 design
4. review 页可以跳转到 tasks
5. workspace 页出现更清晰的设计书确认入口
6. design 页出现“去确认这份设计书”入口
7. 未完成澄清的项目访问 review 会看到友好提示
8. 不存在项目访问 review 会看到友好提示

### 代码验收
- TypeScript 无明显类型报错
- 不引入无关重构
- 风格与现有页面一致
- `next build` 通过

---

## 本地验证要求
完成代码后，优先由 Codex 自动完成这些验证：

1. `npm run build`
2. 启动本地开发服务
3. 验证 clarified 项目的：
   - `/workspace/[id]`
   - `/workspace/[id]/design`
   - `/workspace/[id]/review`
   - `/workspace/[id]/tasks`
4. 验证 draft 或 clarifying 项目的 `/workspace/[id]/review`
5. 验证不存在项目的 `/workspace/not-exist/review`
6. 确认 `.env` 没进入 Git

---

## 最终收尾规则
本任务完成标准仍然是完整闭环：

1. Codex 改代码
2. Codex 自动验证
3. 我人工点网页确认
4. Git commit
5. Git push

**没有 push 到 GitHub，不算 task11 完成。**

---

## Git 提交要求
验证通过后执行：

```bash
git status
git add .
git commit -m "finish task11"
git push
```

---

## 给 Codex 的要求
- 先读 `AGENTS.md` 和本文件
- 严格按 task11 范围实现
- 先做最小闭环
- 不要自作主张扩展功能
- 完成后只汇报：
  1. 改了哪些文件
  2. 实际执行了哪些命令
  3. 哪些验证通过了
  4. git push 是否成功
  5. 最新 commit hash
