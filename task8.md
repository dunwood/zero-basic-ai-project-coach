# task8 — 任务清单落库 + 可勾选执行面板（最小版）

## 目标
在 task7 的静态任务清单基础上，完成一个最小可用的“执行面板”闭环：

- clarified 项目进入 `/workspace/[id]/tasks`
- 首次进入时，如该项目还没有任务记录，则根据现有静态任务清单自动初始化到数据库
- 页面展示数据库中的任务列表
- 用户可以勾选/取消勾选任务完成状态
- 工作区页可看到任务完成进度
- 保持范围最小，不做拖拽、不做复杂筛选、不做多用户协作

---

## 本次范围

### 需要完成
1. **新增 ProjectTask 数据模型**
2. **为 clarified 项目初始化任务**
   - 可在访问任务页时自动初始化
   - 或通过单独 server 逻辑懒初始化
3. **任务清单页改为读取数据库任务**
4. **任务完成状态切换**
   - 勾选完成
   - 取消完成
5. **工作区页显示任务进度**
   - 例如：`已完成 3 / 12`
6. **基础异常处理**
   - 项目不存在
   - 项目未完成澄清
   - 初始化失败
   - 更新失败

### 不要做
- 不要接真实 AI
- 不要做任务拖拽排序
- 不要做任务编辑
- 不要做任务删除
- 不要做复杂筛选搜索
- 不要做项目列表页
- 不要做登录系统
- 不要做无关重构

---

## 数据模型建议

在 `prisma/schema.prisma` 中新增 `ProjectTask` 模型，建议字段：

- `id`：`String @id @default(cuid())`
- `projectId`：`String`
- `phaseKey`：`String`
- `phaseTitle`：`String`
- `title`：`String`
- `description`：`String? @db.Text`
- `sortOrder`：`Int`
- `isDone`：`Boolean @default(false)`
- `createdAt`：`DateTime @default(now())`
- `updatedAt`：`DateTime @updatedAt`

关系：
- `ProjectTask` 属于 `Project`
- 一个 `Project` 可以有多个 `ProjectTask`

建议给 `(projectId, sortOrder)` 加索引，必要时可加唯一约束，但不要复杂化。

---

## API 建议

### 1. `GET /api/projects/[id]/tasks`
返回该项目任务列表。
如果项目已 clarified 且数据库还没有任务，可在这里或 server 层自动初始化。

成功示例：
```json
{
  "success": true,
  "tasks": [
    {
      "id": "...",
      "projectId": "...",
      "phaseKey": "setup",
      "phaseTitle": "项目准备",
      "title": "确认项目目标",
      "description": "...",
      "sortOrder": 1,
      "isDone": false
    }
  ]
}
```

### 2. `PATCH /api/projects/[id]/tasks/[taskId]`
只做最小更新：
```json
{
  "isDone": true
}
```

返回：
```json
{
  "success": true,
  "task": {
    "id": "...",
    "isDone": true
  }
}
```

失败时返回统一错误结构：
```json
{
  "success": false,
  "error": "错误信息"
}
```

---

## 页面要求

### 1. `/workspace/[id]/tasks`
从“静态展示页”升级为“执行面板”。

要求：
- 读取数据库任务
- 按阶段展示任务
- 每个任务带 checkbox 或切换按钮
- 切换后立即更新界面
- 显示完成进度，例如：
  - 总进度：`3 / 12 已完成`
- 风格尽量复用现有 workspace/design/tasks 视觉

状态要求：
- **clarified 且有任务**：正常显示执行面板
- **clarified 但还未初始化任务**：自动初始化后显示
- **未 clarified**：提示先完成需求澄清
- **not found**：显示友好提示

### 2. `/workspace/[id]`
增加任务执行进度展示，例如：
- `任务进度：0 / 12`
- 如果已有完成项则同步显示最新数量

---

## 任务初始化逻辑建议

复用 task7 的静态任务整理逻辑，把其输出转换成数据库记录。

建议做一个最小 server 工具，例如：
- `lib/server/task-plan.ts` 继续保留静态生成逻辑
- 新增一个 server 方法，把静态任务同步为 `ProjectTask` 记录

要求：
- 同一个项目不要重复初始化
- 如果数据库里已有任务，就直接复用，不重复插入

---

## 验收标准

### 功能验收
1. clarified 项目打开 `/workspace/[id]/tasks` 时，会自动拿到数据库任务
2. 页面可以展示任务总数与已完成数
3. 点击某任务可切换完成状态
4. 刷新后状态仍然保留
5. `/workspace/[id]` 可同步显示任务进度
6. draft 项目访问任务页时仍提示先完成需求澄清
7. 不存在项目时仍有友好提示

### 代码验收
- TypeScript 无明显类型报错
- `next build` 通过
- 改动集中，不做无关扩展
- 不破坏 task7 已有页面入口

---

## 你完成代码后，优先自动做这些
1. 本地 build 验证
2. 本地 dev 验证
3. clarified 项目任务初始化验证
4. 任务勾选/取消勾选验证
5. 工作区页进度展示验证
6. `.env` 不进入 Git 验证
7. 验证通过后再 commit + push

---

## 最终收尾规则
本任务完成标准仍然必须走完整流程：

1. Codex 改代码
2. Codex 自测通过
3. 最后再让我人工点网页确认
4. Git commit
5. Git push

**没有 push 到 GitHub，不算 task8 完成。**

---

## Git 提交要求
验证通过后提交：

```bash
git status
git add .
git commit -m "finish task8"
git push
```

---

## 给 Codex 的要求
- 先读 `AGENTS.md` 和本文件
- 严格按 task8 范围实现
- 优先复用 task7 的静态任务结构
- 先做最小可用闭环
- 不要自作主张扩展功能
- 完成后只告诉我：
  1. 改了哪些文件
  2. 实际执行了哪些命令
  3. 哪些验证通过了
  4. git push 是否成功
  5. 最新 commit hash
