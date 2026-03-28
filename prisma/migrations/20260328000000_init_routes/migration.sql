-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "targetUsers" TEXT NOT NULL,
    "usageCondition" TEXT NOT NULL,
    "installDifficulty" TEXT NOT NULL,
    "recommendationTag" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStep" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "successHint" TEXT,
    "troubleshootingHint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_sortOrder_idx" ON "Route"("sortOrder");

-- CreateIndex
CREATE INDEX "RouteStep_routeId_idx" ON "RouteStep"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStep_routeId_stepOrder_key" ON "RouteStep"("routeId", "stepOrder");

-- AddForeignKey
ALTER TABLE "RouteStep" ADD CONSTRAINT "RouteStep_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
