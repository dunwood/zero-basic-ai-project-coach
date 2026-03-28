import Link from "next/link";
import { ClarifyEntryButton } from "@/components/workspace/clarify-entry-button";
import { SectionHeader } from "@/components/ui/section-header";
import { ensureProjectTasks, getProjectById } from "@/lib/server/projects";

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

  const completedTaskCount = project.tasks.filter((task) => task.isDone).length;
  const totalTaskCount = project.tasks.length;

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="项目工作区"
          title={project.title}
          description={
            project.status === "clarified"
              ? "你已经完成了需求澄清。下一步，我们会基于这些回答继续推进设计书和任务执行。"
              : "这里是当前项目的基础工作区。下一步会在这里继续把你的想法澄清成可执行方案。"
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <article className="surface-panel space-y-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                状态：{project.status}
              </span>
              <span className="text-sm text-muted-foreground">
                创建时间：{formatDate(project.createdAt)}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">你的项目想法</h2>
              <div className="rounded-2xl border border-border bg-white px-5 py-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{project.idea}</p>
              </div>
            </div>

            {project.status === "clarified" ? (
              <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">已完成需求澄清</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    当前项目已保存澄清回答，可以继续查看设计书预览和任务清单。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-emerald-700/80">
                  <span>
                    已回答问题数：
                    {project.clarification ? Object.keys(project.clarification.answers).length : 0}
                  </span>
                  <span>任务进度：{completedTaskCount} / {totalTaskCount || 0}</span>
                </div>
              </div>
            ) : null}
          </article>

          <aside className="surface-panel space-y-4 p-6">
            <h2 className="text-lg font-semibold text-slate-900">下一步</h2>
            {project.status === "clarified" ? (
              <>
                <p className="text-sm leading-6 text-muted-foreground">
                  澄清回答已经保存完成。现在你可以继续查看设计书预览，并在任务面板里推进执行进度。
                </p>
                <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
                  当前任务进度：{completedTaskCount} / {totalTaskCount || 0}
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    href={`/workspace/${project.id}/design`}
                    className="inline-flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    查看设计书预览
                  </Link>
                  <Link
                    href={`/workspace/${project.id}/tasks`}
                    className="inline-flex w-full justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    查看任务清单
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm leading-6 text-muted-foreground">
                  先把你的需求澄清清楚，再继续往设计书和执行方案推进。这里先提供一个最小入口，进入固定问题引导页。
                </p>
                <ClarifyEntryButton projectId={project.id} status={project.status} />
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
