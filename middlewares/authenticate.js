const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifies a JWT token with the secret.
 * @param {string} token - JWT token to verify.
 * @returns {Promise<Object>} Decoded user object or rejection with error.
 */
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || '';
    if (!token) return res.status(401).json({ error: 'Unauthorized.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden.' });
        req.user = user; // Attach the user to the request object
        next();
    });
};

module.exports = authenticateToken;