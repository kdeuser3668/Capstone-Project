import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';

const router = express.Router();

// Route groups
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);

export default router;
