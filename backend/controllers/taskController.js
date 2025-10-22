import { db } from "../db.js";
import { google } from "googleapis";

import dotenv from "dotenv";
dotenv.config();

//fetch task functions
export const getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks ORDER BY start_time ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasksByDate = async (req, res) => {
  try {
    const { date } = req.params; // expecting YYYY-MM-DD
    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE DATE(start_time) = ?",
      [date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//NEEDS UPDATED TO EXACT SCHEMA IN DB !!!
export const addTask = async (req, res) => {
  try {
    const { title, description, due_date, priority, status, user_id } = req.body;

    // ✅ Adjust column names to match your actual "tasks" table schema
    const [result] = await db.query(
      `INSERT INTO tasks (title, description, due_date, priority, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, due_date, priority, status, user_id]
    );

    res.json({
      id: result.insertId,
      title,
      description,
      due_date,
      priority,
      status,
      user_id,
    });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

