import express from "express";
import {
  getAllEvents,
  getEventsByDate,
  addEvent,
  deleteEvent,
  getGoogleAuthURL,
  getGoogleEvents
} from "../controllers/calendarController.js";

const router = express.Router();

// local db; exams 
router.get("/", getAllEvents);         // GET all exams
router.get("/:date", getEventsByDate); // GET exams for a specific date (YYYY-MM-DD)
router.post("/", addEvent);            // POST new exam
router.delete("/:id", deleteEvent);    // DELETE exam by ID

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
