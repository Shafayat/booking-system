const sqlite3 = require('sqlite3').verbose();

// Create or connect to SQLite database
const db = new sqlite3.Database('./hospital_booking.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTables(); // Ensure tables exist
        seedDatabase(); // Seed dummy data
    }
});

// Initialize Tables
const createTables = () => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 email TEXT UNIQUE NOT NULL,
                                                 password TEXT NOT NULL
            )`);

    db.run(`CREATE TABLE IF NOT EXISTS hospitals (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     name TEXT NOT NULL,
                                                     address TEXT NOT NULL
            )`);

    db.run(`CREATE TABLE IF NOT EXISTS services (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    hospital_id INTEGER NOT NULL,
                                                    name TEXT NOT NULL,
                                                    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    user_id INTEGER NOT NULL,
                                                    service_id INTEGER NOT NULL,
                                                    appointment_date TEXT NOT NULL,
                                                    FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
        )`);
};

// Seed Dummy Data
const seedDatabase = () => {
    // Check if the database is already seeded
    db.get('SELECT COUNT(*) as count FROM hospitals', (err, row) => {
        if (err) {
            console.error('Error checking hospital table:', err.message);
            return;
        }

        // Seed Data if Hospitals table is empty
        if (row.count === 0) {
            console.log('Seeding database with dummy data...');

            // Insert dummy hospitals
            const hospitals = [
                { name: 'City Hospital', address: '123 Health St, Cityville' },
                { name: 'Green Valley Hospital', address: '45 Care Rd, Greendale' },
                { name: 'Downtown Medical Center', address: '878 Main Ave, Downtown' }
            ];

            const services = [
                { hospital_id: 1, name: 'MRI Scan' },
                { hospital_id: 1, name: 'X-Ray' },
                { hospital_id: 1, name: 'Blood Test' },
                { hospital_id: 2, name: 'Therapy' },
                { hospital_id: 2, name: 'Consultation' },
                { hospital_id: 2, name: 'Surgery' },
                { hospital_id: 3, name: 'General Consultation' },
                { hospital_id: 3, name: 'Specialist Visit' }
            ];

            // Insert Hospitals
            hospitals.forEach((hospital) => {
                db.run('INSERT INTO hospitals (name, address) VALUES (?, ?)', [hospital.name, hospital.address]);
            });

            // Insert Services
            services.forEach((service) => {
                db.run('INSERT INTO services (hospital_id, name) VALUES (?, ?)', [service.hospital_id, service.name]);
            });

            console.log('Database seeding complete.');
        } else {
            console.log('Database already seeded, skipping.');
        }
    });
};

module.exports = db;