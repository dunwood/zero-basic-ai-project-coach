import Link from "next/link";
import { getRecentProjectAction } from "@/lib/project-stage";
import type { RecentProjectSummary } from "@/lib/types/project";

type ProjectCardProps = RecentProjectSummary;

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

const statusLabelMap: Record<RecentProjectSummary["status"], string> = {
  draft: "草稿",
  clarifying: "澄清中",
  clarified: "已澄清",
};

export function ProjectCard(project: ProjectCardProps) {
  const nextAction = getRecentProjectAction(project);

  return (
    <article className="surface-panel flex h-full flex-col justify-between gap-5 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
            {statusLabelMap[project.status]}
          </span>
          <span className="text-xs text-muted-foreground">
            最近更新：{formatDate(project.updatedAt)}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            任务进度：{project.taskSummary.done} / {project.taskSummary.total}
          </p>
          <p className="text-sm font-medium text-slate-900">继续项目：{nextAction.label}</p>
          <p className="text-sm leading-6 text-slate-700">{nextAction.description}</p>
        </div>
      </div>

      <Link
        href={nextAction.href}
        className="inline-flex w-fit rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        继续项目
      </Link>
    </article>
  );
}
