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
          description={
            project.status === "clarified"
              ? "你已经完成了需求澄清。下一步，我们会基于这些回答继续生成设计书。"
              : "这里是当前项目的基础工作区。下一步会在这里继续把你的想法澄清成可执行方案。"
          }
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

            {project.status === "clarified" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5">
                <p className="text-sm font-semibold text-emerald-800">已完成需求澄清</p>
                <p className="mt-2 text-sm leading-6 text-emerald-700">
                  当前项目已保存澄清回答，可继续进入后续设计书生成流程。
                </p>
                <p className="mt-3 text-xs text-emerald-700/80">
                  已回答问题数：{project.clarification ? Object.keys(project.clarification.answers).length : 0}
                </p>
              </div>
            ) : null}
          </article>

          <aside className="surface-panel space-y-4 p-6">
            <h2 className="text-lg font-semibold text-slate-900">下一步</h2>
            {project.status === "clarified" ? (
              <>
                <p className="text-sm leading-6 text-muted-foreground">
                  澄清回答已经保存完成。下一步，我们会根据这些回答生成一份结构化设计书。
                </p>
                <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm leading-6 text-muted-foreground">
                  你现在已经可以先查看一份静态整理版设计书预览，帮助你确认方向是否足够清晰。
                </div>
                <Link
                  href={`/workspace/${project.id}/design`}
                  className="inline-flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  查看设计书预览
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm leading-6 text-muted-foreground">
                  先把你的需求澄清清楚，再继续往设计书和执行方案推进。这里先提供一个最小入口，进入固定问题引导页。
                </p>
                <ClarifyEntryButton projectId={project.id} status={project.status} />
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
