"use client";

import { useMemo, useState } from "react";
import type {
  ProjectTaskExecutionState,
  ProjectTaskPhaseGroup,
  ProjectTaskRecord,
} from "@/lib/types/project";

type TaskBoardProps = {
  projectId: string;
  initialTasks: ProjectTaskRecord[];
  initialExecutionState: ProjectTaskExecutionState;
};

function buildExecutionStateFromClient(
  tasks: ProjectTaskRecord[],
  phaseGroups: ProjectTaskPhaseGroup[],
): ProjectTaskExecutionState {
  const done = tasks.filter((task) => task.isDone).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const recommendedTask = tasks.find((task) => !task.isDone) ?? null;

  let statusTitle = "还没有可执行任务";
  let statusDescription = "当前任务清单还是空的，请稍后刷新或回到工作区重新检查项目状态。";

  if (total > 0 && done === 0) {
    statusTitle = "准备开始第一项任务";
    statusDescription = "设计书确认已经完成，接下来建议先从推荐任务开始推进。";
  } else if (done > 0 && done < total) {
    statusTitle = "任务执行进行中";
    statusDescription = "你已经完成了一部分任务，继续沿着当前推荐任务往前推进就好。";
  } else if (total > 0 && done === total) {
    statusTitle = "你已经完成全部任务";
    statusDescription = "当前任务清单已经全部勾选完成，可以回顾设计书和整体流程，准备下一轮扩展。";
  }

  return {
    total,
    done,
    percent,
    statusTitle,
    statusDescription,
    recommendedTask: recommendedTask
      ? {
          id: recommendedTask.id,
          title: recommendedTask.title,
          description: recommendedTask.description,
          phaseKey: recommendedTask.phaseKey,
          phaseTitle: recommendedTask.phaseTitle,
        }
      : null,
    phaseGroups,
  };
}

export function TaskBoard({ projectId, initialTasks, initialExecutionState }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const executionState = useMemo(() => {
    const phaseGroups = initialExecutionState.phaseGroups.map((group) => {
      const groupTasks = tasks.filter((task) => task.phaseKey === group.phaseKey);

      return {
        ...group,
        total: groupTasks.length,
        done: groupTasks.filter((task) => task.isDone).length,
        tasks: groupTasks,
      };
    });

    return buildExecutionStateFromClient(tasks, phaseGroups);
  }, [initialExecutionState.phaseGroups, tasks]);

  async function handleToggle(taskId: string, nextIsDone: boolean) {
    setError("");
    setPendingTaskId(taskId);

    const previousTasks = tasks;
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, isDone: nextIsDone } : task)),
    );

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDone: nextIsDone }),
      });

      const result = (await response.json()) as
        | { success: true; task: { id: string; isDone: boolean } }
        | { success: false; error: string };

      if (!response.ok || !result.success) {
        throw new Error(result.success ? "任务更新失败。" : result.error);
      }
    } catch (caughtError) {
      setTasks(previousTasks);
      setError(caughtError instanceof Error ? caughtError.message : "任务更新失败，请稍后再试。");
    } finally {
      setPendingTaskId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]">
        <section className="surface-panel space-y-5 p-6 md:p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">总进度</p>
            <h2 className="text-2xl font-semibold text-slate-900">{executionState.statusTitle}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {executionState.statusDescription}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white px-4 py-4">
              <p className="text-xs text-muted-foreground">总任务数</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{executionState.total}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white px-4 py-4">
              <p className="text-xs text-muted-foreground">已完成</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{executionState.done}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white px-4 py-4">
              <p className="text-xs text-muted-foreground">完成度</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{executionState.percent}%</p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-slate-900 transition-all"
              style={{ width: `${executionState.percent}%` }}
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </section>

        <aside className="surface-panel space-y-4 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">当前推荐任务</p>
            {executionState.recommendedTask ? (
              <>
                <h2 className="text-xl font-semibold text-slate-900">
                  {executionState.recommendedTask.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  所在阶段：{executionState.recommendedTask.phaseTitle}
                </p>
                <p className="text-sm leading-6 text-slate-700">
                  {executionState.recommendedTask.description ?? "建议先从这条未完成任务开始推进。"}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-900">你已经完成全部任务</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  当前阶段没有新的推荐任务了，可以回顾设计书和整体成果，准备下一轮扩展。
                </p>
              </>
            )}
          </div>
        </aside>
      </div>

      <div className="space-y-6">
        {executionState.phaseGroups.map((group, index) => (
          <section key={group.phaseKey} className="surface-panel space-y-5 p-6 md:p-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    阶段 {index + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">{group.phaseTitle}</h3>
                </div>
                <div className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-blue-800">
                  {group.done} / {group.total} 已完成
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{group.phaseDescription}</p>
            </div>

            <div className="grid gap-4">
              {group.tasks.map((task) => {
                const isPending = pendingTaskId === task.id;
                const isRecommended = executionState.recommendedTask?.id === task.id;

                return (
                  <label
                    key={task.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-5 py-5 transition ${
                      task.isDone
                        ? "border-emerald-200 bg-emerald-50"
                        : isRecommended
                          ? "border-blue-200 bg-blue-50"
                          : "border-border bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.isDone}
                      disabled={isPending}
                      onChange={(event) => handleToggle(task.id, event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-slate-900 focus:ring-slate-400"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-base font-semibold text-slate-900">{task.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {task.isDone ? "已完成" : isPending ? "保存中..." : "待处理"}
                        </span>
                        {isRecommended ? (
                          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-800">
                            推荐先做
                          </span>
                        ) : null}
                      </div>
                      {task.description ? (
                        <p className="text-sm leading-6 text-slate-700">{task.description}</p>
                      ) : null}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
