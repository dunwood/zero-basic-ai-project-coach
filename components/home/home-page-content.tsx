"use client";

import Link from "next/link";
import { useState } from "react";
import { ProjectCard } from "@/components/cards/project-card";
import { StatusCard } from "@/components/cards/status-card";
import { FAQSection } from "@/components/sections/faq-section";
import { DisclaimerDialog } from "@/components/legal/disclaimer-dialog";
import { SectionHeader } from "@/components/ui/section-header";
import { listBrowserRecentProjects } from "@/lib/client/project-store";
import { deploymentChecklist } from "@/lib/data/deployment-checklist";
import { statusOptions } from "@/lib/data/status-options";
import type { RecentProjectSummary } from "@/lib/types/project";

const outcomes = [
  "路线选择：知道哪种模型和工具组合更适合你。",
  "安装引导：知道下一步该装什么、怎么开始。",
  "项目设计书：把模糊想法整理成清晰方案。",
  "执行拆解：形成可以直接照着做的任务列表。",
];

export function HomePageContent() {
  const initialState = (() => {
    try {
      return {
        projectsError: "",
        recentProjects: listBrowserRecentProjects(),
      };
    } catch (error) {
      console.error("Home recent projects load failed:", error);
      return {
        projectsError: "最近项目暂时读取失败，你可以先直接创建一个新项目继续推进。",
        recentProjects: [] as RecentProjectSummary[],
      };
    }
  })();
  const [projectsError] = useState(initialState.projectsError);
  const [recentProjects] = useState<RecentProjectSummary[]>(initialState.recentProjects);

  return (
    <>
      <section className="section-space">
        <div className="container-shell">
          <div className="surface-panel overflow-hidden p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-blue-800">
                  面向零基础用户的 AI 项目起步工具
                </span>
                <div className="space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                    零基础做 AI 项目，先把路线和工具选对
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                    这里不是一堆抽象说明，而是一条能继续走下去的主流程。先看路线，再装工具，然后进入项目想法、设计书和任务执行。
                  </p>
                </div>

                <div className="rounded-3xl border border-dashed border-border bg-white/80 px-5 py-4">
                  <p className="text-sm leading-7 text-slate-700">
                    如果你是零基础用户，建议先从
                    <span className="font-semibold text-slate-900"> 路线 / 工具选择 </span>
                    开始。只有在你已经确定工具环境时，再直接进入项目创建。
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/routes"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    先选路线和工具
                  </Link>
                  <Link
                    href="/project/new"
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400"
                  >
                    我已准备好，直接创建项目
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {outcomes.map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-shell">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">起步建议</p>
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
            description="首页先帮零基础用户看清方向，后续再把项目逐步推进到设计书和任务执行。"
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
            description="最近项目会保留在当前浏览器本地，方便你快速回到工作区继续。"
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
                如果你是第一次来，建议先去看路线和工具。如果你已经准备好，也可以直接创建项目。
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
            eyebrow="上线前检查"
            title="上线前，先把这几件小事再确认一遍"
            description="这一版先用静态检查清单帮你做最后收口，避免项目流程和文案看起来还没串起来。"
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

      <footer className="pb-12">
        <div className="container-shell">
          <div className="surface-panel space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">用户服务与免责声明</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  已激活后，你仍然可以随时从这里查看完整声明。
                </p>
              </div>
              <DisclaimerDialog buttonLabel="查看完整声明" />
            </div>

            <div className="space-y-2 text-sm leading-7 text-slate-700">
              <p>
                Copyrigh
                <span className="relative inline-block">
                  t
                  <span className="pointer-events-none absolute -right-1 top-0 text-[0.65em] leading-none">
                    ©
                  </span>
                </span>{" "}
                2026 哲学园
              </p>
              <p>本站内容仅供技术研究、学习参考与学术交流使用，不提供任何形式的商业担保。</p>
              <p>所有 AI 生成内容请用户自行核实。</p>
              <p>购买后获得的激活码仅作为本在线文档的访问凭证。</p>
              <p>本网页为《AI 编程实战》电子教材的在线阅读版本。</p>
              <p>严禁未经许可的商业非法转载与传播。</p>
            </div>
          </div>
        </div>
      </footer>

      <FAQSection />
    </>
  );
}
