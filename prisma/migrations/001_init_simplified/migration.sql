-- CreateEnum: Case Categories
CREATE TYPE "CaseCategory" AS ENUM ('ALL_CATEGORIES', 'ITAT', 'GST', 'INCOME_TAX', 'HIGH_COURT', 'SUPREME_COURT', 'TRIBUNAL_COURT');

-- CreateTable: Case Laws Data (from API search results)
CREATE TABLE "case_laws" (
    "id" TEXT NOT NULL,
    "tid" INTEGER NOT NULL,
    "author_id" INTEGER,
    "bench" TEXT,
    "cat_ids" TEXT,
    "doc_size" INTEGER,
    "doc_source" TEXT NOT NULL,
    "doc_type" INTEGER,
    "fragment" BOOLEAN DEFAULT false,
    "headline" TEXT,
    "num_cited_by" INTEGER NOT NULL DEFAULT 0,
    "num_cites" INTEGER NOT NULL DEFAULT 0,
    "publish_date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "CaseCategory",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_laws_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Detailed Case Data (from individual case API calls)
CREATE TABLE "case_details" (
    "id" TEXT NOT NULL,
    "tid" INTEGER NOT NULL,
    "agreement" BOOLEAN NOT NULL DEFAULT false,
    "cite_tid" INTEGER,
    "court_copy" BOOLEAN NOT NULL DEFAULT false,
    "div_type" TEXT,
    "doc" TEXT NOT NULL,
    "doc_source" TEXT NOT NULL,
    "num_cited_by" INTEGER NOT NULL DEFAULT 0,
    "num_cites" INTEGER NOT NULL DEFAULT 0,
    "publish_date" TEXT NOT NULL,
    "query_alert" JSONB,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Performance indexes
CREATE UNIQUE INDEX "case_laws_tid_key" ON "case_laws"("tid");
CREATE INDEX "case_laws_tid_idx" ON "case_laws"("tid");
CREATE INDEX "case_laws_category_idx" ON "case_laws"("category");
CREATE INDEX "case_laws_publish_date_idx" ON "case_laws"("publish_date");
CREATE INDEX "case_laws_doc_source_idx" ON "case_laws"("doc_source");

CREATE UNIQUE INDEX "case_details_tid_key" ON "case_details"("tid");
CREATE INDEX "case_details_tid_idx" ON "case_details"("tid");
CREATE INDEX "case_details_num_cited_by_idx" ON "case_details"("num_cited_by");
CREATE INDEX "case_details_doc_source_idx" ON "case_details"("doc_source");

-- AddForeignKey: Link case details to case laws
ALTER TABLE "case_details" ADD CONSTRAINT "case_details_tid_fkey" FOREIGN KEY ("tid") REFERENCES "case_laws"("tid") ON DELETE CASCADE ON UPDATE CASCADE;