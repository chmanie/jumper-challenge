/*
  Warnings:

  - You are about to drop the `_TokenToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TokenToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chainId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_chainId_key" ON "LeaderboardEntry"("userId", "chainId");
