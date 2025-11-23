import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';
import changePWRoutes from './changePW.js';
import changeEmailRoutes from './changeEmail.js';
import calendarRoutes from "./calendar.js";
import notesRoutes from "./notes.js";
import updateNotesRoutes from "./updateNotes.js";
import getCoursesRoutes from "./getCourses.js";
import focusRoutes from "./focus.js";
import tasksRoutes from "./tasks.js";

const router = express.Router();

// Route groups
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/change-password', changePWRoutes);
router.use('/change-email', changeEmailRoutes);
router.use("/notes", notesRoutes);
router.use("/update-notes", updateNotesRoutes);
router.use("/api/calendar", calendarRoutes);
router.use("/get-courses", getCoursesRoutes);
router.use("/focus", focusRoutes);
router.use("/tasks", tasksRoutes);

export default router;
