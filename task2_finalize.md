# task2_finalize.md - task2 收尾提交

## 任务目标
基于已经完成的 task2 改动，完成本任务的最终收尾：检查 Git 状态、确认 .env 未进入版本控制、提交本地代码，并推送到 GitHub。

## 本次只做这些
1. 检查当前 git status
2. 确认 `.env` 没有被加入 Git
3. 如果 `.env` 被误加入，立刻移除暂存或追踪
4. 执行：
   - git add .
   - git commit -m "finish task2"
   - git push
5. 汇报 push 是否成功

## 严格限制
1. 不要修改业务代码
2. 不要扩展到 task3
3. 不要改数据库密码
4. 不要把 `.env`、真实密钥、Supabase 密码提交到 Git
5. 如果 push 失败，只报告错误，不要擅自重置仓库

## 你开始前先做的事
先输出：
1. 当前会检查哪些内容
2. 如何确认 `.env` 没进 Git
3. 准备执行哪些 git 命令
4. 这次不会做哪些内容

等我确认后再执行。

## 完成后你要汇报
1. git status 结果
2. `.env` 是否安全
3. commit 是否成功
4. push 是否成功
5. 当前最新 commit message
