import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Get tasks for a user
router.get('/', async (req, res) => {
  try {
    const { userId, courseId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId.' });
    }

    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];

    if (courseId) {
      query += ' AND course_id = $2';
      params.push(courseId);
    }

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Tasks GET error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, assignmentName, dueDatetime, priority } = req.body;

    if (!userId || !assignmentName || !dueDatetime ) {
      return res.status(400).json({ message: 'Missing fields.' });
    }

    await pool.query(
      `INSERT INTO tasks
      (user_id, course_id, assignment_name, due_datetime, priority, completion)
      VALUES ($1, $2, $3, $4, $5, false)`,
      [userId, courseId || null, assignmentName, dueDatetime, priority] // courseId defaults to null if not provided
    );

    res.status(201).json({ message: 'Task saved successfully.' });

  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignmentName, dueDatetime, priority, completion } = req.body;

    if (!assignmentName && !dueDatetime && !priority && completion === undefined) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    await pool.query(
      `UPDATE tasks
       SET assignment_name = $1,
           due_datetime = $2,
           priority = $3,
           completion = $4
       WHERE id = $5`,
      [assignmentName, dueDatetime, priority, completion, id]
    );

    res.status(200).json({ message: 'Task updated successfully.' });

  } catch (error) {
    console.error('Tasks UPDATE error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM tasks
       WHERE id = $1`,
      [id]
    );

    res.status(200).json({ message: 'Task deleted successfully.' });

  } catch (error) {
    console.error('Tasks DELETE error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;