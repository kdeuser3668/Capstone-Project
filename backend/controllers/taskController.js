import { db } from "../db.js";
import { google } from "googleapis";

import dotenv from "dotenv";
dotenv.config();

//fetch task functions
export const getAllTasks = async (req, res) => {
  try {
    const db = await getDbPool();
    const result = await db.request()
      .query("SELECT * FROM tasks ORDER BY start_time ASC");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTasksByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const db = await getDbPool();

    const result = await db.request()
      .input("date", date)
      .query(`
        SELECT * 
        FROM tasks 
        WHERE CONVERT(date, start_time) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching tasks by date:", err);
    res.status(500).json({ error: err.message });
  }
};


//NEEDS UPDATED TO EXACT SCHEMA IN DB !!!
export const addTask = async (req, res) => {
  try {
    const { title, description, due_date, priority, status, user_id } = req.body;
    const db = await getDbPool();

    const result = await db.request()
      .input("title", title)
      .input("description", description)
      .input("due_date", due_date)
      .input("priority", priority)
      .input("status", status)
      .input("user_id", user_id)
      .query(`
        INSERT INTO tasks (title, description, due_date, priority, status, user_id)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @due_date, @priority, @status, @user_id)
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbPool();

    await db.request()
      .input("id", id)
      .query("DELETE FROM tasks WHERE id = @id");

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.message });
  }
};

