-- CreateTable
CREATE TABLE "SoloBoard" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "title" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoloBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoloTile" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" VARCHAR(255),
    "target" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'drops',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SoloTile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SoloBoard_name_key" ON "SoloBoard"("name");

-- AddForeignKey
ALTER TABLE "SoloTile" ADD CONSTRAINT "SoloTile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "SoloBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
