const db = require('../db');

/**
 * Fetch all hospitals
 * @param {function} callback - The callback function with (err, hospitals) signature
 */
exports.getAllHospitals = (callback) => {
    const query = 'SELECT * FROM hospitals';
    db.all(query, [], (err, hospitals) => {
        if (err) callback(err, null);
        else callback(null, hospitals);
    });
};


/**
 * Fetch a hospital by its ID
 * @param {number} hospitalId - The ID of the hospital to fetch
 * @param {function} callback - The callback function with (err, hospital) signature
 * @returns {void}
 */
exports.getHospitalById = (hospitalId, callback) => {
    const query = 'SELECT * FROM hospitals WHERE id = ?';
    db.get(query, [hospitalId], (err, hospital) => {
        if (err) callback(err, null);
        else callback(null, hospital);
    });
};

/**
 * Fetch hospital details by hospital ID
 * @param {number} hospitalId - The ID of the hospital to fetch
 * @param {function} callback - The callback function with (err, hospital) signature
 */
exports.getServicesByHospitalId = (hospitalId, callback) => {
    const query = 'SELECT * FROM services WHERE hospital_id = ?';
    db.all(query, [hospitalId], (err, services) => {
        if (err) callback(err, null);
        else callback(null, services);
    });
};