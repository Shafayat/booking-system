const db = require('../db');

/**
 * Fetch bookings for a specific user
 * @param {number} userId - The user ID to fetch bookings for
 * @param {function} callback - The callback function with (err, bookings) signature
 */
exports.getBookingsByUserId = (userId, callback) => {
    const query = `
        SELECT bookings.id AS booking_id, 
               bookings.appointment_date, 
               services.name AS service_name, 
               hospitals.name AS hospital_name
        FROM bookings
        INNER JOIN services 
        ON bookings.service_id = services.id
        INNER JOIN hospitals 
        ON services.hospital_id = hospitals.id
        WHERE bookings.user_id = ?
    `;
    db.all(query, [userId], (err, bookings) => {
        if (err) callback(err, null);
        else callback(null, bookings);
    });
};

/**
 * Create a new booking for a specific user
 * @param {number} userId - The user ID to create booking for
 * @param {number} serviceId - The service ID to book
 * @param {string} appointmentDate - The appointment date in SQL format
 * @param {function} callback - The callback function with (err) signature
 */
exports.createBooking = (userId, serviceId, appointmentDate, callback) => {
    const query = `
        INSERT INTO bookings (user_id, service_id, appointment_date) 
        VALUES (?, ?, ?)
    `;
    db.run(query, [userId, serviceId, appointmentDate], (err) => {
        if (err) callback(err);
        else callback(null);
    });
};

/**
 * Cancels a booking by its ID for a specific user.
 * @param {number} bookingId - The ID of the booking to cancel.
 * @param {number} userId - The ID of the user who owns the booking.
 * @param {function} callback - The callback function with a result object.
 */
exports.cancelBookingById = (bookingId, userId, callback) => {
    // Step 1: Query to ensure the booking belongs to the user
    const validationQuery = `
        SELECT id, appointment_date, service_id
        FROM bookings
        WHERE id = ? AND user_id = ?
    `;

    db.get(validationQuery, [bookingId, userId], (validationErr, booking) => {
        if (validationErr) {
            return callback({ success: false, error: validationErr.message });
        }

        if (!booking) {
            return callback({
                success: false,
                error: 'Booking not found or unauthorized.',
            });
        }

        // Step 2: If validation passes, proceed with cancellation
        const deleteQuery = `
            DELETE FROM bookings 
            WHERE id = ?
        `;
        db.run(deleteQuery, [bookingId], (deleteErr) => {
            if (deleteErr) {
                return callback({ success: false, error: deleteErr.message });
            }

            return callback({
                success: true,
                message: 'Booking cancelled successfully',
                data: {
                    bookingId: booking.id,
                    appointmentDate: booking.appointment_date,
                    serviceId: booking.service_id,
                },
            });
        });
    });
};