import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';
import courseSessions from "./courseSessions.js";

const router = express.Router();

// Route groups
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use("/api/course-sessions", courseSessions);

export default router;
