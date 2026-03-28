import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { ensureProjectTasks, getProjectById } from "@/lib/server/projects";
import { buildProjectStages, getProjectOverview } from "@/lib/project-stage";

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

const stageStateLabelMap = {
  completed: "已完成",
  current: "当前阶段",
  upcoming: "未开始",
} as const;

const stageStateClassNameMap = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  current: "border-blue-200 bg-blue-50 text-blue-800",
  upcoming: "border-border bg-white text-slate-600",
} as const;

export default async function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
  const { id } = await params;
  const baseProject = await getProjectById(id);

  if (!baseProject) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="项目工作区"
              title="没有找到这个项目"
              description="可能是链接已经失效，或这个项目还没有创建成功。"
            />
            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5">
              <p className="text-sm leading-6 text-muted-foreground">
                你可以回到项目创建页，重新提交你的项目想法。
              </p>
            </div>
            <Link
              href="/project/new"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              回到项目创建页
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const project =
    baseProject.status === "clarified" && baseProject.clarification
      ? ((await ensureProjectTasks(id)) ?? baseProject)
      : baseProject;

  const overview = getProjectOverview(project);
  const stages = buildProjectStages(project);

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
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
                任务进度：{overview.taskSummary.done} / {overview.taskSummary.total}
              </span>
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
          </aside>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">阶段导航</h2>
            <p className="text-sm text-muted-foreground">按当前进度查看澄清、设计书和任务执行入口。</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => (
              <article key={stage.key} className="surface-panel flex h-full flex-col gap-4 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stageStateClassNameMap[stage.state]}`}
                  >
                    {stageStateLabelMap[stage.state]}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{stage.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{stage.description}</p>
                </div>

                <Link
                  href={stage.href}
                  className="mt-auto inline-flex w-fit rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  打开这个阶段
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
