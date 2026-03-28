import { prisma } from "@/lib/prisma";
import type { RouteCardData, RouteDetailData, RouteStepData } from "@/lib/types/route";

function toRouteCardData(route: {
  id: string;
  name: string;
  shortDescription: string;
  targetUsers: string;
  usageCondition: string;
  installDifficulty: string;
  recommendationTag: string;
}): RouteCardData {
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

function toRouteStepData(step: {
  id: string;
  stepOrder: number;
  title: string;
  content: string;
  successHint: string | null;
  troubleshootingHint: string | null;
}): RouteStepData {
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
  const routes = await prisma.route.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      targetUsers: true,
      usageCondition: true,
      installDifficulty: true,
      recommendationTag: true,
    },
  });

  return routes.map(toRouteCardData);
}

export async function getRouteById(id: string): Promise<RouteDetailData | null> {
  const route = await prisma.route.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      modelName: true,
      toolName: true,
      shortDescription: true,
      targetUsers: true,
      usageCondition: true,
      installDifficulty: true,
      recommendationTag: true,
      sortOrder: true,
      isActive: true,
      steps: {
        orderBy: { stepOrder: "asc" },
        select: {
          id: true,
          stepOrder: true,
          title: true,
          content: true,
          successHint: true,
          troubleshootingHint: true,
        },
      },
    },
  });

  if (!route) {
    return null;
  }

  return {
    ...toRouteCardData(route),
    modelName: route.modelName,
    toolName: route.toolName,
    sortOrder: route.sortOrder,
    isActive: route.isActive,
    steps: route.steps.map(toRouteStepData),
  };
}
