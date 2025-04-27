import { Router } from 'express';
import Booking from '../models/booking.js';
import Service from '../models/service.js';
import Hospital from '../models/hospital.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);


/**
 * Book a service
 *
 * POST /booking/book
 *
 * @param {string} serviceId - Service ID
 *
 * @returns {Promise<void>}
 */
router.post('/book', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const { serviceId } = req.body;
    await Booking.create({
        UserId: req.user.id,
        ServiceId: serviceId,
        status: 'booked'
    });
    res.redirect('/booking/mine');
});


/**
 * List all bookings for the current user
 *
 * GET /bookings/mine
 *
 * @returns {Promise<void>}
 */
router.get('/mine', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const bookings = await Booking.findAll({
        where: { UserId: req.user.id },
        include: [
            { model: Service, include: [Hospital] }
        ],
        order: [['bookingDate', 'DESC']]
    });
    res.render('my_bookings', { title: 'My Booked Services', bookings });
});



/**
 * DELETE: Cancel a booking
 *
 * This route requires the user to be logged in and the booking
 * to belong to the current user.
 *
 * @param {number} id - The booking ID
 */
router.post('/:id/remove', async (req, res) => {
    const booking = await Booking.findOne({
        where: {
            id: req.params.id,
            UserId: req.user.id
        }
    });
    if (!booking) {
        return res.status(404).render('error', { title: 'Not found', message: 'Booking not found.' });
    }
    await booking.destroy();
    res.redirect('/booking/mine');
});


export default router;