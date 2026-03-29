"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GuidedActionPanel } from "@/components/ui/guided-action-panel";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
import { commonActionLinks, routeToolActionLinks } from "@/lib/data/action-links";

function ProjectNewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRoute = searchParams.get("route");
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const routeToolAction = useMemo(
    () =>
      selectedRoute
        ? routeToolActionLinks[selectedRoute] ?? commonActionLinks.aiToolPlaceholder
        : commonActionLinks.aiToolPlaceholder,
    [selectedRoute],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextIdea = idea.trim();

    if (!nextTitle) {
      setErrorMessage("请先填写项目名称。");
      return;
    }

    if (!nextIdea) {
      setErrorMessage("请先写下你的项目想法。");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: nextTitle,
          idea: nextIdea,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        error?: string;
        project?: { id: string };
      };

      if (!response.ok || !data.success || !data.project) {
        throw new Error(data.error ?? "项目创建失败，请稍后再试。");
      }

      router.push(`/workspace/${data.project.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "项目创建失败，请稍后再试。";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            {
              label: "返回上一步",
              type: "back",
              fallbackHref: selectedRoute ? `/routes/${selectedRoute}/setup` : "/routes",
            },
            { label: "去安装路线", href: "/routes" },
          ]}
        />

        <SectionHeader
          eyebrow="项目起步"
          title="先把你的项目想法写下来"
          description="这里不只是说明页。你可以一边打开工具，一边回到这里把项目写清楚，再进入工作区继续。"
        />

        <GuidedActionPanel
          title="先去操作，再回来继续"
          description="这一步的重点是把常用工具先打开。做完一项就回来继续，不需要一次完成所有事情。"
          items={[
            {
              title: "去打开当前 AI 工具",
              description: "如果你已经选了路线，就先把对应工具打开；没有明确入口时先保持占位。",
              ...routeToolAction,
            },
            {
              title: "去打开 GitHub",
              description: "后面你很可能会用到仓库，这里先把 GitHub 打开备用。",
              ...commonActionLinks.github,
            },
            {
              title: "去打开 Vercel",
              description: "如果你准备做上线，这里可以先把 Vercel 控制台打开。",
              ...commonActionLinks.vercel,
            },
            {
              title: "返回安装页确认",
              description: "如果你刚做完安装，这里可以回到安装页再核对一遍。",
              label: "返回安装页",
              href: selectedRoute ? `/routes/${selectedRoute}/setup` : "/routes",
              helperText: "做完后返回这里继续填写项目。",
            },
          ]}
        />

        <div className="surface-panel max-w-3xl space-y-5 p-6 md:p-8">
          {selectedRoute ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-900">
              你是从安装页进来的。完成安装后，回到这里继续填写项目即可。
            </div>
          ) : null}

          <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-4 text-sm leading-6 text-muted-foreground">
            先写清楚三件事：你想帮谁解决问题、第一版想做什么、你希望先做到哪一步。
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-900">
                项目名称
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例如：AI 简历优化助手"
                maxLength={80}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="idea" className="text-sm font-medium text-slate-900">
                项目想法
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="例如：我想做一个帮求职者整理经历、生成简历初稿的小工具。"
                maxLength={2000}
                rows={8}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400"
              />
              <p className="text-xs text-muted-foreground">
                写清楚你想解决的问题、目标用户，以及第一版先做什么就够了。
              </p>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "正在创建项目..." : "去创建项目并进入工作区"}
              </button>
              <Link
                href="/routes"
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回上一步
              </Link>
              <p className="text-sm text-muted-foreground">创建成功后，回到工作区继续下一步。</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ProjectNewPage() {
  return (
    <Suspense fallback={<section className="section-space"><div className="container-shell" /></section>}>
      <ProjectNewPageContent />
    </Suspense>
  );
}
