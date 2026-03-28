import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { getProjectById } from "@/lib/server/projects";
import { buildTaskPlan } from "@/lib/server/task-plan";

type TasksPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TasksPage({ params }: TasksPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

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

  const plan = buildTaskPlan(project);

  if (!plan) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="任务清单"
              title="暂时还不能整理任务清单"
              description="当前项目数据还不完整，请先返回工作区检查澄清回答和设计书预览。"
            />
            <Link
              href={`/workspace/${project.id}`}
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              返回工作区
            </Link>
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
          description="这是基于当前设计书预览整理出的第一版执行任务，帮助你更清楚地知道接下来该做什么。"
        />

        <div className="surface-panel p-6 md:p-8">
          <p className="text-sm leading-7 text-muted-foreground">{plan.summary}</p>
        </div>

        <div className="space-y-6">
          {plan.phases.map((phase, index) => (
            <section key={phase.title} className="surface-panel space-y-5 p-6 md:p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  阶段 {index + 1}
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">{phase.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{phase.description}</p>
              </div>

              <div className="grid gap-4">
                {phase.items.map((item) => (
                  <article
                    key={`${phase.title}-${item.title}`}
                    className="rounded-2xl border border-border bg-white px-5 py-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="surface-panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">返回入口</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            你可以先查看设计书预览，再回来对照任务清单逐步推进。
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
