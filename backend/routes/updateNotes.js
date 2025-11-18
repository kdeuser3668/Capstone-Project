import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

router.post('/:id', async (req, res) => {
  try {
    const noteId = req.params.id; 
    const { updatedTitle, updatedContent } = req.body;

    if (!noteId || !updatedTitle || !updatedContent ) {
      return res.status(400).json({ message: 'Missing fields.' });
    }

    const noteResult = await pool.query('SELECT * FROM notes WHERE id = $1', [noteId]);
    if (noteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    await pool.query('UPDATE notes SET note_title = $1, note_content = $2, edited = NOW() WHERE id = $3', [updatedTitle, updatedContent, noteId]);

    res.status(200).json({ message: 'Note updated successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;