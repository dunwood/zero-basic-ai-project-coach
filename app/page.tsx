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
            eyebrow="最近项目"
            title="回到首页，也能继续上一次的项目"
            description="你最近创建或更新过的项目会展示在这里，方便你快速回到对应工作区继续推进。"
          />

          {projectsError ? (
            <div className="surface-panel space-y-4 p-6">
              <h3 className="text-lg font-semibold text-slate-900">最近项目暂时不可用</h3>
              <p className="text-sm leading-6 text-muted-foreground">{projectsError}</p>
              <Link
                href="/project/new"
                className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                新建项目
              </Link>
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
                先创建第一个项目，我们会带你从想法输入、需求澄清、设计书预览一路走到任务执行。
              </p>
              <Link
                href="/project/new"
                className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                现在开始做项目
              </Link>
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

      <section className="section-space">
        <div className="container-shell space-y-8">
          <SectionHeader
            eyebrow="你将获得什么"
            title="不是一堆术语，而是一条能继续走下去的起步路径"
            description="这一版先把最关键的四件事展示清楚，让用户知道这个产品最后会帮自己走到哪里。"
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

      <FAQSection />
    </>
  );
}
