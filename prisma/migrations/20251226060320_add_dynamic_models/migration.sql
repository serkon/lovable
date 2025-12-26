/*
  Warnings:

  - You are about to drop the column `education` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `intention` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MaritalStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Intention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "age" INTEGER,
    "city" TEXT,
    "jobId" TEXT,
    "genderId" TEXT,
    "bio" TEXT,
    "educationId" TEXT,
    "maritalStatusId" TEXT,
    "intentionId" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_maritalStatusId_fkey" FOREIGN KEY ("maritalStatusId") REFERENCES "MaritalStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_intentionId_fkey" FOREIGN KEY ("intentionId") REFERENCES "Intention" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "bio", "city", "createdAt", "genderId", "id", "imageUrl", "jobId", "name", "updatedAt") SELECT "age", "bio", "city", "createdAt", "genderId", "id", "imageUrl", "jobId", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MaritalStatus_name_key" ON "MaritalStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Education_name_key" ON "Education"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Intention_name_key" ON "Intention"("name");
