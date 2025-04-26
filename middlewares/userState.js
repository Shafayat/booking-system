const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Checks if the user is authenticated.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function to call
 * @returns {void}
 */
const setUserState = (req, res, next) => {
    const token = req.cookies?.token;

    res.locals.isAuthenticated = false;

    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(`[DEBUG] JWT Verification Error: ${err.message}`);
            return next();
        }

        req.user = decoded;
        res.locals.isAuthenticated = true;
        res.locals.user = decoded;
        next();
    });
};
module.exports = setUserState;