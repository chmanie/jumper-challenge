-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "symbol" TEXT
);

-- CreateTable
CREATE TABLE "_TokenToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TokenToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Token" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TokenToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TokenToUser_AB_unique" ON "_TokenToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TokenToUser_B_index" ON "_TokenToUser"("B");
