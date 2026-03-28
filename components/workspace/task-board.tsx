"use client";

import { useMemo, useState } from "react";
import type { ProjectTaskRecord } from "@/lib/types/project";

type TaskBoardProps = {
  projectId: string;
  initialTasks: ProjectTaskRecord[];
};

type GroupedTasks = {
  phaseKey: string;
  phaseTitle: string;
  tasks: ProjectTaskRecord[];
};

function groupTasks(tasks: ProjectTaskRecord[]): GroupedTasks[] {
  const grouped = new Map<string, GroupedTasks>();

  for (const task of tasks) {
    const existing = grouped.get(task.phaseKey);

    if (existing) {
      existing.tasks.push(task);
      continue;
    }

    grouped.set(task.phaseKey, {
      phaseKey: task.phaseKey,
      phaseTitle: task.phaseTitle,
      tasks: [task],
    });
  }

  return Array.from(grouped.values());
}

export function TaskBoard({ projectId, initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const groupedTasks = useMemo(() => groupTasks(tasks), [tasks]);
  const completedCount = tasks.filter((task) => task.isDone).length;

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
      <div className="surface-panel space-y-4 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">执行进度面板</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              任务已经初始化到数据库中，你可以直接勾选已完成项，系统会自动保存进度。
            </p>
          </div>
          <div className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-blue-800">
            总进度：{completedCount} / {tasks.length} 已完成
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        {groupedTasks.map((group, index) => (
          <section key={group.phaseKey} className="surface-panel space-y-5 p-6 md:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                阶段 {index + 1}
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">{group.phaseTitle}</h3>
            </div>

            <div className="grid gap-4">
              {group.tasks.map((task) => {
                const isPending = pendingTaskId === task.id;

                return (
                  <label
                    key={task.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-5 py-5 transition ${
                      task.isDone
                        ? "border-emerald-200 bg-emerald-50"
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
