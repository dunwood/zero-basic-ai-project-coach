import Link from "next/link";
import { GuidedActionPanel } from "@/components/ui/guided-action-panel";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
import { CurrentTaskActionPanel } from "@/components/workspace/current-task-action-panel";
import { WorkspaceEmptyState } from "@/components/workspace/workspace-empty-state";
import { WorkspaceQuickLinks } from "@/components/workspace/workspace-quick-links";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { commonActionLinks } from "@/lib/data/action-links";
import { deploymentChecklist } from "@/lib/data/deployment-checklist";
import { getProjectOverview } from "@/lib/project-stage";
import { ensureProjectTasks, getProjectById } from "@/lib/server/projects";
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
        description="这个项目可能还没创建成功，或者链接已经失效。"
        note="你可以重新创建项目，然后回到工作区继续。"
        actions={[
          { href: "/project/new", label: "去创建项目" },
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
          description="这里不是纯说明页，而是你的指导式操作台。每做完一步，就回到这里继续下一步。"
        />

        <div className="surface-panel grid gap-6 p-6 md:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.9fr)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                当前状态：{project.status}
              </span>
              <span className="text-sm text-muted-foreground">创建时间：{formatDate(project.createdAt)}</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">{overview.currentStageTitle}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{overview.currentStageDescription}</p>
            </div>

            <div className="rounded-2xl border border-border bg-white px-5 py-5">
              <h3 className="text-sm font-semibold text-slate-900">你的项目想法</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{project.idea}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>已回答问题数：{project.clarification ? Object.keys(project.clarification.answers).length : 0}</span>
              <span>任务进度：{executionState.done} / {executionState.total}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/workspace/${project.id}/project`}
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                去查看项目
              </Link>
              <Link
                href={`/workspace/${project.id}/tasks`}
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                去执行任务
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
              去操作
            </Link>

            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
              完成这一项后，返回这里继续下一步。
            </div>

            <Link
              href={`/workspace/${project.id}/project`}
              className="inline-flex w-full justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              返回项目信息
            </Link>
          </aside>
        </div>

        <GuidedActionPanel
          title="说明 + 行动按钮"
          description="你可以从这里直接切到外部工具或内部页面，做完后再回来继续。"
          items={[
            {
              title: "去查看设计书",
              description: "先看清这一版设计书，再决定下一步怎么做。",
              label: "去查看设计书",
              href: `/workspace/${project.id}/design`,
              helperText: "做完后返回这里继续。",
            },
            {
              title: "去执行当前任务",
              description: "如果已经知道要做什么，就直接去任务页推进当前任务。",
              label: "去执行当前任务",
              href: `/workspace/${project.id}/tasks`,
              helperText: "做完后返回这里继续。",
            },
            {
              title: "去打开 GitHub 仓库",
              description: "当前仓库入口还没有和项目自动绑定，先保留占位。",
              ...commonActionLinks.githubRepoPlaceholder,
            },
            {
              title: "去打开 Cloudflare",
              description: "如果你正在准备上线，可以直接打开 Cloudflare 控制台。",
              ...commonActionLinks.cloudflare,
            },
          ]}
        />

        <CurrentTaskActionPanel
          projectId={project.id}
          nextActionHref={overview.nextAction.href}
          nextActionLabel={overview.nextAction.label}
          recommendedTaskTitle={executionState.recommendedTask?.title}
        />

        <WorkspaceStepNav
          projectId={project.id}
          stages={overview.stages}
          currentKey={overview.currentStageKey}
          showPager={false}
        />

        <WorkspaceQuickLinks
          title="去操作"
          description="如果你这次只想做其中一步，也可以直接从这里进入。完成后返回这里继续。"
          links={[
            { href: `/workspace/${project.id}/project`, label: "去查看项目" },
            { href: `/workspace/${project.id}/clarify`, label: "去澄清需求" },
            { href: `/workspace/${project.id}/design`, label: "去查看设计书" },
            { href: `/workspace/${project.id}/review`, label: "去确认设计书" },
            { href: `/workspace/${project.id}/tasks`, label: "去执行任务", variant: "primary" },
          ]}
        />

        {project.status === "clarified" ? (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]">
            <div className="surface-panel space-y-4 p-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">任务摘要</p>
                <h2 className="text-xl font-semibold text-slate-900">{executionState.statusTitle}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{executionState.statusDescription}</p>
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
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">推荐动作</p>
              {executionState.recommendedTask ? (
                <>
                  <h2 className="text-xl font-semibold text-slate-900">{executionState.recommendedTask.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    所在阶段：{executionState.recommendedTask.phaseTitle}
                  </p>
                  <p className="text-sm leading-6 text-slate-700">
                    {executionState.recommendedTask.description ?? "先从这条未完成任务开始推进。"}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-slate-900">当前没有待办推荐任务</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    当前任务已经全部完成，可以回看结果并准备下一轮。
                  </p>
                </>
              )}
              <Link
                href={`/workspace/${project.id}/tasks`}
                className="inline-flex w-full justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                去执行任务
              </Link>
            </div>
          </section>
        ) : null}

        <section className="surface-panel space-y-5 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">上线前检查</p>
            <h2 className="text-xl font-semibold text-slate-900">上线前再看一遍收口项</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              当前主流程已经串起来了。正式演示或上线前，可以按这份清单再快速核对一遍。
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {deploymentChecklist.map((item, index) => (
              <div key={item} className="rounded-2xl border border-border bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">检查 {index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
