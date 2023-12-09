import { Router } from 'express';
import { getPost, getPosts } from '../db/posts.js';
import { getNearestNeighbors } from '../db/embeddings.js';

const router = Router();

router.get('/:id', getSinglePostHandler);

async function getSinglePostHandler(req, res) {
  const { id } = req.params;

  try {
    const post = await getPost(id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const neighbors = await getNearestNeighbors(post.id, 5);
    const neighborPosts = await Promise.all(neighbors.map(async (neighbor) => {
      const post = await getPost(neighbor.postId);
      return post;
    }));
    
    res.render('post', { post, similarPosts: neighborPosts });

  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the post.' });
  }
}

export { router };
