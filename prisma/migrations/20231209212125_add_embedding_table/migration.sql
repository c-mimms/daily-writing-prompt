-- CreateTable
CREATE TABLE "Embedding" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER,
    "value" vector(1536),

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_postId_key" ON "Embedding"("postId");

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
