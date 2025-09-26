const express = require("express");
const router = express.Router();
const { getPool } = require("../db");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Tasks");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a new task
router.post("/", async (req, res) => {
  const { title, due } = req.body;
  try {
    const pool = await getPool();
    await pool.request()
      .input("title", title)
      .input("due", due)
      .query("INSERT INTO Tasks (title, due) VALUES (@title, @due)");
    res.status(201).send("Task added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
