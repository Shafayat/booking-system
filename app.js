require('dotenv').config(); // Load environment variables from a .env file
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf'); // Middleware for CSRF protection
const setUserState = require('./middlewares/userState'); // Middleware to set user state (for JWT handling)
const errorHandler = require('./middlewares/errorHandler'); // Custom error handling middleware
const rateLimit = require('express-rate-limit');

const app = express();

const authRouter = require('./routes/auth'); // Router for authentication-related routes
const bookingRouter = require('./routes/booking'); // Router for booking-related routes
const pageRoutes = require('./routes/pages'); // Router for general page routes

// Set the directory for view templates and specify the template engine (Pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware for logging HTTP requests
app.use(logger('dev'));

// Middleware to parse incoming requests with JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to serve static files (e.g., CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure rate limiting to prevent abuse (e.g., DoS attacks)
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // Timeframe for request restriction (default: 15 minutes)
    max: process.env.RATE_LIMIT_MAX || 100, // Max requests per IP during the timeframe (default: 100)
});
app.use(limiter);

// Middleware to set user state (e.g., authenticate and attach user data to requests)
app.use(setUserState);

// Middleware for CSRF protection with token stored in cookies
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Middleware to attach the CSRF token to response locals for use in templates/forms
app.use((req, res, next) => {
    try {
        res.locals.csrfToken = req.csrfToken(); // Get and set CSRF token
        next();
    } catch (err) {
        return res.status(403).send('CSRF token generation failed'); // Handle CSRF token generation error
    }
});

// Mount routers for different application modules
app.use('/auth', authRouter); // Routes for user authentication
app.use('/booking', bookingRouter); // Routes for booking management
app.use('/', pageRoutes); // General page routes (e.g., homepage)

// Middleware for handling application errors
app.use(errorHandler);

module.exports = app; // Export the Express app instance