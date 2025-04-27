import express from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Auth Middleware
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token.' });
    try {
        const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token.' });
    }
}

// Example protected route
router.get('/me', authMiddleware, async (req, res) => {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.render('me', { title: 'Profile', user });
});

export default router;