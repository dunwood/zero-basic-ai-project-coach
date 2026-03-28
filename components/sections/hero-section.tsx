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
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                  不懂代码，也能一步步开始做自己的 AI 项目
                </h1>
                <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                  先帮你选模型和工具，再带你完成安装、项目设计和执行拆解。你不用一下子学很多，只要先走通第一步。
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/routes"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  开始选择路线
                </Link>
                <Link
                  href="/project/new"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400"
                >
                  直接开始做项目
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
