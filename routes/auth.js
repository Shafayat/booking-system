import express from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
const router = express.Router();

function isStrongPassword(password) {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });
}

/**
 * Handle user registration
 *
 * POST /register
 *
 * @param {string} username - Username
 * @param {string} password - Password
 *
 * @returns {Promise<void>}
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'All fields are required' });

    if (!validator.isEmail(username))
        return res.status(400).json({ error: 'Invalid email address' });

    if (!isStrongPassword(password))
        return res.status(400).json({ error: 'Password is not strong enough' });

    const exist = await User.findOne({ where: { username } });
    if (exist)
        return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    res.status(201).json({ success: true });
});

/**
 * Handle user login
 *
 * POST /login
 *
 * @param {string} username - Username
 * @param {string} password - Password
 *
 * @returns {Promise<void>}
 */router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user)
        return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
        return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.json({ success: true, token });
});

export default router;