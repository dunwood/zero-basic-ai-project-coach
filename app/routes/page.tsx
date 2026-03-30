import Link from "next/link";
import { RouteCard } from "@/components/cards/route-card";
import { PageBackLinks } from "@/components/ui/page-back-links";
import { SectionHeader } from "@/components/ui/section-header";
import { routeFilters, routesData } from "@/lib/data/routes";

export default function RoutesPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回上一步", type: "back", fallbackHref: "/" },
            { label: "我已准备好，跳过安装", href: "/project/new", variant: "primary" },
          ]}
        />

        <SectionHeader
          eyebrow="路线选择"
          title="先选一条适合自己的模型 + 工具路线"
          description="这里直接使用项目内置的本地静态路线数据，不依赖数据库或外部服务。选好后再进入安装和起步练习。"
        />

        <div className="surface-panel space-y-4 p-5 md:p-6">
          <div className="flex flex-wrap gap-3">
            {routeFilters.map((filter) => (
              <span
                key={filter}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                {filter}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            筛选功能后续再补。当前请先选一条路线，再进入安装与最小练习页面。
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {routesData.map((route) => (
            <RouteCard key={route.id} {...route} />
          ))}
        </div>

        <div className="surface-panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">继续下一步</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            正常流程建议先完成路线安装与最小练习；如果你已经装好工具，也可以从这里跳过安装直接进入项目创建。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/project/new"
              className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              跳过安装，直接创建项目
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full border border-border px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
