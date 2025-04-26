const bcrypt = require('bcrypt');
const db = require('../db');

/**
 * Generates a JWT token for the given user ID.
 * @param {number} userId
 */
exports.registerUser = async (email, password, callback) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], callback);
    } catch (error) {
        throw new Error('Server error while registering user.');
    }
};