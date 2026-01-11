-- AlterTable
ALTER TABLE "User" ADD COLUMN "district" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BioTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "hobbyId" TEXT,
    CONSTRAINT "BioTemplate_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BioTemplate" ("content", "id", "sortOrder") SELECT "content", "id", "sortOrder" FROM "BioTemplate";
DROP TABLE "BioTemplate";
ALTER TABLE "new_BioTemplate" RENAME TO "BioTemplate";
CREATE UNIQUE INDEX "BioTemplate_content_key" ON "BioTemplate"("content");
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL DEFAULT 'other',
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Job" ("id", "name", "sortOrder") SELECT "id", "name", "sortOrder" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_name_key" ON "Job"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
