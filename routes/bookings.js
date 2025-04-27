import { Router } from 'express';
import Booking from '../models/booking.js';
import Service from '../models/service.js';
import Hospital from '../models/hospital.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Book a service (API)
 * POST /booking/book
 */
router.post('/book', authMiddleware, async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { serviceId, bookingDate } = req.body;
    const booking = await Booking.create({
        UserId: req.userId,
        ServiceId: serviceId,
        bookingDate: bookingDate,
        status: 'booked'
    });
    res.status(201).json({ success: true, booking });
});

/**
 * List current user's bookings (API)
 * GET /booking/mine
 */
router.get('/mine', authMiddleware, async (req, res) => {
    const bookings = await Booking.findAll({
        where: {
            UserId: req.userId
        },
        include: [
            {
                model: Service,
                include: [Hospital]
            }
        ]
    });
    res.status(200).json({ success: true, bookings });
});

/**
 * Cancel a booking (API)
 * POST /booking/:id/remove
 */
router.post('/:id/remove', authMiddleware, async (req, res) => {
    const booking = await Booking.findOne({
        where: {
            id: req.params.id,
            UserId: req.userId
        }
    });
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found.' });
    }
    await booking.destroy();
    res.json({ success: true });
});

export default router;