import express from 'express';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import './config/passport.js';
import { router as authRouter } from './routes/auth.js';
import { router as postRouter } from './routes/post.js';
import { router as userRouter } from './routes/user.js';
import { router as apiRouter } from './routes/api/api.js';
import { getHomePageHandler as homePageHandler} from './routes/home.js';

import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: 'auto' },
}));
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware to expose user to templates
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRouter);
app.use('/p', ensureAuthenticated, postRouter);
app.use('/u', ensureAuthenticated, userRouter);
app.use('/api', ensureAuthenticated, apiRouter);

app.get('/', homePageHandler);
app.get('/privacy', privacyPageHandler);
app.get('/tos', tosPageHandler);

const PORT = process.env.PORT || "8080";
const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Cleanup resources when the server is shutting down
process.on('SIGTERM', cleanup);

async function cleanup() {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  });
}

// Route Handlers

function privacyPageHandler(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'privacy_policy.html'));
}

function tosPageHandler(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'terms_of_service.html'));
}


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // If the request is AJAX, send a 401 error directly
  if (req.xhr) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // For non-AJAX requests, redirect to the Google auth page
  res.redirect(`/auth/google/${encodeURIComponent(req.originalUrl)}`);
}
