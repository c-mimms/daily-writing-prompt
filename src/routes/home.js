import { getPost, getPosts } from '../db/posts.js';

async function getHomePageHandler(req, res) {
  req.isAuthenticated() ? renderHomePage(res) : res.render('landing');
}

async function renderHomePage(res){
  //Load a page of posts and show in reverse chronological order
  try {
    const posts = await getPosts();
    res.render('home', { posts: posts });

  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the post.' });
  }
}

export { getHomePageHandler };
