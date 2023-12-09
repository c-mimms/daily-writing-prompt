// postService.js
import { PrismaClient } from '@prisma/client';
import pgvector from 'pgvector/utils';

const prisma = new PrismaClient();

/**
 * Create an embedding for a post.
 * @param {number} postId - The post id to create an embedding for.
 * @param {number[]} embedding - The embedding to create.
 * @returns {Promise<object>} - A Promise that resolves to the embedding.
 */
async function createEmbedding(postId, embedding) {
    const emb = pgvector.toSql(embedding);
    return await prisma.$queryRaw`INSERT INTO "Embedding" ("postId", value) VALUES (${postId}, ${embedding}::vector)`;
}

/**
 * Get the nearest neighbors of a post.
 * @param {number} postId - The post id to get the nearest neighbors of.
 * @param {number} k - The number of neighbors to get.
 * @returns {Promise<object[]>} - A Promise that resolves to the nearest neighbors.
 */
async function getNearestNeighbors(postId, k) {
    const neighbors = await prisma.$queryRaw`SELECT "postId" FROM "Embedding" ORDER BY value <-> (SELECT value FROM "Embedding" WHERE "postId" = ${postId}) LIMIT ${k}`;
    return neighbors;
}

export { createEmbedding, getNearestNeighbors };
