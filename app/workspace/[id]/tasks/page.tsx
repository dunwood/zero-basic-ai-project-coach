import Link from "next/link";
import { TaskBoard } from "@/components/workspace/task-board";
import { SectionHeader } from "@/components/ui/section-header";
import { ensureProjectTasks } from "@/lib/server/projects";

type TasksPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TasksPage({ params }: TasksPageProps) {
  const { id } = await params;
  const project = await ensureProjectTasks(id);

  if (!project) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="任务清单"
              title="没有找到这个项目"
              description="这个任务清单对应的项目不存在，可能是链接失效，或项目还没有创建成功。"
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

  if (project.status !== "clarified" || !project.clarification) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="任务清单"
              title="你还没有完成需求澄清"
              description="完成需求澄清后，系统才能基于当前设计书预览整理出第一版任务清单。"
            />
            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5 text-sm leading-6 text-muted-foreground">
              先去完成澄清问题填写，再回来查看任务清单。
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/workspace/${project.id}`}
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回工作区
              </Link>
              <Link
                href={`/workspace/${project.id}/clarify`}
                className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                去完成需求澄清
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (project.tasks.length === 0) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="任务清单"
              title="任务初始化暂时失败"
              description="设计书数据已经准备好，但任务清单还没有成功写入数据库，请稍后刷新再试。"
            />
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/workspace/${project.id}`}
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回工作区
              </Link>
              <Link
                href={`/workspace/${project.id}/design`}
                className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                返回设计书预览
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="任务清单"
          title="项目任务清单"
          description="这是已经落到数据库中的执行任务，你可以直接勾选完成状态，逐步推进项目。"
        />

        <TaskBoard projectId={project.id} initialTasks={project.tasks} />

        <div className="surface-panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">返回入口</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            你可以结合设计书预览和工作区状态，按阶段推进当前项目。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/workspace/${project.id}`}
              className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              返回工作区
            </Link>
            <Link
              href={`/workspace/${project.id}/design`}
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              返回设计书预览
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
