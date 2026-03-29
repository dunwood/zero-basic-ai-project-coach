"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CurrentTaskActionPanelProps = {
  projectId: string;
  nextActionHref: string;
  nextActionLabel: string;
  recommendedTaskTitle?: string;
};

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  buttonLabel: string;
};

function ActionLink({ item }: { item: ChecklistItem }) {
  const className =
    "inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400";

  if (item.disabled || !item.href) {
    return (
      <button type="button" disabled className={className}>
        {item.buttonLabel}
      </button>
    );
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {item.buttonLabel}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {item.buttonLabel}
    </Link>
  );
}

export function CurrentTaskActionPanel({
  projectId,
  nextActionHref,
  nextActionLabel,
  recommendedTaskTitle,
}: CurrentTaskActionPanelProps) {
  const storageKey = useMemo(() => `workspace-action-checklist-${projectId}`, [projectId]);
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as string[];
    } catch {
      return [];
    }
  });

  const checklist: ChecklistItem[] = [
    {
      id: "read-task",
      title: "第 1 步：看清任务",
      description: recommendedTaskTitle
        ? `先看清当前任务：${recommendedTaskTitle}`
        : "先看清当前阶段要做什么，再开始动手。",
      href: nextActionHref,
      buttonLabel: nextActionLabel,
    },
    {
      id: "open-ai-tool",
      title: "第 2 步：去 AI 工具里操作",
      description: "当前项目还没有绑定具体工具入口，请按你的路线手动打开后再回来继续。",
      disabled: true,
      buttonLabel: "去打开 AI 编程工具",
    },
    {
      id: "verify-local",
      title: "第 3 步：做本地验证",
      description: "在你自己的终端里运行验证命令，确认这一步已经做完。",
      disabled: true,
      buttonLabel: "去本地验证",
    },
    {
      id: "git-commit",
      title: "第 4 步：执行 git commit",
      description: "提交代码这一步仍然在你自己的终端里完成，做完后回来勾选。",
      disabled: true,
      buttonLabel: "去执行 git commit",
    },
    {
      id: "git-push",
      title: "第 5 步：执行 git push",
      description: "推送完成后回到这里，继续下一步。",
      disabled: true,
      buttonLabel: "去执行 git push",
    },
    {
      id: "return-workspace",
      title: "第 6 步：回到这里继续",
      description: "做完一项就回来勾选，再进入下一步，不需要一次记住所有步骤。",
      href: `/workspace/${projectId}`,
      buttonLabel: "返回工作区",
    },
  ];

  function toggleItem(id: string) {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="surface-panel space-y-5 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">当前任务操作区</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          这里是边做边走的操作台。每做完一步，就回来手动勾选继续。
        </p>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => {
          const isDone = completed.includes(item.id);

          return (
            <div key={item.id} className="rounded-3xl border border-border bg-white p-5">
              <div className="flex items-start gap-3">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <div className="flex-1 space-y-3">
                  <label htmlFor={item.id} className="block text-base font-semibold text-slate-900">
                    {item.title}
                  </label>
                  <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                  <ActionLink item={item} />
                  <p className="text-sm text-muted-foreground">完成后返回这里继续。</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
