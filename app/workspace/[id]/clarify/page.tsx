import { ClarifyForm } from "@/components/workspace/clarify-form";
import { WorkspaceEmptyState } from "@/components/workspace/workspace-empty-state";
import { WorkspaceQuickLinks } from "@/components/workspace/workspace-quick-links";
import { PageBackLinks } from "@/components/ui/page-back-links";
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
      <WorkspaceEmptyState
        eyebrow="需求澄清"
        title="没有找到这个项目"
        description="这个澄清页对应的项目不存在，可能是链接失效，或者项目还没有创建成功。"
        actions={[
          { href: "/project/new", label: "创建新项目" },
          { href: "/", label: "返回首页", variant: "secondary" },
        ]}
      />
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
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回工作区", href: `/workspace/${project.id}` },
            { label: "返回上一步", type: "back", fallbackHref: `/workspace/${project.id}/project` },
          ]}
        />

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

          <WorkspaceQuickLinks
            title="继续推进"
            description="当前版本会保存你的澄清回答，但还不会接入真实 AI。完成这一步后，就可以继续查看设计书预览。"
            links={[
              { href: `/workspace/${project.id}`, label: "返回工作区" },
              { href: `/workspace/${project.id}/project`, label: "查看项目详情" },
              { href: `/workspace/${project.id}/design`, label: "去设计书预览", variant: "primary" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
