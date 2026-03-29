import Link from "next/link";

export function HeroSection() {
  return (
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
                  零基础做 AI 项目，先别急着开工，先把路线和工具选对
                </h1>
                <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                  首页的第一步不是看项目列表，而是先帮你确定适合自己的模型、工具和起步路线。选对以后，再进入项目想法整理、设计书和任务执行会更顺。
                </p>
              </div>

              <div className="rounded-3xl border border-dashed border-border bg-white/80 px-5 py-4">
                <p className="text-sm leading-7 text-slate-700">
                  如果你是零基础用户，建议先从
                  <span className="font-semibold text-slate-900"> 路线 / 工具选择 </span>
                  开始；只有你已经很确定工具环境时，再直接进入项目创建。
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
                  我已准备好，跳过安装
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                "路线选择：先选适合自己的模型 + 工具组合",
                "安装引导：知道每一步要装什么、怎么连起来",
                "项目设计书：把模糊想法整理成清晰方案",
                "执行拆解：得到可以直接开工的任务清单",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-slate-50 p-4">
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
