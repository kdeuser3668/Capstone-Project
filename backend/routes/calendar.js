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


const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/userinfo.email"];

// Generate Google OAuth URL
router.get("/google/auth", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",  // forces Google to return refresh_token every time
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
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user's Google email
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;

    // Convert expiry
    const expiry = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    // Store tokens in DB (insert or update)
    await pool.query(
      `INSERT INTO user_google_tokens (user_id, google_email, access_token, refresh_token, expiry)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, google_email)
       DO UPDATE SET
         access_token = EXCLUDED.access_token,
         refresh_token = COALESCE(EXCLUDED.refresh_token, user_google_tokens.refresh_token),
         expiry = EXCLUDED.expiry`,
      [userId, googleEmail, tokens.access_token, tokens.refresh_token, expiry]
    );

    console.log("Tokens stored successfully for user:", userId);

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/calendar`);
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

    oauth2Client.setCredentials({
      access_token: result.rows[0].access_token,
      refresh_token: result.rows[0].refresh_token
    });

    await oauth2Client.getAccessToken();

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

// GET all calendar events for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId)
      return res.status(400).json({ message: "Missing userId" });

    const result = await pool.query(
      `SELECT * FROM calendar_events 
       WHERE user_id = $1 
       ORDER BY id ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching calendar events:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CREATE a calendar event (recurring OR nonrecurring)
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      course_id,
      event_name,
      recurring,
      weekday,
      start_time,
      end_time,
      start_date,
      end_date,
      location,
      event_type,
      notes,
      nonrecurring_start,
      nonrecurring_end
    } = req.body;

    const result = await pool.query(
      `INSERT INTO calendar_events (
        user_id, course_id, event_name, recurring, weekday,
        start_time, end_time, start_date, end_date,
        location, event_type, notes, nonrecurring_start, nonrecurring_end
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        user_id || null,
        course_id || null,
        event_name,
        recurring,
        weekday || null,
        start_time || null,
        end_time || null,
        start_date || null,
        end_date || null,
        location || null,
        event_type,
        notes || null,
        nonrecurring_start || null,
        nonrecurring_end || null
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating calendar event:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE an event by ID (works for both recurring + nonrecurring)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM calendar_events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event deleted successfully",
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error("Error deleting calendar event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//PUT & UPDATE event by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      course_id,
      event_name,
      recurring,
      weekday,
      start_time,
      end_time,
      start_date,
      end_date,
      location,
      event_type,
      notes,
      nonrecurring_start,
      nonrecurring_end
    } = req.body;

    const result = await pool.query(
      `UPDATE calendar_events
       SET course_id = $1,
           event_name = $2,
           recurring = $3,
           weekday = $4,
           start_time = $5,
           end_time = $6,
           start_date = $7,
           end_date = $8,
           location = $9,
           event_type = $10,
           notes = $11,
           nonrecurring_start = $12,
           nonrecurring_end = $13
       WHERE id = $14
       RETURNING *`,
      [
        course_id || null,
        event_name,
        recurring,
        weekday || null,
        start_time || null,
        end_time || null,
        start_date || null,
        end_date || null,
        location || null,
        event_type,
        notes || null,
        nonrecurring_start || null,
        nonrecurring_end || null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
