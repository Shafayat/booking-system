const db = require('../db');

/**
 * Seeds the database with dummy data.
 * This will delete all existing data in the database before seeding.
 */
const seedDatabase = () => {
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

    db.serialize(() => {
        console.log('Re-seeding database...');
        db.run('DELETE FROM services');
        db.run('DELETE FROM hospitals');

        hospitals.forEach((hospital) => {
            db.run('INSERT INTO hospitals (name, address) VALUES (?, ?)', [hospital.name, hospital.address]);
        });

        services.forEach((service) => {
            db.run('INSERT INTO services (hospital_id, name) VALUES (?, ?)', [service.hospital_id, service.name]);
        });

        console.log('Database re-seeding complete.');
        db.close();
    });
};

seedDatabase();