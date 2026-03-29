import { TaskBoard } from "@/components/workspace/task-board";
import { WorkspaceEmptyState } from "@/components/workspace/workspace-empty-state";
import { WorkspaceQuickLinks } from "@/components/workspace/workspace-quick-links";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { WorkspaceStepNav } from "@/components/workspace/workspace-step-nav";
import { SectionHeader } from "@/components/ui/section-header";
import { buildProjectStages } from "@/lib/project-stage";
import { buildTaskExecutionState } from "@/lib/server/task-plan";
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
      <WorkspaceEmptyState
        eyebrow="任务执行台"
        title="没有找到这个项目"
        description="这个任务执行页对应的项目不存在，可能是链接失效，或者项目还没有创建成功。"
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
        eyebrow="任务执行台"
        title="你还没有完成需求澄清"
        description="完成需求澄清后，系统才能基于当前设计书预览整理出第一版任务清单。"
        note="先去完成澄清问题填写，再回来进入任务执行台。"
        actions={[
          { href: `/workspace/${project.id}/clarify`, label: "去完成需求澄清" },
          { href: `/workspace/${project.id}`, label: "返回工作区", variant: "secondary" },
        ]}
      />
    );
  }

  const executionState = buildTaskExecutionState(project);
  const stages = buildProjectStages(project);

  if (project.tasks.length === 0) {
    return (
      <WorkspaceEmptyState
        eyebrow="任务执行台"
        title="任务清单暂时还是空的"
        description="设计书数据已经准备好，但任务清单还没有成功写入数据库，请稍后刷新再试。"
        actions={[
          { href: `/workspace/${project.id}/review`, label: "返回设计书确认" },
          { href: `/workspace/${project.id}`, label: "返回工作区", variant: "secondary" },
        ]}
      />
    );
  }

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回工作区", href: `/workspace/${project.id}` },
            { label: "返回上一步", type: "back", fallbackHref: `/workspace/${project.id}/review` },
          ]}
        />

        <SectionHeader
          eyebrow="任务执行台"
          title="项目任务执行台"
          description="这里会按阶段展示当前任务、整体进度和推荐先做项，帮助你更顺地推进项目。"
        />

        <WorkspaceStepNav projectId={project.id} stages={stages} currentKey="tasks" />

        <TaskBoard
          projectId={project.id}
          initialTasks={project.tasks}
          initialExecutionState={executionState}
        />

        <WorkspaceQuickLinks
          title="继续查看其他页面"
          description="你可以结合工作区、设计书预览和设计书确认页，继续推进当前项目。"
          links={[
            { href: `/workspace/${project.id}`, label: "返回工作区" },
            { href: `/workspace/${project.id}/review`, label: "返回设计书确认" },
            { href: `/workspace/${project.id}/design`, label: "返回设计书预览", variant: "primary" },
          ]}
        />
      </div>
    </section>
  );
}
