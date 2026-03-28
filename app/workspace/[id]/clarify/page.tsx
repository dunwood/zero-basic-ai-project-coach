import Link from "next/link";
import { ClarifyForm } from "@/components/workspace/clarify-form";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { SectionHeader } from "@/components/ui/section-header";
import { clarifyQuestions } from "@/lib/constants/clarify-questions";
import { getProjectById } from "@/lib/server/projects";
import { buildProjectStages } from "@/lib/project-stage";

type ClarifyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClarifyPage({ params }: ClarifyPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="需求澄清"
              title="没有找到这个项目"
              description="这个澄清页对应的项目不存在，可能是链接失效或项目还没有创建成功。"
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

  const initialAnswers = clarifyQuestions.reduce<Record<string, string>>((accumulator, question) => {
    accumulator[question.key] = project.clarification?.answers?.[question.key] ?? "";
    return accumulator;
  }, {});
  const stages = buildProjectStages(project);

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="需求澄清"
          title="先把需求澄清，再开始做"
          description="下一步我们会像项目教练一样，一步步帮你把模糊想法变成可执行方案。现在先从这些关键问题开始。"
        />

        <WorkspaceStepNav projectId={project.id} stages={stages} currentKey="clarify" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
          <article className="surface-panel space-y-5 p-6 md:p-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">当前项目</p>
              <h2 className="text-2xl font-semibold text-slate-900">{project.title}</h2>
            </div>

            <div className="rounded-2xl border border-border bg-white px-5 py-5">
              <p className="text-sm font-medium text-slate-900">当前想法</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{project.idea}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-900">请先完成这几项关键澄清</p>
              <ClarifyForm projectId={project.id} initialAnswers={initialAnswers} />
            </div>
          </article>

          <aside className="surface-panel space-y-4 p-6">
            <h2 className="text-lg font-semibold text-slate-900">后续入口占位</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              后续这里会接入 AI 引导式澄清，帮助你逐步明确目标用户、核心问题和最小可用功能。
            </p>
            <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
              当前版本会保存你的澄清回答，但还不会生成设计书或接入真实 AI。
            </div>
            <Link
              href={`/workspace/${project.id}`}
              className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              返回项目工作区
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
