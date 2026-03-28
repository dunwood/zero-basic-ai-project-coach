import { PrismaClient } from "@prisma/client";
import { routeCatalog } from "../lib/data/routes";

const prisma = new PrismaClient();

async function main() {
  for (const route of routeCatalog) {
    await prisma.route.upsert({
      where: { id: route.id },
      update: {
        name: route.name,
        modelName: route.modelName,
        toolName: route.toolName,
        shortDescription: route.shortDescription,
        targetUsers: route.targetUsers,
        usageCondition: route.usageCondition,
        installDifficulty: route.installDifficulty,
        recommendationTag: route.recommendationTag,
        sortOrder: route.sortOrder,
        isActive: true,
        steps: {
          deleteMany: {},
          create: route.steps.map((step) => ({
            id: step.id,
            stepOrder: step.stepOrder,
            title: step.title,
            content: step.content,
            successHint: step.successHint,
            troubleshootingHint: step.troubleshootingHint,
          })),
        },
      },
      create: {
        id: route.id,
        name: route.name,
        modelName: route.modelName,
        toolName: route.toolName,
        shortDescription: route.shortDescription,
        targetUsers: route.targetUsers,
        usageCondition: route.usageCondition,
        installDifficulty: route.installDifficulty,
        recommendationTag: route.recommendationTag,
        sortOrder: route.sortOrder,
        isActive: true,
        steps: {
          create: route.steps.map((step) => ({
            id: step.id,
            stepOrder: step.stepOrder,
            title: step.title,
            content: step.content,
            successHint: step.successHint,
            troubleshootingHint: step.troubleshootingHint,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Prisma seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
