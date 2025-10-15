import { db } from "../db.js";

export const getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events ORDER BY start_time ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params; // expecting YYYY-MM-DD
    const [rows] = await db.query(
      "SELECT * FROM events WHERE DATE(start_time) = ?",
      [date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEvent = async (req, res) => {
  try {
    const { title, description, start_time, end_time } = req.body;
    const [result] = await db.query(
      "INSERT INTO events (title, description, start_time, end_time) VALUES (?, ?, ?, ?)",
      [title, description, start_time, end_time]
    );
    res.json({ id: result.insertId, title, description, start_time, end_time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
