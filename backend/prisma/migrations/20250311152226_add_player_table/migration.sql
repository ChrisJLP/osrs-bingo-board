/*
  Warnings:

  - You are about to drop the `BingoProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contribution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MainBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamBoardTile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_teamBoardId_fkey";

-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_tileId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_teamBoardId_fkey";

-- DropForeignKey
ALTER TABLE "MainBoard" DROP CONSTRAINT "MainBoard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TeamBoard" DROP CONSTRAINT "TeamBoard_boardId_fkey";

-- DropForeignKey
ALTER TABLE "TeamBoard" DROP CONSTRAINT "TeamBoard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TeamBoard" DROP CONSTRAINT "TeamBoard_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamBoardTile" DROP CONSTRAINT "TeamBoardTile_teamBoardId_fkey";

-- DropForeignKey
ALTER TABLE "TeamBoardTile" DROP CONSTRAINT "TeamBoardTile_tileId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_boardId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Tile" DROP CONSTRAINT "Tile_boardId_fkey";

-- DropTable
DROP TABLE "BingoProject";

-- DropTable
DROP TABLE "Contribution";

-- DropTable
DROP TABLE "Leaderboard";

-- DropTable
DROP TABLE "MainBoard";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamBoard";

-- DropTable
DROP TABLE "TeamBoardTile";

-- DropTable
DROP TABLE "TeamMember";

-- DropTable
DROP TABLE "Tile";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "overallLevel" INTEGER NOT NULL,
    "overallXp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_boardId_key" ON "Player"("boardId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "SoloBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
