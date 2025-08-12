/*
  Warnings:

  - The values [ALL_CATEGORIES,INCOME_TAX,HIGH_COURT,SUPREME_COURT,TRIBUNAL_COURT] on the enum `CaseCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CaseCategory_new" AS ENUM ('all categories', 'ITAT', 'GST', 'Income tax', 'High Court', 'Supreme court', 'tribunal court');
ALTER TABLE "case_laws" ALTER COLUMN "category" TYPE "CaseCategory_new" USING ("category"::text::"CaseCategory_new");
ALTER TYPE "CaseCategory" RENAME TO "CaseCategory_old";
ALTER TYPE "CaseCategory_new" RENAME TO "CaseCategory";
DROP TYPE "CaseCategory_old";
COMMIT;
