/**
 * Handles errors for Express.js
 * @param {Error} err - The error to handle
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function to call
 * @returns {void}
 */
function errorHandler(err, req, res, next) {
    console.error(`[ERROR]: ${err.message}`);
    res.status(err.status || 500).json({
        error: 'An error occurred.',
        message: err.message || 'Internal Server Error',
    });
}


module.exports = errorHandler;