import express from 'express';
import { pool } from '../db.js';
import { hashPassword, comparePassword } from '../hashPW.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, currentEmail, newEmail, password } = req.body;

    if (!userId || !currentEmail || !newEmail || !password ) {
      return res.status(400).json({ message: 'Missing fields.' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = userResult.rows[0];

    if (user.email !== currentEmail) {
      return res.status(400).json({ message: 'Current email is incorrect.' });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Password is incorrect.' });
    }

    await pool.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, userId]);

    res.status(200).json({ message: 'Password updated successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;