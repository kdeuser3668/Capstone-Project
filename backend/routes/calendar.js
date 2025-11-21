import express from "express";
import { pool } from "../db.js";
import { google } from "googleapis";

const router = express.Router();

// -------------------- Google Calendar routes & functions--------------------

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// Generate Google OAuth URL
router.get("/google/auth", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: userId
  });
  res.json({ url });
});

// Handle Google OAuth callback & store tokens
router.get("/google/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send("No code provided");
  if (!state) return res.status(400).send("No userId provided");

  const userId = state;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user's Google email
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;

    // Convert expiry
    const expiry = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    // Store tokens
    await pool.query(
      `INSERT INTO user_google_tokens (user_id, google_email, access_token, refresh_token, expiry)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, google_email)
       DO UPDATE SET access_token = $3, refresh_token = $4, expiry = $5`,
      [userId, googleEmail, tokens.access_token, tokens.refresh_token, expiry]
    );

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch Google events using stored access token
router.get("/google/events", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const result = await pool.query(
      `SELECT access_token FROM user_google_tokens WHERE user_id = $1`,
      [userId]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "No Google tokens found" });

    oauth2Client.setCredentials({ access_token: result.rows[0].access_token });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventsResponse = await calendar.events.list({
      calendarId: "primary",
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(eventsResponse.data.items);
  } catch (err) {
    console.error("Error fetching Google events:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Disconnect Google Calendar
router.post("/google/disconnect", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    await pool.query(
      `DELETE FROM user_google_tokens WHERE user_id = $1`,
      [userId]
    );
    res.json({ message: "Google account disconnected successfully" });
  } catch (err) {
    console.error("Disconnect error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// -------------------- Local DB routes --------------------

// GET all events
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET events for a specific date (YYYY-MM-DD)
router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const result = await pool.query(
      "SELECT * FROM events WHERE date = $1 ORDER BY id ASC",
      [date]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events by date:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST new event
router.post("/", async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await pool.query(
      "INSERT INTO events (title, description, date, time) VALUES ($1, $2, $3, $4)",
      [title, description || null, date, time || null]
    );

    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE event by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully", event: result.rows[0] });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;