# task5 — 澄清回答填写页 + 保存回答最小闭环

## 目标
在 task4 已完成的基础上，继续把“需求澄清流程”往前推进一小步：

- 用户进入 `/workspace/[id]/clarify`
- 能看到固定静态澄清问题
- 能填写每个问题的回答
- 提交后把回答保存到数据库
- 保存成功后，项目状态从 `clarifying` 进入 `clarified`
- 返回工作区后，能看到“已完成澄清”的状态与摘要入口占位

这次仍然**不要**进入真正的 AI 生成设计书阶段。

---

## 本次范围

### 需要完成
1. **新增澄清回答数据模型**
   - 推荐单独建表 `ProjectClarification`
2. **保存澄清回答 API**
   - `POST /api/projects/[id]/clarify`
3. **读取已保存澄清回答能力**
   - 进入 clarify 页时，如已存在回答，应能回填
4. **澄清页表单化**
   - `app/workspace/[id]/clarify/page.tsx`
   - 每个固定问题对应一个输入区域
5. **项目状态流转最小闭环**
   - 保存澄清回答成功后，把项目状态更新为 `clarified`
6. **工作区页展示澄清完成结果**
   - `app/workspace/[id]/page.tsx`
   - 至少显示：
     - 当前状态为 `clarified`
     - 已完成澄清
     - 一个“下一步将生成设计书”的占位块
7. **基础异常处理**
   - 项目不存在
   - 提交空回答
   - 保存失败

### 不要做
- 不要接入真实 AI
- 不要生成设计书
- 不要做任务拆解
- 不要做项目列表页
- 不要做登录系统
- 不要做复杂富文本
- 不要做多用户逻辑
- 不要做超范围重构

---

## 数据模型建议

推荐新增模型：`ProjectClarification`

建议字段：

- `id`: `String @id @default(cuid())`
- `projectId`: `String @unique`
- `answers`: `Json`
- `createdAt`: `DateTime @default(now())`
- `updatedAt`: `DateTime @updatedAt`
- 与 `Project` 建立一对一关系

说明：
- 这次为了最小闭环，`answers` 直接存 JSON 即可
- JSON 结构可以是：

```json
{
  "targetUsers": "给准备求职的大学生用",
  "coreProblem": "他们不知道怎么把经历整理成简历",
  "mainFlow": "输入经历，生成初稿，再手动修改",
  "successStandard": "能在 10 分钟内拿到一版可投递初稿"
}
```

你也可以按固定问题 key 自行命名，但要保持清晰稳定。

---

## API 约定

### `POST /api/projects/[id]/clarify`
用途：保存或覆盖当前项目的澄清回答。

请求体示例：
```json
{
  "answers": {
    "targetUsers": "给准备求职的大学生用",
    "coreProblem": "他们不知道怎么把经历整理成简历",
    "mainFlow": "输入经历，生成初稿，再手动修改",
    "successStandard": "能在 10 分钟内拿到一版可投递初稿"
  }
}
```

成功返回示例：
```json
{
  "success": true,
  "project": {
    "id": "...",
    "status": "clarified"
  },
  "clarification": {
    "projectId": "...",
    "answers": {
      "targetUsers": "..."
    }
  }
}
```

失败返回示例：
```json
{
  "success": false,
  "error": "错误信息"
}
```

### 校验规则
- `answers` 必须存在
- 每个固定问题的回答去掉首尾空格后不能为空
- 可以只做最基础校验，不要复杂化

### 可选补充
如果你觉得方便，也可以补一个：
- `GET /api/projects/[id]/clarify`

用于读取已保存的澄清回答。

但如果你能在 server 层直接取数并在页面回填，也可以不单独做这个 GET。

---

## 页面要求

### 1. `/workspace/[id]/clarify`
目标：从“问题展示页”升级为“可填写并保存的澄清页”。

至少包含：
- 页面标题
- 当前项目标题
- 当前项目 idea
- 固定静态问题列表
- 每个问题对应 textarea 或 input
- 保存按钮
- 提交中状态
- 保存成功提示或跳转
- 返回工作区入口

交互要求：
- 若项目已有已保存回答，打开页面时要能回填
- 点击保存后：
  - 调用保存接口
  - 成功后可跳转回 `/workspace/[id]`
- 页面文案继续保持面向零基础用户，简单直接

### 2. `/workspace/[id]`
目标：让用户知道澄清已完成，并看到下一步占位。

至少新增：
- 当状态为 `clarified` 时，显示“已完成需求澄清”提示
- 可简要显示已回答条数或摘要占位
- 一个新的占位块，例如：
  - “下一步，我们会根据这些回答生成设计书。”
  - 按钮先 disabled 或仅展示“即将开放”文案

---

## 固定问题建议

继续复用 task4 的固定静态问题，建议至少包括这 4 个：

1. 这个产品主要给谁用？
2. 他们现在最核心的痛点是什么？
3. 他们会怎样一步步使用这个产品？
4. 你怎样判断这个产品已经做到了最小可用？

要求：
- 问题 key 保持稳定，便于保存与回填
- 文案可以微调，但不要扩成复杂问卷

---

## 实现建议

建议新增或修改这些位置：

- `app/api/projects/[id]/clarify/route.ts`
- `app/workspace/[id]/clarify/page.tsx`
- `app/workspace/[id]/page.tsx`
- `lib/server/projects.ts`
- `lib/types/project.ts`
- `lib/constants/clarify-questions.ts`
- `prisma/schema.prisma`
- `prisma/migrations/...`

如果需要增加一个很小的表单组件，也可以新增，但保持最小。

---

## 验收标准

### 功能验收
1. 打开 `/workspace/[id]/clarify`，能看到问题和输入框
2. 能填写并提交所有问题回答
3. 提交后数据成功写入数据库
4. 再次进入 clarify 页时能看到回填内容
5. 保存成功后项目状态变为 `clarified`
6. 返回 `/workspace/[id]` 能看到澄清完成状态
7. 项目不存在时有友好提示
8. 空回答提交时有清晰错误提示

### 代码验收
- `next build` 通过
- TypeScript 无明显类型报错
- 改动尽量小而集中
- 不引入 task5 以外的大改动

---

## 验证与收尾规则
这次继续沿用上个任务的协作方式：

1. Codex 先自动实现
2. Codex 优先自己完成本地验证
3. **最后再让我人工点网页确认**
4. 验证通过后，再执行 git commit 和 git push

### Git 提交要求
验证通过后执行：

```bash
git status
git add .
git commit -m "finish task5"
git push
```

**没有 push 到 GitHub，不算 task5 完成。**

---

## 给 Codex 的要求
- 先读 `AGENTS.md` 和本文件
- 严格按 task5 范围实现
- 优先最小闭环
- 不要自作主张扩展功能
- 尽量自动完成验证
- 完成后只告诉我：
  1. 改了哪些文件
  2. 实际执行了哪些命令
  3. 哪些验证通过了
  4. git push 是否成功
  5. 最新 commit hash
