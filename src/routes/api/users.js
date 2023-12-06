// routes/api/posts.js
import { Router } from 'express';
import { followUser, unfollowUser } from '../../db/followers.js';

const router = Router();

router.post('/:id/follow', async (req, res) => {
  const followerId = req.user.id; // assuming req.user contains the authenticated user
  const followingId = parseInt(req.params.id, 10);

  const success = await followUser(followerId, followingId);
  if (success) {
    res.json({ message: 'Followed successfully' });
  } else {
    res.status(500).json({ error: 'An error occurred while following the user' });
  }
});

router.post('/:id/unfollow', async (req, res) => {
  const followerId = req.user.id; // assuming req.user contains the authenticated user
  const followingId = parseInt(req.params.id, 10);

  const success = await unfollowUser(followerId, followingId);
  if (success) {
    res.json({ message: 'Unfollowed successfully' });
  } else {
    res.status(500).json({ error: 'An error occurred while unfollowing the user' });
  }
});

export { router };
