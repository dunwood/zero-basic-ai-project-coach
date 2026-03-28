import { RouteCard } from "@/components/cards/route-card";
import { SectionHeader } from "@/components/ui/section-header";
import { routeFilters, routesData } from "@/lib/data/routes";

export default function RoutesPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="路线选择"
          title="先选一条适合自己的模型 + 工具路线"
          description="这里先展示静态路线卡片，帮助零基础用户理解不同组合的起步方式。筛选区当前仅作为界面占位，不包含真实筛选逻辑。"
        />

        <div className="surface-panel p-5 md:p-6">
          <div className="flex flex-wrap gap-3">
            {routeFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className="rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {routesData.map((route) => (
            <RouteCard key={route.name} {...route} />
          ))}
        </div>
      </div>
    </section>
  );
}
