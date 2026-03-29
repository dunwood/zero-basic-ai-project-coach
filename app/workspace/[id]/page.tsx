import Link from "next/link";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { WorkspaceEmptyState } from "@/components/workspace/workspace-empty-state";
import { WorkspaceQuickLinks } from "@/components/workspace/workspace-quick-links";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { SectionHeader } from "@/components/ui/section-header";
import { deploymentChecklist } from "@/lib/data/deployment-checklist";
import { ensureProjectTasks, getProjectById } from "@/lib/server/projects";
import { getProjectOverview } from "@/lib/project-stage";
import { buildTaskExecutionState } from "@/lib/server/task-plan";

type WorkspaceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default async function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
  const { id } = await params;
  const baseProject = await getProjectById(id);

  if (!baseProject) {
    return (
      <WorkspaceEmptyState
        eyebrow="项目工作区"
        title="没有找到这个项目"
        description="可能是链接已经失效，或者这个项目还没有创建成功。"
        note="你可以重新创建一个项目，系统会从想法输入开始，带你继续走完整条路径。"
        actions={[
          { href: "/project/new", label: "创建新项目" },
          { href: "/", label: "返回首页", variant: "secondary" },
        ]}
      />
    );
  }

  const project =
    baseProject.status === "clarified" && baseProject.clarification
      ? ((await ensureProjectTasks(id)) ?? baseProject)
      : baseProject;

  const overview = getProjectOverview(project);
  const executionState = buildTaskExecutionState(project);

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回上一步", type: "back", fallbackHref: "/project/new" },
          ]}
        />

        <SectionHeader
          eyebrow="项目工作区"
          title={project.title}
          description="这里会把当前阶段、下一步动作和关键入口集中展示，帮助你知道现在该继续做什么。"
        />

        <div className="surface-panel grid gap-6 p-6 md:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.9fr)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                状态：{project.status}
              </span>
              <span className="text-sm text-muted-foreground">
                创建时间：{formatDate(project.createdAt)}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">{overview.currentStageTitle}</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {overview.currentStageDescription}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white px-5 py-5">
              <h3 className="text-sm font-semibold text-slate-900">你的项目想法</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {project.idea}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>
                已回答问题数：
                {project.clarification ? Object.keys(project.clarification.answers).length : 0}
              </span>
              <span>
                任务进度：{executionState.done} / {executionState.total}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/workspace/${project.id}/project`}
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                查看项目详情
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回首页
              </Link>
            </div>
          </div>

          <aside className="space-y-4 rounded-3xl border border-border bg-[#fcfbf7] p-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">下一步</p>
              <h2 className="text-xl font-semibold text-slate-900">{overview.nextAction.label}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{overview.nextAction.description}</p>
            </div>

            <Link
              href={overview.nextAction.href}
              className="inline-flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              {overview.nextAction.label}
            </Link>

            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
              如果你只是想回看当前阶段，也可以直接使用下方阶段导航入口。
            </div>

            <Link
              href={`/workspace/${project.id}/project`}
              className="inline-flex w-full justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              查看项目详情
            </Link>
          </aside>
        </div>

        <WorkspaceStepNav
          projectId={project.id}
          stages={overview.stages}
          currentKey={overview.currentStageKey}
          showPager={false}
        />

        <WorkspaceQuickLinks
          title="常用入口"
          description="如果你这次只是想回看某一页，或者从中间某个阶段继续，也可以直接从这里进入。"
          links={[
            { href: `/workspace/${project.id}/project`, label: "项目详情" },
            { href: `/workspace/${project.id}/clarify`, label: "需求澄清" },
            { href: `/workspace/${project.id}/design`, label: "设计书预览" },
            { href: `/workspace/${project.id}/review`, label: "设计书确认" },
            { href: `/workspace/${project.id}/tasks`, label: "任务执行台", variant: "primary" },
          ]}
        />

        {project.status === "clarified" ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]">
            <div className="surface-panel space-y-4 p-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">任务摘要</p>
                <h2 className="text-xl font-semibold text-slate-900">{executionState.statusTitle}</h2>
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
            </div>

            <div className="surface-panel space-y-4 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">推荐任务</p>
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
                  <h2 className="text-xl font-semibold text-slate-900">当前没有待办推荐任务</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    所有任务都已经完成，可以回顾成果并准备下一轮迭代。
                  </p>
                </>
              )}
              <Link
                href={`/workspace/${project.id}/tasks`}
                className="inline-flex w-full justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                进入任务执行台
              </Link>
            </div>
          </section>
        ) : null}

        <section className="surface-panel space-y-5 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">部署前检查</p>
            <h2 className="text-xl font-semibold text-slate-900">上线前再过一遍关键收口项</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              当前版本已经把主要流程串起来了。正式演示或部署前，可以先按这份清单快速自检。
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {deploymentChecklist.map((item, index) => (
              <div key={item} className="rounded-2xl border border-border bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  检查 {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
