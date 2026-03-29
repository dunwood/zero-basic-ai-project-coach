"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";

function ProjectNewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRoute = searchParams.get("route");
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            { label: "先去选路线", href: "/routes" },
          ]}
        />

        <SectionHeader
          eyebrow="项目起步"
          title="先把你想做的软件想法写下来"
          description="不用写得很专业。先把你想解决什么问题、想给谁用、想做成什么样子写下来，我们会带你继续往下走。"
        />

        <div className="surface-panel max-w-3xl space-y-5 p-6 md:p-8">
          {selectedRoute ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-900">
              当前你是从路线安装页进入的，建议确认安装和最小练习已经完成，再开始创建项目。
            </div>
          ) : null}

          <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-4 text-sm leading-6 text-muted-foreground">
            建议至少写清楚三件事：你想帮谁解决问题、核心使用场景是什么、你希望第一版先做到什么程度。
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
                placeholder="例如：我想做一个帮助求职者梳理经历、生成简历初稿的工具。"
                maxLength={2000}
                rows={8}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400"
              />
              <p className="text-xs text-muted-foreground">
                先写清楚你想解决的问题、目标用户，以及你希望它大致怎么工作。
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
                {isSubmitting ? "正在创建项目..." : "创建项目并进入工作区"}
              </button>
              <Link
                href="/"
                className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                返回首页
              </Link>
              <p className="text-sm text-muted-foreground">创建成功后会自动跳转到对应工作区。</p>
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
