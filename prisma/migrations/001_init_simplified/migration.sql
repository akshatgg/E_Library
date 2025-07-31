-- CreateEnum
CREATE TYPE "CaseCategory" AS ENUM ('ITAT', 'GST', 'INCOME_TAX', 'HIGH_COURT', 'SUPREME_COURT', 'OTHER');

-- CreateEnum
CREATE TYPE "CaseOutcome" AS ENUM ('allowed', 'dismissed', 'partly_allowed');

-- CreateTable: Basic Case Laws Data (from dashboard search results)
CREATE TABLE "case_laws" (
    "id" TEXT NOT NULL,
    "tid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "bench" TEXT,
    "category" "CaseCategory" NOT NULL,
    "outcome" "CaseOutcome" NOT NULL DEFAULT 'allowed',
    "appellant" TEXT,
    "respondent" TEXT,
    "caseNumber" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "relevantSections" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "legalPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_laws_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Detailed Case Data (from individual case API calls)
CREATE TABLE "case_details" (
    "id" TEXT NOT NULL,
    "tid" INTEGER NOT NULL,
    "publishdate" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "doc" TEXT NOT NULL,
    "numcites" INTEGER NOT NULL DEFAULT 0,
    "numcitedby" INTEGER NOT NULL DEFAULT 0,
    "docsource" TEXT NOT NULL,
    "citetid" INTEGER,
    "divtype" TEXT,
    "courtcopy" BOOLEAN NOT NULL DEFAULT false,
    "agreement" BOOLEAN NOT NULL DEFAULT false,
    "queryAlert" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "case_laws_tid_key" ON "case_laws"("tid");
CREATE INDEX "case_laws_tid_idx" ON "case_laws"("tid");
CREATE INDEX "case_laws_category_idx" ON "case_laws"("category");
CREATE INDEX "case_laws_date_idx" ON "case_laws"("date");

-- CreateIndex
CREATE UNIQUE INDEX "case_details_tid_key" ON "case_details"("tid");
CREATE INDEX "case_details_tid_idx" ON "case_details"("tid");
CREATE INDEX "case_details_numcitedby_idx" ON "case_details"("numcitedby");
CREATE INDEX "case_details_docsource_idx" ON "case_details"("docsource");

-- AddForeignKey
ALTER TABLE "case_details" ADD CONSTRAINT "case_details_tid_fkey" FOREIGN KEY ("tid") REFERENCES "case_laws"("tid") ON DELETE CASCADE ON UPDATE CASCADE;
