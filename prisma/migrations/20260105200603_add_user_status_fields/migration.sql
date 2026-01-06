-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "password" TEXT,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "age" INTEGER,
    "city" TEXT,
    "country" TEXT,
    "jobId" TEXT,
    "genderId" TEXT,
    "bio" TEXT,
    "educationId" TEXT,
    "maritalStatusId" TEXT,
    "intentionId" TEXT,
    "userStatus" TEXT NOT NULL DEFAULT 'ONLINE',
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_intentionId_fkey" FOREIGN KEY ("intentionId") REFERENCES "Intention" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_maritalStatusId_fkey" FOREIGN KEY ("maritalStatusId") REFERENCES "MaritalStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "bio", "city", "country", "createdAt", "educationId", "email", "firstName", "genderId", "id", "intentionId", "jobId", "lastName", "maritalStatusId", "password", "phone", "updatedAt") SELECT "age", "bio", "city", "country", "createdAt", "educationId", "email", "firstName", "genderId", "id", "intentionId", "jobId", "lastName", "maritalStatusId", "password", "phone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
