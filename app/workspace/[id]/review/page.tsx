import Link from "next/link";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { SectionHeader } from "@/components/ui/section-header";
import { buildDesignBrief } from "@/lib/server/design-brief";
import { getProjectById } from "@/lib/server/projects";
import { buildProjectStages } from "@/lib/project-stage";

type ReviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function SummarySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white px-5 py-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="设计书确认"
              title="没有找到这个项目"
              description="这个确认页对应的项目不存在，可能是链接失效，或项目还没有创建成功。"
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
              eyebrow="设计书确认"
              title="你还不能进入确认流程"
              description="先完成需求澄清，再回来确认设计书摘要，之后才能正式进入任务执行。"
            />
            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5 text-sm leading-6 text-muted-foreground">
              当前项目还没有完成需求澄清，所以确认页暂时不可用。
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

  const brief = buildDesignBrief(project);
  const stages = buildProjectStages(project);

  if (!brief) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="设计书确认"
              title="当前还不能确认设计书"
              description="项目摘要还不完整，请先返回工作区或设计书预览页检查当前内容。"
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
          eyebrow="设计书确认"
          title="确认你的项目设计书"
          description="在进入任务执行前，先确认这个版本是否已经足够清晰。当前内容基于你的项目想法和需求澄清整理而成。"
        />

        <WorkspaceStepNav projectId={project.id} stages={stages} currentKey="review" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <article className="space-y-5">
            <SummarySection title="项目摘要">
              <p>项目名称：{project.title}</p>
              <p>一句话概述：{brief.summary}</p>
              <p>目标用户：{brief.targetUsers}</p>
              <p>核心问题：{brief.coreProblem}</p>
            </SummarySection>

            <SummarySection title="核心功能（精简版）">
              <ul className="space-y-2">
                {brief.coreFeatures.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </SummarySection>

            <SummarySection title="最小可用版本（MVP）">
              <ul className="space-y-2">
                {brief.mvpScope.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </SummarySection>
          </article>

          <aside className="surface-panel space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">当前阶段</p>
              <h2 className="text-xl font-semibold text-slate-900">设计书确认</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                这一步是把设计书从“预览”推进到“准备执行”的正式入口。
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
              下一步：确认无误后，直接进入任务清单，开始第一轮执行。
            </div>

            <Link
              href={`/workspace/${project.id}/tasks`}
              className="inline-flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              确认并进入任务执行
            </Link>

            <div className="flex flex-col gap-3">
              <Link
                href={`/workspace/${project.id}/project`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                查看项目详情
              </Link>
              <Link
                href={`/workspace/${project.id}/design`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回设计书预览
              </Link>
              <Link
                href={`/workspace/${project.id}`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回工作区
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
