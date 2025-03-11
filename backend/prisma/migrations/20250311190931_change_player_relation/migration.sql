/*
  Warnings:

  - You are about to drop the column `boardId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_boardId_fkey";

-- DropIndex
DROP INDEX "Player_boardId_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "boardId";

-- AlterTable
ALTER TABLE "SoloBoard" ADD COLUMN     "playerId" TEXT;

-- AddForeignKey
ALTER TABLE "SoloBoard" ADD CONSTRAINT "SoloBoard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
