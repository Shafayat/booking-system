const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const bookingsController = require('../controllers/bookingsController');
const hospitalsController = require('../controllers/hospitalsController');

function authenticate(req, res, next) {
    if (!req.user) return res.redirect('/auth/login'); // Redirect if not authenticated
    next();
}


/**
 * Handles login page request.
 * Redirects to /services if user is authenticated.
 */
router.get('/', (req, res) => {
    res.render('login');
});


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

/**
 * Handles GET requests for the /pages endpoint.
 * This endpoint renders various pages (e.g., services, bookings, hospitals)
 * based on the route and user authentication state.
 * The pages are rendered with data fetched from the controllers.
 * If errors occur, they are logged and a 500 error is sent to the client.
 */
router.get('/hospitals', authenticate, (req, res) => {
    hospitalsController.getAllHospitals((err, hospitals) => {
        if (err) {
            console.error('Error fetching hospitals:', err.message);
            return res.status(500).send('Error fetching hospitals.');
        }

        res.render('hospitals', {
            hospitals: hospitals || [], // Pass hospital data to the template
            csrfToken: req.csrfToken(),
            user: res.locals.user,
        });
    });
});


/**
 * Handles the request to list all services for a specific hospital.
 * Uses hospitalId from the route parameter to fetch services.
 */
router.get('/hospitals/:hospitalId/services', authenticate, (req, res) => {
    const hospitalId = req.params.hospitalId;

    hospitalsController.getServicesByHospitalId(hospitalId, (err, services) => {
        if (err) {
            console.error(`Error fetching services for hospital ${hospitalId}:`, err.message);
            return res.status(500).send('Error fetching services for this hospital.');
        }

        res.render('hospitalServices', {
            services: services || [], // Pass the services data to the template
            csrfToken: req.csrfToken(),
            user: res.locals.user,
        });
    });
});

module.exports = router;
