import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';
import calendarRoutes from "./calendar.js";

const router = express.Router();

// Route groups
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use("/api/calendar", calendarRoutes);

export default router;
