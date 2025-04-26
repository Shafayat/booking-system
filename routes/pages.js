const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const bookingsController = require('../controllers/bookingsController');

function authenticate(req, res, next) {
    if (!req.user) return res.redirect('/auth/login'); // Redirect if not authenticated
    next();
}


/**
 * Handles login page request.
 * Redirects to /services if user is authenticated.
 */
router.get('/auth/login', (req, res) => {
    res.render('login');
});


/**
 * Handles registration page request.
 * Redirects to /services if user is authenticated.
 */
router.get('/auth/register', (req, res) => {
    res.render('register');
});


/**
 * Handles the home page request.
 * Redirects to /services if user is authenticated.
 */
router.get('/services', authenticate, (req, res) => {
    servicesController.getAllServices((err, services) => {
        if (err) {
            console.error('Error fetching services:', err.message);
            return res.status(500).send('Error fetching services.');
        }

        res.render('services', {
            services: services || [],
            csrfToken: req.csrfToken(),
        });
    });
});

/**
 * Handles the booking page request.
 * Fetches all services and bookings for the user.
 * Renders the bookings page with the services and bookings.
 */
router.get('/bookings', authenticate, async (req, res) => {
    servicesController.getAllServices((err, services) => {
        if (err) {
            console.error('Error fetching services:', err.message);
            return res.status(500).send('Error fetching services.');
        }

        bookingsController.getBookingsByUserId(req.user.id, (err, bookings) => {
            if (err) {
                console.error('Error fetching bookings:', err.message);
                return res.status(500).send('Error fetching bookings.');
            }

            res.render('bookings', {
                services: services || [],
                bookings: bookings || [],
                bookings2: JSON.stringify(bookings) || '[]',
                user: res.locals.user,
            });
        });
    });
});

module.exports = router;
