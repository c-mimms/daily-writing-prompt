import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all followers of a user
 * @param {number} id - The ID of the user.
 * @returns {Promise<object[]>} - A Promise that resolves to an array of following users.
 */
async function getFollowers(id) {
    return prisma.user.findUnique({ where: { id: parseInt(id, 10) } }).followers();
}

/**
 * Get all users that a user is following.
 * @param {number} id - The ID of the user.
 * @returns {Promise<object[]>} - A Promise that resolves to an array of following users.
 */
async function getFollowing(id) {
    return prisma.user.findUnique({ where: { id: parseInt(id, 10) } }).following();
}

/**
 * Follow a user.
 * @param {number} followerId - The ID of the user that is following.
 * @param {number} followingId - The ID of the user that is being followed.
 * @returns boolean - True if the follow was successful, false otherwise.
 */
async function followUser(followerId, followingId) {
    try {
        await prisma.follow.create({
            data: {
                followerId: followerId,
                followingId: followingId,
            },
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Unfollow a user.
 * @param {number} followerId - The ID of the user that is following.
 * @param {number} followingId - The ID of the user that is being followed.
 * @returns boolean - True if the unfollow was successful, false otherwise.
 */
async function unfollowUser(followerId, followingId) {
    try {
        await prisma.follow.deleteMany({
            where: {
                followerId: followerId,
                followingId: followingId,
            },
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export { getFollowers, getFollowing, followUser, unfollowUser };