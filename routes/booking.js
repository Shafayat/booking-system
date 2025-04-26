const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { body } = require('express-validator');

const authenticateToken = require('../middlewares/authenticate');


/**
 * Route to create a new booking.
 * Validates service ID and appointment date from the request body.
 * Requires authentication via token.
 *
 * Endpoint: POST /book
 * Middleware: authenticateToken
 * Validations:
 *  - service_id: must be a valid integer
 *  - appointment_date: must be a valid date
 *
 * Request Body:
 *  - service_id: integer, required
 *  - appointment_date: date string in SQL format, required
 *
 * Response:
 *  - Success: Redirects to the booking page
 *  - Error: Returns 400 status with error message
 */
router.post('/book', authenticateToken, [
    body('service_id').isInt().withMessage('Service ID must be a valid integer.'),
    body('appointment_date').isDate().withMessage('Valid date is required.'),
],(req, res) => {
    const { service_id, appointment_date } = req.body;
    if (!service_id || !appointment_date) {
        return res.status(400).json({ error: 'Service ID and appointment date are required.' });
    }

    // Call the controller to create the booking
    bookingsController.createBooking(req.user.id, service_id, appointment_date, (err) => {
        if (err) {
            console.error('Error creating booking:', err.message);
            return res.status(500).json({ error: 'Error creating booking.' });
        }
        res.redirect('/bookings');
    });
});

/**
 * Route to cancel a booking.
 * Validates booking ID from the request body.
 * Requires authentication via token.
 *
 * Endpoint: POST /cancel
 * Middleware: authenticateToken
 * Validations:
 *  - booking_id: must be a valid integer
 *
 * Request Body:
 *  - booking_id: integer, required
 *
 * Response:
 *  - Success: Redirects to the bookings page
 *  - Error: Returns 400 status with error message
 */
router.post('/cancel', authenticateToken, (req, res) => {
    const { booking_id } = req.body;
    const userId = req.user.id;

    if (!booking_id) {
        return res.status(400).json({ success: false, error: 'Booking ID is required' });
    }

    // Call the controller for cancellation
    bookingsController.cancelBookingById(booking_id, userId, (result) => {
        if (!result.success) {
            // Handle failure
            return res.status(400).json(result);
        }

        // Handle success
        res.redirect('/bookings');
    });
});


module.exports = router;