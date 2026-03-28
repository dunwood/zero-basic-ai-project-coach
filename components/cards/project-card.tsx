import Link from "next/link";
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

export function ProjectCard({ id, title, status, updatedAt, taskSummary }: ProjectCardProps) {
  return (
    <article className="surface-panel flex h-full flex-col justify-between gap-5 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
            {statusLabelMap[status]}
          </span>
          <span className="text-xs text-muted-foreground">最近更新：{formatDate(updatedAt)}</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            任务进度：{taskSummary.done} / {taskSummary.total}
          </p>
        </div>
      </div>

      <Link
        href={`/workspace/${id}`}
        className="inline-flex w-fit rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        继续这个项目
      </Link>
    </article>
  );
}
