-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "adherance" DOUBLE PRECISION,
    "quality" DOUBLE PRECISION,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_postId_key" ON "Score"("postId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
