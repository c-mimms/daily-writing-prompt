// routes/api/
import { Router } from 'express';
import { router as postRouter } from './posts.js';
import { router as userRouter } from './users.js';

const router = Router();

router.use((req, res, next) => {
  console.log(`API request: ${req.method} ${req.originalUrl}`);
  next();
});

router.use('/posts', postRouter);
router.use('/users', userRouter);

export { router };
