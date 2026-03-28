import Link from "next/link";
import type { ProjectStageItem, ProjectStageKey } from "@/lib/types/project";

type WorkspaceStepNavProps = {
  projectId: string;
  stages: ProjectStageItem[];
  currentKey: ProjectStageKey;
  showPager?: boolean;
};

const orderedStageKeys: ProjectStageKey[] = ["created", "clarify", "design", "review", "tasks"];

const stageHrefMap: Record<ProjectStageKey, (projectId: string) => string> = {
  created: (projectId) => `/workspace/${projectId}/project`,
  clarify: (projectId) => `/workspace/${projectId}/clarify`,
  design: (projectId) => `/workspace/${projectId}/design`,
  review: (projectId) => `/workspace/${projectId}/review`,
  tasks: (projectId) => `/workspace/${projectId}/tasks`,
};

const stateClassNameMap = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  current: "border-blue-200 bg-blue-50 text-blue-800",
  upcoming: "border-border bg-white text-slate-600",
} as const;

const stateLabelMap = {
  completed: "已完成",
  current: "当前阶段",
  upcoming: "未开始",
} as const;

export function WorkspaceStepNav({
  projectId,
  stages,
  currentKey,
  showPager = true,
}: WorkspaceStepNavProps) {
  const orderedStages = orderedStageKeys
    .map((key) => stages.find((stage) => stage.key === key))
    .filter((stage): stage is ProjectStageItem => Boolean(stage))
    .map((stage) => ({
      ...stage,
      href: stageHrefMap[stage.key](projectId),
      isCurrentPage: stage.key === currentKey,
    }));

  const currentIndex = orderedStages.findIndex((stage) => stage.key === currentKey);
  const previousStage = currentIndex > 0 ? orderedStages[currentIndex - 1] : null;
  const nextStage =
    currentIndex >= 0 && currentIndex < orderedStages.length - 1 ? orderedStages[currentIndex + 1] : null;

  return (
    <section className="surface-panel space-y-5 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">统一步骤导航</p>
          <h2 className="text-lg font-semibold text-slate-900">按同一条路径继续推进项目</h2>
        </div>
        <p className="text-sm text-muted-foreground">当前页面和工作区主流程会共用同一套步骤状态。</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {orderedStages.map((stage) => (
          <Link
            key={stage.key}
            href={stage.href}
            className={`rounded-2xl border px-4 py-4 transition hover:border-slate-400 ${
              stage.isCurrentPage
                ? "border-slate-900 bg-slate-900 text-white"
                : stateClassNameMap[stage.state]
            }`}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">{stage.title}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    stage.isCurrentPage
                      ? "border-white/30 bg-white/10 text-white"
                      : stateClassNameMap[stage.state]
                  }`}
                >
                  {stage.isCurrentPage ? "当前页" : stateLabelMap[stage.state]}
                </span>
              </div>
              <p
                className={`text-sm leading-6 ${
                  stage.isCurrentPage ? "text-white/80" : "text-slate-700"
                }`}
              >
                {stage.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {showPager ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-white px-4 py-4">
          {previousStage ? (
            <Link
              href={previousStage.href}
              className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              上一步：{previousStage.title}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">当前已经在最前面的步骤页。</span>
          )}

          {nextStage ? (
            <Link
              href={nextStage.href}
              className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              下一步：{nextStage.title}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">当前已经到最后一步，可回顾整体结果。</span>
          )}
        </div>
      ) : null}
    </section>
  );
}
