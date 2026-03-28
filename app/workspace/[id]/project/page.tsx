import Link from "next/link";
import { ProjectDetailsForm } from "@/components/workspace/project-details-form";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { SectionHeader } from "@/components/ui/section-header";
import { getProjectById } from "@/lib/server/projects";
import { buildProjectStages } from "@/lib/project-stage";

type ProjectDetailPageProps = {
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

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="项目详情"
              title="没有找到这个项目"
              description="这个项目详情页对应的项目不存在，可能是链接失效，或项目还没有创建成功。"
            />
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

  const clarificationCount = project.clarification
    ? Object.keys(project.clarification.answers).length
    : 0;
  const stages = buildProjectStages(project);

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="项目详情"
          title="查看并轻量编辑项目信息"
          description="这里可以回看项目当前核心信息，并修改项目标题和项目想法，不会影响现有澄清、设计书和任务主流程。"
        />

        <WorkspaceStepNav projectId={project.id} stages={stages} currentKey="created" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="surface-panel space-y-6 p-6 md:p-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">当前项目信息</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs text-muted-foreground">当前状态</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{project.status}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs text-muted-foreground">澄清回答数</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{clarificationCount}</p>
                </div>
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs text-muted-foreground">创建时间</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs text-muted-foreground">最近更新时间</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-[#fcfbf7] p-5">
              <h2 className="text-xl font-semibold text-slate-900">编辑项目标题与想法</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                如果你想把项目描述改得更准确，可以在这里直接保存。
              </p>
              <div className="mt-5">
                <ProjectDetailsForm
                  projectId={project.id}
                  initialTitle={project.title}
                  initialIdea={project.idea}
                />
              </div>
            </div>
          </div>

          <aside className="surface-panel space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">快捷入口</p>
              <h2 className="text-xl font-semibold text-slate-900">{project.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                保存后你可以直接继续去澄清、设计书预览或任务执行，不需要重新创建项目。
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/workspace/${project.id}`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回工作区
              </Link>
              <Link
                href={`/workspace/${project.id}/clarify`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                去需求澄清
              </Link>
              <Link
                href={`/workspace/${project.id}/design`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                去设计书预览
              </Link>
              <Link
                href={`/workspace/${project.id}/tasks`}
                className="inline-flex justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                去任务执行页
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
