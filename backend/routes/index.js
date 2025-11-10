import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';
import changePWRoutes from './changePW.js';
import calendarRoutes from "./calendar.js";
import notesRoutes from "./notes.js";
import getCoursesRoutes from "./getCourses.js";
import focusRoutes from "./focus.js";

const router = express.Router();

// Route groups
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/change-password', changePWRoutes);
router.use("/notes", notesRoutes);
router.use("/api/calendar", calendarRoutes);
router.use("/get-courses", getCoursesRoutes);
router.use("/focus", focusRoutes);

export default router;
