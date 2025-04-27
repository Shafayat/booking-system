import express from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { findUserByUsername, createUser } from '../services/userService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Render register form
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handle register logic
// After registration, redirect to login with a "registered" flag
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


// Render login form
router.get('/login', (req, res) => {
    const registered = req.query.registered;
    res.render('login', { title: 'Login', registered });
});


// Handle login logic
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user)
        return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
        return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials' });
    // For demo, just render profile page (token/jwt would be for API)
    res.render('me', { title: 'Profile', user });
});

export default router;