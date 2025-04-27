import express from 'express';
import {findUserById} from '../services/userService.js';
import {authMiddleware} from '../middleware/auth.js';

const router = express.Router();

/**
 * Profile route
 *
 * GET /me
 *
 * This route is protected by the authMiddleware.
 */
router.get('/me', authMiddleware, async (req, res) => {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({error: 'User not found.'});
    res.render('me', {title: 'Profile', user});
});

export default router;