import { Router } from 'express';
import { getPost, getPosts } from '../db/posts.js';

const router = Router();

router.get('/', getHomePageHandler);

async function getHomePageHandler(req, res) {

  //Load a page of posts and show in reverse chronological order
  try {
    const posts = await getPosts();
    console.log(posts);
    res.render('home', { posts: posts });

  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the post.' });
  }
}

export { router };
