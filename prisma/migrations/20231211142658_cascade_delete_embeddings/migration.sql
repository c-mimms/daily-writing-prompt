-- DropForeignKey
ALTER TABLE "Embedding" DROP CONSTRAINT "Embedding_postId_fkey";

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
