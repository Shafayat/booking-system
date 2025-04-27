import Hospital from '../models/hospital.js';
import Service from '../models/service.js';

const hospitalData = [
    { name: 'Central Hospital', address: '123 Main St' },
    { name: 'City Care Medical', address: '456 Elm St' },
    { name: 'Green Valley Hospital', address: '789 Oak Ave' },
];

const serviceData = [
    { name: 'General Checkup', description: 'Basic health examination', price: 50, hospitalIndex: 0 },
    { name: 'Blood Test', description: 'Comprehensive blood analysis', price: 30, hospitalIndex: 0 },
    { name: 'X-Ray', description: 'Chest and limb radiology', price: 120, hospitalIndex: 0 },

    { name: 'MRI Scan', description: 'Full body MRI scanning', price: 700, hospitalIndex: 1 },
    { name: 'Cardiology Consultation', description: 'Heart specialist consultation', price: 200, hospitalIndex: 1 },
    { name: 'Dermatology Appointment', description: 'Skin health and advice', price: 90, hospitalIndex: 1 },

    { name: 'Dental Cleaning', description: 'Professional teeth cleaning', price: 80, hospitalIndex: 2 },
    { name: 'Eye Examination', description: 'Vision and eye health assessment', price: 45, hospitalIndex: 2 },
    { name: 'Physical Therapy', description: 'Rehabilitation and physiotherapy', price: 110, hospitalIndex: 2 },
    { name: 'Vaccinations', description: 'Routine immunizations', price: 25, hospitalIndex: 2 }
];

async function seed() {
    const hospitalsCount = await Hospital.count();
    if (hospitalsCount === 0) {
        // Insert Hospitals
        const hospitals = await Hospital.bulkCreate(hospitalData);

        // Assign each service to the right hospital
        const servicesToInsert = serviceData.map(svc => ({
            name: svc.name,
            description: svc.description,
            price: svc.price,
            HospitalId: hospitals[svc.hospitalIndex].id
        }));

        await Service.bulkCreate(servicesToInsert);

        console.log('Database seeded with hospitals and services.');
    } else {
        console.log('Database already seeded, skipping.');
    }
}

export default seed;