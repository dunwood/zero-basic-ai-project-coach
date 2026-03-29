import { GuidedActionPanel } from "@/components/ui/guided-action-panel";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectDetailsForm } from "@/components/workspace/project-details-form";
import { WorkspaceEmptyState } from "@/components/workspace/workspace-empty-state";
import { WorkspaceQuickLinks } from "@/components/workspace/workspace-quick-links";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { commonActionLinks } from "@/lib/data/action-links";
import { buildProjectStages } from "@/lib/project-stage";
import { getProjectById } from "@/lib/server/projects";

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
      <WorkspaceEmptyState
        eyebrow="项目信息"
        title="没有找到这个项目"
        description="这个项目可能不存在，或者链接已经失效。"
        actions={[
          { href: "/project/new", label: "去创建项目" },
          { href: "/", label: "返回首页", variant: "secondary" },
        ]}
      />
    );
  }

  const clarificationCount = project.clarification ? Object.keys(project.clarification.answers).length : 0;
  const stages = buildProjectStages(project);

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回工作区", href: `/workspace/${project.id}` },
            { label: "返回上一步", type: "back", fallbackHref: `/workspace/${project.id}` },
          ]}
        />

        <SectionHeader
          eyebrow="项目信息"
          title="查看项目，并决定下一步去哪里操作"
          description="这里把项目信息和行动按钮放在一起。你可以先修改项目描述，再去设计书或任务页继续。"
        />

        <WorkspaceStepNav projectId={project.id} stages={stages} currentKey="created" />

        <GuidedActionPanel
          title="说明 + 行动按钮"
          description="如果你现在要切出去做事，可以直接点下面的按钮。完成后返回这里继续。"
          items={[
            {
              title: "去查看设计书",
              description: "先把设计书看一遍，再决定项目描述要不要改。",
              label: "去查看设计书",
              href: `/workspace/${project.id}/design`,
              helperText: "做完后返回这里继续。",
            },
            {
              title: "去执行当前任务",
              description: "如果项目信息已经够清楚，就直接去任务页推进。",
              label: "去执行当前任务",
              href: `/workspace/${project.id}/tasks`,
              helperText: "做完后返回这里继续。",
            },
            {
              title: "去打开 GitHub",
              description: "如果你准备同步仓库，可以先把 GitHub 打开。",
              ...commonActionLinks.github,
            },
            {
              title: "去打开 Vercel",
              description: "如果你准备做部署，也可以先把 Vercel 控制台打开。",
              ...commonActionLinks.vercel,
            },
          ]}
        />

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
                  <p className="text-xs text-muted-foreground">已回答问题数</p>
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
              <h2 className="text-xl font-semibold text-slate-900">修改项目标题和想法</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                先把这里写清楚，再去下一步操作。保存完成后，返回工作区继续。
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

          <WorkspaceQuickLinks
            title="下一步"
            description="保存完成后，你可以直接去下一个页面继续。做完后再回到工作区。"
            links={[
              { href: `/workspace/${project.id}`, label: "返回工作区" },
              { href: `/workspace/${project.id}/clarify`, label: "去澄清需求" },
              { href: `/workspace/${project.id}/design`, label: "去查看设计书" },
              { href: `/workspace/${project.id}/tasks`, label: "去执行任务", variant: "primary" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
