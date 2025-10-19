import express from 'express';
import sql from 'mssql';
import { db } from '../db.js'; // MSSQL connection pool
import { hashPassword } from '../hashPW.js'; // password hasher

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if email already exists
    const existingUserResult = await db.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM users WHERE email = @email');

    if (existingUserResult.recordset.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    await db.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('hashedPassword', sql.NVarChar, hashedPassword)
      .query(
        'INSERT INTO users (username, email, hashed_password) VALUES (@username, @email, @hashedPassword)'
      );

    res.status(201).json({ message: 'User registered successfully.' });

  } catch (error) {
    console.error('Signup error:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
