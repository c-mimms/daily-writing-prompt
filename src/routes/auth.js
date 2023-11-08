// routes/auth.js
import { Router } from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.use((req, res, next) => { 
  console.log(req.url);
  console.log(req.body);
  next();
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/auth/login',
  failureMessage: true
}));

router.post('/signup', signupHandler);

async function signupHandler(req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    // if (err) { return next(err); }
    
    const existingUser = await prisma.user.findUnique({ where: { username: req.body.username } });
    if(existingUser) {
      res.redirect('/auth/login'); //Add message that user already exists
      return;
    }

    prisma.user.create({
      data: {
        username: req.body.username,
        passwordHash: hashedPassword,
        salt: salt,
        // other fields...
      }
    }).then((user) => {
      req.login(user, function(err) {
        res.redirect('/');
      });});
  });
}

router.get('/google', (req, res) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'] ,
  })(req,res);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    if (req.query.state !== undefined) {
      res.redirect(req.query.state);
    } else {
      res.redirect('/');
    }
});

router.get('/google/:state', (req, res) => {
  const { state } = req.params;
  const redirectUrl = decodeURIComponent(state);
  passport.authenticate('google', {
    scope: ['profile', 'email'] ,
    state: redirectUrl
  })(req,res);
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.end()
  }
});

export { router };
