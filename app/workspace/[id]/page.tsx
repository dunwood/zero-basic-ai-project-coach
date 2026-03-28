import Link from "next/link";
import { ClarifyEntryButton } from "@/components/workspace/clarify-entry-button";
import { SectionHeader } from "@/components/ui/section-header";
import { getProjectById } from "@/lib/server/projects";

type WorkspaceDetailPageProps = {
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

export default async function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="项目工作区"
              title="没有找到这个项目"
              description="可能是链接已失效，或这个项目还没有成功创建。"
            />
            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5">
              <p className="text-sm leading-6 text-muted-foreground">
                你可以返回项目创建页，重新提交你的项目想法。
              </p>
            </div>
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

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="项目工作区"
          title={project.title}
          description="这里是当前项目的基础工作区。下一步会在这里继续把你的想法澄清成可执行方案。"
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <article className="surface-panel space-y-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                状态：{project.status}
              </span>
              <span className="text-sm text-muted-foreground">
                创建时间：{formatDate(project.createdAt)}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">你的项目想法</h2>
              <div className="rounded-2xl border border-border bg-white px-5 py-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{project.idea}</p>
              </div>
            </div>
          </article>

          <aside className="surface-panel space-y-4 p-6">
            <h2 className="text-lg font-semibold text-slate-900">下一步</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              先把你的需求澄清清楚，再继续往设计书和执行方案推进。这里先提供一个最小入口，进入固定问题引导页。
            </p>
            <ClarifyEntryButton projectId={project.id} status={project.status} />
          </aside>
        </div>
      </div>
    </section>
  );
}
