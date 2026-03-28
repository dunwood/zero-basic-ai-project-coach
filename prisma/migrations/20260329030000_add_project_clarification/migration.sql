-- CreateTable
CREATE TABLE "ProjectClarification" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectClarification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectClarification_projectId_key" ON "ProjectClarification"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectClarification" ADD CONSTRAINT "ProjectClarification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
