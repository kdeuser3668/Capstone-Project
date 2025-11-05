import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';
import changePWRoutes from './changePW.js';
import calendarRoutes from "./calendar.js";
import notesRoutes from "./notes.js";

const router = express.Router();

// Route groups
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/change-password', changePWRoutes);
router.use("/notes", notesRoutes);
router.use("/api/calendar", calendarRoutes);

export default router;
