-- CreateTable
CREATE TABLE "BingoProject" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BingoProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainBoard" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "rows" INTEGER NOT NULL DEFAULT 5,
    "columns" INTEGER NOT NULL DEFAULT 5,
    "password" TEXT,
    "color" VARCHAR(7),
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MainBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tile" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" VARCHAR(255),
    "target" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'drops',
    "color" VARCHAR(7),
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "boardId" TEXT,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamBoard" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "password" TEXT,
    "completedRows" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "completedColumns" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "completedDiagonals" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "TeamBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamBoardTile" (
    "id" TEXT NOT NULL,
    "teamBoardId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TeamBoardTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "teamBoardId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "teamBoardId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainBoard_projectId_key" ON "MainBoard"("projectId");

-- AddForeignKey
ALTER TABLE "MainBoard" ADD CONSTRAINT "MainBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "BingoProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tile" ADD CONSTRAINT "Tile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "MainBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "BingoProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "TeamBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamBoard" ADD CONSTRAINT "TeamBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "BingoProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamBoard" ADD CONSTRAINT "TeamBoard_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamBoard" ADD CONSTRAINT "TeamBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "MainBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamBoardTile" ADD CONSTRAINT "TeamBoardTile_teamBoardId_fkey" FOREIGN KEY ("teamBoardId") REFERENCES "TeamBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamBoardTile" ADD CONSTRAINT "TeamBoardTile_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_teamBoardId_fkey" FOREIGN KEY ("teamBoardId") REFERENCES "TeamBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_teamBoardId_fkey" FOREIGN KEY ("teamBoardId") REFERENCES "TeamBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
