import { Router } from 'express';
import { getPosts } from '../db/posts.js';

const router = Router();

const BASE_DATE = "December 6, 2023";

router.get('/', getRootHandler);
router.get('/:id(\\d+)', getIdHandler);

function calculateDaysSince(date) {
  return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
}

async function getRootHandler(req, res) {
  const daysSince = calculateDaysSince(BASE_DATE);
  const startTime = new Date().setHours(0, 0, 0, 0);
  const endTime = new Date().setHours(24, 0, 0, 0);
  renderPage(req, res, daysSince, startTime, endTime);
}

async function getIdHandler(req, res) {
  const daysSince = calculateDaysSince(BASE_DATE);
  const id = parseInt(req.params.id);
  if (id > daysSince) {
    return res.redirect('/');
  }

  const startTime = new Date(BASE_DATE).setDate(new Date(BASE_DATE).getDate() + id);
  const endTime = new Date(BASE_DATE).setDate(new Date(BASE_DATE).getDate() + id + 1);
  renderPage(req, res, id, startTime, endTime);
}

async function renderPage(req, res, id, startTime, endTime) {
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);
  const prompt = getDayPrompt(id);
  const posts = await getPosts({ startTime: startDateTime, endTime: endDateTime });
  res.render('home', { posts, prompt, id });
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
