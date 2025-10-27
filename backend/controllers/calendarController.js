import { db } from "../db.js";
import sql from "mssql";
import { google } from "googleapis";

import dotenv from "dotenv";
dotenv.config();

//fetch event functions
export const getAllEvents = async (req, res) => {
  try {
    const result = await db.request().query("SELECT * FROM events ORDER BY start_time ASC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params; // expecting YYYY-MM-DD
    const result = await db
      .request()
      .input("date", sql.Date, date)
      .query("SELECT * FROM events WHERE CONVERT(date, start_time) = @date ORDER BY start_time ASC");

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEvent = async (req, res) => {
  try {
    const { title, description, start_time, end_time } = req.body;

    const insertQuery = `
      INSERT INTO events (title, description, start_time, end_time)
      OUTPUT INSERTED.id
      VALUES (@title, @description, @start_time, @end_time)
    `;

    const result = await db
      .request()
      .input("title", sql.VarChar(255), title)
      .input("description", sql.VarChar(sql.MAX), description)
      .input("start_time", sql.DateTime, new Date(start_time))
      .input("end_time", sql.DateTime, new Date(end_time))
      .query(insertQuery);

    const insertedId = result.recordset[0]?.id;

    res.json({ id: insertedId, title, description, start_time, end_time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("DELETE FROM events WHERE id = @id");

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// google calendar integration functions

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthURL = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  res.json({ url });
};

export const getGoogleEvents = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime"
    });
    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};