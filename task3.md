# task3 — 项目想法输入页 + 项目创建基础流程

## 目标
在当前已完成 task1、task2 的基础上，实现一个最小可用的“项目创建流程”：

- 用户访问 `/project/new`
- 输入自己想做的软件想法
- 提交后创建一条 Project 记录
- 创建成功后跳转到 `/workspace/[id]`
- 在工作区基础页展示该项目的核心信息
- 保持结构简单，不扩展到真实 AI 多轮澄清与设计书生成

---

## 本次范围

### 需要完成
1. **Prisma 新增 Project 模型**
2. **创建项目 API**
   - `POST /api/projects`
3. **项目想法输入页**
   - 页面：`/project/new`
   - 表单字段先保持最小：
     - 项目名称 `title`
     - 项目想法 `idea`
4. **项目工作区基础页**
   - 页面：`/workspace/[id]`
   - 至少展示：
     - 项目名称
     - 项目想法
     - 创建时间
     - 一个“进入后续 AI 澄清流程”的占位提示
5. **基础状态处理**
   - 表单校验
   - 提交中状态
   - API 失败提示
   - 找不到项目时的提示

### 不要做
- 不要接入真实大模型
- 不要做聊天系统
- 不要生成设计书
- 不要做项目列表页
- 不要引入登录鉴权
- 不要做超范围重构

---

## 数据模型建议

在 `prisma/schema.prisma` 中新增 `Project` 模型，建议字段如下：

- `id`：`String @id @default(cuid())`
- `title`：`String`
- `idea`：`String @db.Text`
- `status`：`String @default("draft")`
- `createdAt`：`DateTime @default(now())`
- `updatedAt`：`DateTime @updatedAt`

如果你认为还需要极少量字段，也可以加，但不要超出 task3 最小范围。

---

## API 约定

### `POST /api/projects`
请求体：
```json
{
  "title": "AI 简历优化助手",
  "idea": "我想做一个帮助求职者梳理经历、生成简历初稿的工具。"
}
```

成功返回：
```json
{
  "success": true,
  "project": {
    "id": "...",
    "title": "...",
    "idea": "...",
    "status": "draft",
    "createdAt": "..."
  }
}
```

失败返回：
```json
{
  "success": false,
  "error": "错误信息"
}
```

### 校验规则
- `title` 必填，去除首尾空格后不能为空
- `idea` 必填，去除首尾空格后不能为空
- 可做简单长度限制，但不要复杂化

---

## 页面要求

### 1. `/project/new`
目标：让零基础用户能立刻开始输入想法。

建议页面结构：
- 页面标题
- 一段简短引导文案
- 项目名称输入框
- 项目想法文本框
- 提交按钮
- 提交中禁用按钮
- 出错时展示错误提示

交互要求：
- 创建成功后，前端跳转到 `/workspace/[id]`
- 页面风格尽量复用当前首页和 routes 页已有样式

文案可以保持简单，例如：
- 标题：`先把你想做的软件想法写下来`
- 说明：`不用写得很专业，先把你想解决什么问题、想给谁用、想做成什么样子写出来。`

### 2. `/workspace/[id]`
目标：作为后续 AI 澄清流程入口的基础工作区。

至少包含：
- 项目标题
- 项目 idea
- 状态 badge 或简单文本
- 创建时间
- 一个后续入口占位块，例如：
  - “下一步，我们会把你的想法澄清成一份可执行设计书。”
  - 按钮先做 disabled 或占位文案均可

异常情况：
- 当项目不存在时，返回清晰提示，不要直接空白页报错

---

## 实现建议

### 数据层
- 复用当前 Prisma Client 封装
- 增加 migration
- 本地完成后记得执行 seed 以外必要命令，但本 task 不要求修改 seed

### 目录建议
你可以按当前项目结构灵活处理，但建议类似：

- `src/app/api/projects/route.ts`
- `src/app/project/new/page.tsx`
- `src/app/workspace/[id]/page.tsx`

如果已有工具函数目录，可自行复用，不强制新增过多抽象。

---

## 验收标准

### 功能验收
1. 打开 `/project/new` 可以看到表单
2. 输入合法内容后可成功提交
3. 数据成功写入数据库
4. 页面自动跳转到 `/workspace/[id]`
5. `/workspace/[id]` 能正确显示该项目信息
6. 输入为空时有前端或后端错误提示
7. 项目不存在时页面有友好提示

### 代码验收
- TypeScript 无明显类型报错
- 不引入与 task3 无关的大改动
- 尽量保持文件结构清晰
- 能通过本地基本验证

---

## 你完成代码后，我本地要执行的内容
Codex 完成修改后，需要明确告诉我这些命令该怎么跑，至少包括：

```bash
npm run dev
npx prisma migrate dev --name add_project_model
```

如果你的实现还需要别的本地命令，也请一起列出来，但保持最少。

---

## 最终收尾规则
本任务完成标准不是“代码改了就算完”，而是必须走完整流程：

1. Codex 改代码
2. 我本地验证通过
3. Git commit
4. Git push

**没有 push 到 GitHub，不算 task3 完成。**

---

## Git 提交要求
当我本地验证通过后，再执行：

```bash
git status
git add .
git commit -m "finish task3"
git push
```

推送成功后，再视为 task3 完成。

---

## 给 Codex 的要求
- 先读 `AGENTS.md` 和本文件
- 严格按 task3 范围实现
- 先完成最小闭环
- 不要自作主张扩展功能
- 完成后告诉我：
  1. 改了哪些文件
  2. 我需要执行哪些命令
  3. 我应该如何验证
