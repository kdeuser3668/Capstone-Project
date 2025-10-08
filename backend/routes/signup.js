import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';  // mysql2 connection pool
import hashPassword from '../hashPW.js'; // password hasher

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if email already exists
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
