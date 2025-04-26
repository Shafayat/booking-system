const db = require('../db');

/**
 * Fetch all services
 * @param {function} callback - The callback function with (err, services) signature
 * @returns {void}
 */
exports.getAllServices = (callback) => {
    const query = `
        SELECT services.id AS service_id, 
               services.name AS service_name, 
               hospitals.name AS hospital_name 
        FROM services
        INNER JOIN hospitals 
        ON services.hospital_id = hospitals.id
    `;
    db.all(query, [], (err, services) => {
        if (err) callback(err, null);
        else callback(null, services);
    });
};