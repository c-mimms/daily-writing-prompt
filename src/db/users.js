// userService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get a user by ID.
 * @param {number} id - The ID of the user.
 * @returns {Promise<object|null>} - A Promise that resolves to the user object or null if not found.
 */
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
}

/**
 * Get a user by Google ID.
 * @param {string} googleId - The Google ID of the user.
 * @returns {Promise<object|null>} - A Promise that resolves to the user object or null if not found.
 */
async function getUserByGoogleId(googleId) {
  return prisma.user.findUnique({ where: { googleId: googleId } });
}

/**
 * Get a user by username.
 * @param {string} username - The username of the user.
 * @returns {Promise<object|null>} - A Promise that resolves to the user object or null if not found.
 */
async function getUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

/**
 * Get a user by email.
 * @param {string} email - The email of the user.
 * @returns {Promise<object|null>} - A Promise that resolves to the user object or null if not found.
 */
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

/**
 * Create a new user.
 * @param {object} user - The user object.
 * @returns {Promise<object>} - A Promise that resolves to the newly created user.
 */
async function createUser(user) {
  return prisma.user.create({ data: user });
}

export { getUserById, getUserByGoogleId, getUserByUsername, getUserByEmail, createUser };
