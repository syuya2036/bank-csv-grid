-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('SUBJECT', 'KPI');

-- CreateEnum
CREATE TYPE "MetricKind" AS ENUM ('ACTUAL', 'FORECAST', 'KPI');

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "type" "TagType" NOT NULL DEFAULT 'SUBJECT';

-- CreateTable
CREATE TABLE "MonthlyMetric" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "kind" "MetricKind" NOT NULL,
    "value" DOUBLE PRECISION,
    "formula" TEXT,
    "error" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyMetric_tagId_yearMonth_kind_key" ON "MonthlyMetric"("tagId", "yearMonth", "kind");

-- AddForeignKey
ALTER TABLE "MonthlyMetric" ADD CONSTRAINT "MonthlyMetric_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
