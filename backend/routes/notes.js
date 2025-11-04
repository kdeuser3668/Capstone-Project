import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Get notes for a user
router.get('/', async (req, res) => {
  try {
    const { userId, courseId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'Missing userId.' });
    }

    let query = 'SELECT * FROM notes WHERE user_id = $1';
    const params = [userId];

    if (courseId) {
      query += ' AND course_id = $2';
      params.push(courseId);
    }

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Notes GET error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, noteTitle, noteContent } = req.body;

    if (!userId || !noteTitle || !noteContent) {
      return res.status(400).json({ message: 'Missing title or content for note.' });
    }

    await pool.query(
      'INSERT INTO notes (user_id, course_id, note_title, note_content) VALUES ($1, $2, $3, $4)',
      [userId, courseId || null, noteTitle, noteContent] // courseId defaults to null if not provided
    );

    res.status(201).json({ message: 'Note saved successfully.' });

  } catch (error) {
    console.error('Notes error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete a note by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Missing note ID.' });
    }

    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    console.error('Notes DELETE error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
