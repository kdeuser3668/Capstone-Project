import express from "express";
import {
  getAllEvents,
  getEventsByDate,
  addEvent,
  deleteEvent,
} from "../controllers/calendarController.js";

const router = express.Router();

router.get("/", getAllEvents);         // GET all events
router.get("/:date", getEventsByDate); // GET events for a specific date (YYYY-MM-DD)
router.post("/", addEvent);            // POST new event
router.delete("/:id", deleteEvent);    // DELETE event by ID

export default router;
