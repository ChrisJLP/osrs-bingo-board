/*
  Warnings:

  - You are about to drop the column `position` on the `SoloTile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SoloBoard" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SoloTile" DROP COLUMN "position";
