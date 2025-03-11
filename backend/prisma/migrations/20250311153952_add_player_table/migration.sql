/*
  Warnings:

  - Added the required column `agilityXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attackXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constructionXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cookingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `craftingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defenceXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firemakingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fishingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fletchingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `herbloreXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hitpointsXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hunterXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magicXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `miningXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prayerXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rangedXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runecraftXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slayerXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smithingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strengthXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thievingXp` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `woodcuttingXp` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "agilityXp" INTEGER NOT NULL,
ADD COLUMN     "attackXp" INTEGER NOT NULL,
ADD COLUMN     "constructionXp" INTEGER NOT NULL,
ADD COLUMN     "cookingXp" INTEGER NOT NULL,
ADD COLUMN     "craftingXp" INTEGER NOT NULL,
ADD COLUMN     "defenceXp" INTEGER NOT NULL,
ADD COLUMN     "farmingXp" INTEGER NOT NULL,
ADD COLUMN     "firemakingXp" INTEGER NOT NULL,
ADD COLUMN     "fishingXp" INTEGER NOT NULL,
ADD COLUMN     "fletchingXp" INTEGER NOT NULL,
ADD COLUMN     "herbloreXp" INTEGER NOT NULL,
ADD COLUMN     "hitpointsXp" INTEGER NOT NULL,
ADD COLUMN     "hunterXp" INTEGER NOT NULL,
ADD COLUMN     "magicXp" INTEGER NOT NULL,
ADD COLUMN     "miningXp" INTEGER NOT NULL,
ADD COLUMN     "prayerXp" INTEGER NOT NULL,
ADD COLUMN     "rangedXp" INTEGER NOT NULL,
ADD COLUMN     "runecraftXp" INTEGER NOT NULL,
ADD COLUMN     "slayerXp" INTEGER NOT NULL,
ADD COLUMN     "smithingXp" INTEGER NOT NULL,
ADD COLUMN     "strengthXp" INTEGER NOT NULL,
ADD COLUMN     "thievingXp" INTEGER NOT NULL,
ADD COLUMN     "woodcuttingXp" INTEGER NOT NULL;
