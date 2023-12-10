import { Router } from 'express';
import { getPost, getPosts } from '../db/posts.js';

const router = Router();

router.get('/', getHomePageHandler);
router.get('/:id(\\d+)', getHistoryHandler);

async function getHomePageHandler(req, res) {
  req.isAuthenticated() ? renderHomePage(res) : res.render('landing');
}
const BASE_DATE = "December 6, 2023";

async function getHistoryHandler(req, res) {
  console.log("history handler " + req.params.id);
  // Treat id as days since Dec 5th 2023
  const { id } = req.params;
  const prompt = getDayPrompt(id);
  const posts = await getPosts({
    // Midnight {id} days after Dec 5th 2023
    startTime: new Date(new Date(BASE_DATE).setDate(new Date(BASE_DATE).getDate() + parseInt(id))),
    // Midnight {id + 1} days after Dec 5th 2023
    endTime: new Date(new Date(BASE_DATE).setDate(new Date(BASE_DATE).getDate() + parseInt(id) + 1))
  });
  res.render('home', { posts: posts, prompt: prompt });
}

async function renderHomePage(res) {
  //Load a page of posts and show in reverse chronological order
  try {
    const posts = await getPosts({
      //Midnight yesterday eastern
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      //Midnight today eastern
      endTime: new Date(new Date().setHours(24, 0, 0, 0))
    });

    //days since dec 5th 2023
    const daysSince = Math.floor((new Date() - new Date(BASE_DATE)) / (1000 * 60 * 60 * 24))
    const prompt = getDayPrompt(daysSince);

    res.render('home', { posts: posts, prompt: prompt }) ;

  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the post.' });
  }
}

const prompts = `Describe the moment you realized your childhood was over.
Write a letter to someone who will never read it.
Invent a myth that explains why the ocean is salty.
Craft a story where time moves backwards.
Describe a futuristic city with a dark secret.
Write from the perspective of the last tree on Earth.
Imagine you woke up with a new sense, describe your day.
Create a dialogue between the moon and the sun.
Write about a world where dreams are currency.
Describe the most memorable meal you've ever had.
Pen a tale of a city hidden inside a raindrop.
Write about a character who can communicate with animals.
Describe a world where color is a sound.
Invent a day in the life of someone who lives in reverse.
Write a story about a forgotten letter that changes everything.
Create a myth about why humans have fingerprints.
Detail a journey through the eyes of your backpack.
Describe the experience of falling in love from an inanimate object's POV.
Write a monologue from a villain's perspective on heroism.
Compose a diary entry from a character living in a dystopian world.
Write about the adventure of the oldest tree in a magical forest.
Imagine a world where shadows tell secrets.
Craft a letter from a soldier on a forgotten battlefield.
Describe a day in a world where gravity changes direction every hour.
Write about the discovery of an underground civilization.
Invent a story of an astronaut who finds a letter on the moon.
Describe a library where every book is alive.
Write about a detective solving a crime where the city is the suspect.
Create a conversation between two mountains.
Describe the life of a ghost who is haunting their childhood home.
Write from the perspective of a color.
Imagine what happens when the world's clocks stop ticking.
Write about a character who can walk through mirrors.
Describe a celebration in a society where aging is optional.
Invent a fairytale about a dragon who breathes water instead of fire.
Write the story of a journey through a land where shadows are solid.
Describe what happens when a character becomes their reflection.
Write about a civilization where language is sung rather than spoken.
Create a tale about the first human to live on another planet.
Write about a character who can see the true form of everyone's soul.`

//Using the prompts variable, split the string into an array of prompts
const promptArray = prompts.split("\n")

function getDayPrompt(day) {
  return promptArray[day % promptArray.length]
}

export { router };
