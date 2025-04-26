const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // JWT for token handling
const bcrypt = require('bcrypt'); // Bcrypt for hashing passwords
const db = require('../db');
const authController = require('../controllers/authController');
const {body, validationResult} = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /register
 * Handles user registration by validating email and password.
 * If validation passes, it uses the authController to register the user.
 * On success, redirects to the login page. On failure, returns error messages.
 */
router.post('/register',
    [
        body('email').isEmail().withMessage('Invalid email format.'),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters.'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;
        authController.registerUser(email, password, (err) => {
            if (err) return res.status(400).json({error: 'Email already in use.'});
            res.redirect('/auth/login');
        });
    }
);

/**
 * POST /login
 * Handles user login by validating email and password.
 * If validation passes, it compares the hashed password from the database
 * with the provided password using bcrypt. If the comparison passes, it
 * generates a JWT token for the user and redirects to the homepage.
 * On failure, returns error messages.
 */

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {

        if (err || !user) return res.status(400).json({error: 'Invalid email or password.'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: 'Invalid email or password.'});

        const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'Strict',
        });

        res.redirect('/services');
    });
})

/**
 * POST /logout
 * Handles user logout by clearing the JWT token cookie and redirecting to the login page.
 */
router.post('/logout', (req, res) => {
    console.log('Cookies before logout:', req.cookies);
    res.clearCookie('token', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('/auth/login');
});

module.exports = router;