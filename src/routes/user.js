// routes/api/
import { Router } from 'express';
import { getPost, getPosts } from '../db/posts.js';
import { getUserById, getUserByUsername } from '../db/users.js';

const router = Router();

router.get('/:identifier', getUserHandler);

async function getUserHandler(req, res) {
  const { identifier } = req.params;

  try {
    let user;
    if (!isNaN(identifier)) {
      // If the identifier is a number, treat it as ID
      user = await getUserById(identifier, true, true);
    } else {
      // Otherwise, treat it as username
      user = await getUserByUsername(identifier, true, true);
    }

    if (!user) return res.status(404).json({ error: 'User not found.' });

    const userPosts = user.posts;
    //await getPosts({ authors: [user.id] });

    res.render('user', { user, userPosts });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the user.' });
  }
}

export { router };
