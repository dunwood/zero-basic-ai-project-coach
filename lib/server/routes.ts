import { routeCatalog } from "@/lib/data/routes";
import type { RouteCardData, RouteDetailData, RouteStepData } from "@/lib/types/route";

function toRouteCardData(route: (typeof routeCatalog)[number]): RouteCardData {
  return {
    id: route.id,
    name: route.name,
    summary: route.shortDescription,
    fitFor: route.targetUsers,
    requirement: route.usageCondition,
    difficulty: `安装难度：${route.installDifficulty}`,
    tag: route.recommendationTag,
  };
}

function toRouteStepData(step: (typeof routeCatalog)[number]["steps"][number]): RouteStepData {
  return {
    id: step.id,
    stepOrder: step.stepOrder,
    title: step.title,
    content: step.content,
    successHint: step.successHint,
    troubleshootingHint: step.troubleshootingHint,
  };
}

export async function getRoutes(): Promise<RouteCardData[]> {
  return [...routeCatalog]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(toRouteCardData);
}

export async function getRouteById(id: string): Promise<RouteDetailData | null> {
  const route = routeCatalog.find((item) => item.id === id);

  if (!route) {
    return null;
  }

  return {
    ...toRouteCardData(route),
    modelName: route.modelName,
    toolName: route.toolName,
    sortOrder: route.sortOrder,
    isActive: true,
    steps: route.steps.map(toRouteStepData),
  };
}
