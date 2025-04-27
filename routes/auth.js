import express from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { findUserByUsername, createUser } from '../services/userService.js';
import jwt from "jsonwebtoken";
const router = express.Router();

/**
 * Handle user registration
 *
 * GET /register
 *
 * @param {string} username - Username
 * @param {string} password - Password
 *
 * @returns {Promise<void>}
 */
router.get('/register', (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (token) return res.redirect('/me');
    res.render('register', { title: 'Register', error: null, username: '' });
});

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
        return res.status(400).render('register', {
            title: 'Register',
            error: 'All fields are required',
            username
        });

    if (!validator.isEmail(username))
        return res.status(400).render('register', {
            title: 'Register',
            error: 'Please enter a valid email address',
            username
        });

    if (!isStrongPassword(password))
        return res.status(400).render('register', {
            title: 'Register',
            error: 'Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.',
            username
        });

    const exist = await findUserByUsername(username);
    if (exist)
        return res.status(400).render('register', {
            title: 'Register',
            error: 'This email is already registered',
            username
        });

    const passwordHash = await bcrypt.hash(password, 10);
    await createUser(username, passwordHash);
    res.redirect('/login?registered=1');
});


/**
 * Show login form
 *
 * GET /login
 *
 * If user is already logged in, redirect to /me
 *
 * @returns {Promise<void>}
 */
router.get('/login', (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (token) return res.redirect('/me');
    const registered = req.query.registered;
    res.render('login', { title: 'Login', registered });
});



/**
 * Handle login logic
 *
 * POST /login
 *
 * @param {string} username - Email address
 * @param {string} password - Password
 *
 * @returns {Promise<void>}
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user)
        return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
        return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.redirect('/me');
});

/**
 * Clear the JWT token cookie and redirect to /login
 *
 * GET /logout
 *
 * @returns {Promise<void>}
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});


/**
 * Check if the given password is strong enough.
 *
 * @param {string} password - Password to check
 *
 * @returns {boolean} - Whether the password is strong enough
 */
function isStrongPassword(password) {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });
}


export default router;