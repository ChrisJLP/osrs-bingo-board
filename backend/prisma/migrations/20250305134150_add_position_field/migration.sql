/*
  Warnings:

  - Added the required column `position` to the `SoloTile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoloTile" ADD COLUMN     "position" INTEGER NOT NULL;
