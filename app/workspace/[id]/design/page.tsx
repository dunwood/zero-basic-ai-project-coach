import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { buildDesignBrief } from "@/lib/server/design-brief";
import { getProjectById } from "@/lib/server/projects";

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
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="设计书预览"
              title="没有找到这个项目"
              description="这个设计书预览对应的项目不存在，可能是链接失效，或项目还没有创建成功。"
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
              eyebrow="设计书预览"
              title="你还没有完成需求澄清"
              description="完成需求澄清后，系统才能基于你的回答整理出一份设计书预览。"
            />
            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-5 text-sm leading-6 text-muted-foreground">
              先去完成澄清问题填写，再回来查看设计书预览。
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

  if (!brief) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel max-w-3xl space-y-5 p-8">
            <SectionHeader
              eyebrow="设计书预览"
              title="暂时还不能生成设计书预览"
              description="当前项目数据还不完整，请先返回工作区检查澄清回答是否已经保存。"
            />
            <Link
              href={`/workspace/${project.id}`}
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              返回工作区
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
          eyebrow="设计书预览"
          title="项目设计书预览"
          description="这是一份基于你当前项目想法和澄清回答整理出的静态设计书预览，用来帮助你快速进入开发准备阶段。"
        />

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

          <aside className="surface-panel space-y-4 p-6">
            <h2 className="text-lg font-semibold text-slate-900">返回入口</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              如果你想回头修改澄清回答，可以先回到工作区或澄清页，再重新整理这份设计书预览。
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/workspace/${project.id}`}
                className="inline-flex justify-center rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回工作区
              </Link>
              <Link
                href={`/workspace/${project.id}/clarify`}
                className="inline-flex justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                返回澄清页
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
