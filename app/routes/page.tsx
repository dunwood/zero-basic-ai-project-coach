"use client";

import { useEffect, useState } from "react";
import { RouteCard } from "@/components/cards/route-card";
import { SectionHeader } from "@/components/ui/section-header";
import { routeFilters, routesData } from "@/lib/data/routes";
import type { RouteCardData } from "@/lib/types/route";

export default function RoutesPage() {
  const [routeList, setRouteList] = useState<RouteCardData[]>(routesData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRoutes() {
      try {
        const response = await fetch("/api/routes", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch routes");
        }

        const data: RouteCardData[] = await response.json();

        if (!isMounted || data.length === 0) {
          return;
        }

        setRouteList(data);
        setLoadError(false);
      } catch (error) {
        console.error("Routes page fallback to static data:", error);

        if (isMounted) {
          setRouteList(routesData);
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRoutes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeader
          eyebrow="路线选择"
          title="先选一条适合自己的模型 + 工具路线"
          description="这里先展示适合零基础用户的路线卡片。筛选区当前仅作为界面占位，不包含真实筛选逻辑。"
        />

        <div className="surface-panel space-y-4 p-5 md:p-6">
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

          {isLoading ? (
            <p className="text-sm text-muted-foreground">正在加载路线数据...</p>
          ) : null}

          {loadError ? (
            <p className="text-sm text-amber-700">数据库路线暂时不可用，当前展示本地兜底数据。</p>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {routeList.map((route) => (
            <RouteCard key={route.id} {...route} />
          ))}
        </div>
      </div>
    </section>
  );
}
