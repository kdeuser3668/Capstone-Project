import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password.' });
    }

    const result = await db
      .request()
      .input('email', email)
      .query('SELECT * FROM dbo.users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = result.recordset[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
