import { WorkspaceEmptyState } from "@/components/workspace/workspace-empty-state";
import { WorkspaceQuickLinks } from "@/components/workspace/workspace-quick-links";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { SectionHeader } from "@/components/ui/section-header";
import { buildDesignBrief } from "@/lib/server/design-brief";
import { getProjectById } from "@/lib/server/projects";
import { buildProjectStages } from "@/lib/project-stage";

type DesignPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function DetailSection({
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

export default async function DesignPage({ params }: DesignPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <WorkspaceEmptyState
        eyebrow="设计书预览"
        title="没有找到这个项目"
        description="这个设计书预览对应的项目不存在，可能是链接失效，或者项目还没有创建成功。"
        actions={[
          { href: "/project/new", label: "创建新项目" },
          { href: "/", label: "返回首页", variant: "secondary" },
        ]}
      />
    );
  }

  if (project.status !== "clarified" || !project.clarification) {
    return (
      <WorkspaceEmptyState
        eyebrow="设计书预览"
        title="你还没有完成需求澄清"
        description="完成需求澄清后，系统才能基于你的回答整理出一份设计书预览。"
        note="先去补完澄清问题，再回来查看这一版设计书摘要。"
        actions={[
          { href: `/workspace/${project.id}/clarify`, label: "去完成需求澄清" },
          { href: `/workspace/${project.id}`, label: "返回工作区", variant: "secondary" },
        ]}
      />
    );
  }

  const brief = buildDesignBrief(project);
  const stages = buildProjectStages(project);

  if (!brief) {
    return (
      <WorkspaceEmptyState
        eyebrow="设计书预览"
        title="暂时还不能生成设计书预览"
        description="当前项目数据还不完整，请先返回工作区检查澄清回答是否已经保存。"
        actions={[
          { href: `/workspace/${project.id}`, label: "返回工作区" },
          { href: `/workspace/${project.id}/clarify`, label: "返回需求澄清", variant: "secondary" },
        ]}
      />
    );
  }

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="设计书预览"
          title="项目设计书预览"
          description="这是基于你当前项目想法和澄清回答整理出的静态设计书预览。确认无误后，就可以进入正式任务执行。"
        />

        <WorkspaceStepNav projectId={project.id} stages={stages} currentKey="design" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <article className="space-y-5">
            <DetailSection title="项目基本信息">
              <p>项目名称：{project.title}</p>
              <p>当前状态：{project.status}</p>
            </DetailSection>

            <DetailSection title="一句话概述">
              <p>{brief.summary}</p>
            </DetailSection>

            <DetailSection title="目标用户">
              <p>{brief.targetUsers}</p>
            </DetailSection>

            <DetailSection title="核心问题">
              <p>{brief.coreProblem}</p>
            </DetailSection>

            <DetailSection title="核心功能">
              <ul className="space-y-2">
                {brief.coreFeatures.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title="最小可用版本（MVP）">
              <ul className="space-y-2">
                {brief.mvpScope.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title="非本期范围">
              <ul className="space-y-2">
                {brief.outOfScope.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title="下一步开发建议">
              <ul className="space-y-2">
                {brief.nextSteps.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </DetailSection>
          </article>

          <WorkspaceQuickLinks
            title="继续推进"
            description="如果这版设计书摘要已经足够清晰，下一步建议先进入确认页，再正式切到任务执行流程。"
            links={[
              { href: `/workspace/${project.id}/review`, label: "去确认设计书", variant: "primary" },
              { href: `/workspace/${project.id}`, label: "返回工作区" },
              { href: `/workspace/${project.id}/clarify`, label: "返回需求澄清" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
