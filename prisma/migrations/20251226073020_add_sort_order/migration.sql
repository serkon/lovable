-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BioTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_BioTemplate" ("content", "id") SELECT "content", "id" FROM "BioTemplate";
DROP TABLE "BioTemplate";
ALTER TABLE "new_BioTemplate" RENAME TO "BioTemplate";
CREATE UNIQUE INDEX "BioTemplate_content_key" ON "BioTemplate"("content");
CREATE TABLE "new_Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Education" ("id", "name") SELECT "id", "name" FROM "Education";
DROP TABLE "Education";
ALTER TABLE "new_Education" RENAME TO "Education";
CREATE UNIQUE INDEX "Education_name_key" ON "Education"("name");
CREATE TABLE "new_Gender" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Gender" ("id", "name") SELECT "id", "name" FROM "Gender";
DROP TABLE "Gender";
ALTER TABLE "new_Gender" RENAME TO "Gender";
CREATE UNIQUE INDEX "Gender_name_key" ON "Gender"("name");
CREATE TABLE "new_Hobby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Hobby" ("id", "name") SELECT "id", "name" FROM "Hobby";
DROP TABLE "Hobby";
ALTER TABLE "new_Hobby" RENAME TO "Hobby";
CREATE UNIQUE INDEX "Hobby_name_key" ON "Hobby"("name");
CREATE TABLE "new_IceBreaker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_IceBreaker" ("content", "id") SELECT "content", "id" FROM "IceBreaker";
DROP TABLE "IceBreaker";
ALTER TABLE "new_IceBreaker" RENAME TO "IceBreaker";
CREATE UNIQUE INDEX "IceBreaker_content_key" ON "IceBreaker"("content");
CREATE TABLE "new_Intention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Intention" ("id", "name") SELECT "id", "name" FROM "Intention";
DROP TABLE "Intention";
ALTER TABLE "new_Intention" RENAME TO "Intention";
CREATE UNIQUE INDEX "Intention_name_key" ON "Intention"("name");
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Job" ("id", "name") SELECT "id", "name" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_name_key" ON "Job"("name");
CREATE TABLE "new_MaritalStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_MaritalStatus" ("id", "name") SELECT "id", "name" FROM "MaritalStatus";
DROP TABLE "MaritalStatus";
ALTER TABLE "new_MaritalStatus" RENAME TO "MaritalStatus";
CREATE UNIQUE INDEX "MaritalStatus_name_key" ON "MaritalStatus"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
