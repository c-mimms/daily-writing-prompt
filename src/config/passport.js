// config/passport.js
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LocalStrategy from 'passport-local';
import { getUserById, getUserByUsername, getUserByGoogleId, createUser } from '../db/users.js';

import crypto from 'crypto';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});

passport.use(
  new LocalStrategy(
  async (username, password, done) => {
    console.log(`Entered local strategy: ${username} : ${password}`);
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      crypto.pbkdf2(password, existingUser.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err || !crypto.timingSafeEqual(existingUser.passwordHash, hashedPassword)) {
          console.log(`Failed to authenticate user: ${username}`);
          done(null,false);
        } else {
          console.log(`Authenticated user: ${username}`);
          done(null, existingUser);
        }
      });
    }
    else {
      console.log(`Failed to authenticate user: ${username} outside`);
      done(null,false);
    } 
  }
));

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await getUserByGoogleId(profile.id);

    // console.log(profile);
    if (existingUser) {
      //TODO populate any fields if the user updates their account
      done(null, existingUser);
    } else {
      //User email will be first verified email, or first email if exists
      const userEmail = (profile.emails && profile.emails.length > 0)
        ? profile.emails.find((email) => email.verified)?.value || profile.emails[0]?.value
        : null;

      const user = await createUser(
        {
          googleId: profile.id,
          username: profile.displayName,
          email: userEmail,
          // other fields...
        }
      );

      done(null, user);
    }
  })
);
