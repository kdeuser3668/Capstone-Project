import express from "express";
import {
  getAllExams,
  getExamsByDate,
  addExam,
  deleteExam,
  getGoogleAuthURL,
  getGoogleEvents
} from "../controllers/calendarController.js";

const router = express.Router();

// local db; exams 
router.get("/", getAllExams);         // GET all exams
router.get("/:date", getExamsByDate); // GET exams for a specific date (YYYY-MM-DD)
router.post("/", addExam);            // POST new exam
router.delete("/:id", deleteExam);    // DELETE exam by ID

// google calendar 
router.get("/google/auth", getGoogleAuthURL);
router.get("/google/events", getGoogleEvents);
router.get("/google/callback", async (req, res) => { // Handles Google redirect
  const { code } = req.query;
  if (!code) return res.status(400).send("No code provided");

  try {
    const events = await getGoogleEventsFromCode(code); // Exchange code & fetch events
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
