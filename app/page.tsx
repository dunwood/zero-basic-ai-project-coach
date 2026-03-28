import Link from "next/link";
import { ProjectCard } from "@/components/cards/project-card";
import { StatusCard } from "@/components/cards/status-card";
import { FAQSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SectionHeader } from "@/components/ui/section-header";
import { deploymentChecklist } from "@/lib/data/deployment-checklist";
import { statusOptions } from "@/lib/data/status-options";
import { listRecentProjects } from "@/lib/server/projects";
import type { RecentProjectSummary } from "@/lib/types/project";

export const dynamic = "force-dynamic";

const outcomes = [
  "路线选择：知道哪种模型 + 工具组合更适合你",
  "安装引导：知道下一步该装什么、怎么开始",
  "项目设计书：把模糊想法整理成清晰方案",
  "执行拆解：形成可以直接照着做的任务列表",
];

export default async function HomePage() {
  let projectsError = "";
  let recentProjects: RecentProjectSummary[] = [];

  try {
    recentProjects = await listRecentProjects();
  } catch (error) {
    console.error("Home recent projects load failed:", error);
    projectsError = "最近项目暂时读取失败，你可以先直接创建一个新项目继续推进。";
  }

  return (
    <>
      <HeroSection />

      <section className="pb-8">
        <div className="container-shell">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                起步建议
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                如果你还不确定怎么开始，先选路线，再建项目
              </h2>
            </div>
            <Link
              href="/routes"
              className="inline-flex rounded-full border border-border bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              查看全部路线
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {statusOptions.map((item) => (
              <StatusCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SectionHeader
            eyebrow="你将获得什么"
            title="不是一堆术语，而是一条能继续走下去的起步路径"
            description="首页先负责帮零基础用户看清方向，后续再把项目逐步推进到设计书和任务执行。"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {outcomes.map((item) => (
              <div key={item} className="surface-panel p-6">
                <p className="text-base leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SectionHeader
            eyebrow="最近项目"
            title="如果你已经在推进项目，可以从这里继续"
            description="最近项目仍然保留在首页，方便你快速回到工作区继续，但它不再作为首页的主要起点。"
          />

          {projectsError ? (
            <div className="surface-panel space-y-4 p-6">
              <h3 className="text-lg font-semibold text-slate-900">最近项目暂时不可用</h3>
              <p className="text-sm leading-6 text-muted-foreground">{projectsError}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/routes"
                  className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  先去选路线
                </Link>
                <Link
                  href="/project/new"
                  className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  直接创建项目
                </Link>
              </div>
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          ) : (
            <div className="surface-panel space-y-4 p-6">
              <h3 className="text-lg font-semibold text-slate-900">你还没有最近项目</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                如果你是第一次来，建议先去看路线和工具；如果你已经准备好，也可以直接创建项目。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/routes"
                  className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  先去选路线
                </Link>
                <Link
                  href="/project/new"
                  className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  直接创建项目
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SectionHeader
            eyebrow="部署前检查"
            title="上线前，先把这四件小事再确认一遍"
            description="这一版先用静态检查清单帮你做最后收口，避免项目流程和文案看起来还没连起来。"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {deploymentChecklist.map((item, index) => (
              <div key={item} className="surface-panel p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  检查 {index + 1}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
