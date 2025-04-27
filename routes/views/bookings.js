import { Router } from 'express';
import axios from 'axios';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

/**
 * List current user's bookings (HTML)
 * GET /bookings/mine
 */
router.get('/list', authMiddleware, async (req, res) => {
    if (!req.userId) {
        return res.redirect('/login');
    }
    try {
        const token = req.cookies.token;
        const response = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:3000'}/api/booking/mine`, {
            headers: { Cookie: `token=${token}` }
        });
        res.render('my_bookings', { title: 'My Booked Services', bookings: response.data.bookings });
    } catch (err) {
        res.status(500).render('error', { title: 'Error', message: 'Unable to load bookings.' });
    }
});

export default router;
