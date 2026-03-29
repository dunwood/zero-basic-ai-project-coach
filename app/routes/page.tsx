"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RouteCard } from "@/components/cards/route-card";
import { SectionHeader } from "@/components/ui/section-header";
import { PageBackLinks } from "@/components/ui/page-back-links";
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
        <PageBackLinks
          items={[
            { label: "返回首页", href: "/" },
            { label: "返回上一步", type: "back", fallbackHref: "/" },
            { label: "直接创建项目", href: "/project/new", variant: "primary" },
          ]}
        />

        <SectionHeader
          eyebrow="路线选择"
          title="先选一条适合自己的模型 + 工具路线"
          description="这里先展示适合零基础用户的路线卡片。筛选区当前仅作为界面占位，不包含真实筛选逻辑。"
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
            筛选功能即将开放，当前请直接点击路线卡片下方按钮进入下一步。
          </p>

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

        <div className="surface-panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">继续下一步</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            如果你已经大致知道想做什么，也可以直接进入项目创建页，后面再结合路线慢慢调整。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/project/new"
              className="inline-flex rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              去创建项目
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
