import { Router } from 'express';
import Hospital from '../models/hospital.js';
import Service from '../models/service.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);


/**
 * List all hospitals
 *
 * GET /hospitals
 *
 * @returns {Promise<void>}
 */
router.get('/list', async (req, res) => {
    const hospitals = await Hospital.findAll();
    res.render('hospitals', { title: 'Hospitals', hospitals });
});


/**
 * List all services for a hospital
 *
 * GET /hospitals/:id/services
 *
 * @param {string} id - Hospital ID
 *
 * @returns {Promise<void>}
 */
router.get('/:id/services', async (req, res) => {
    const hospital = await Hospital.findByPk(req.params.id, {
        include: [Service]
    });
    if (!hospital) {
        return res.status(404).render('404', { title: 'Not Found' });
    }
    res.render('services', { title: `${hospital.name} Services`, hospital, services: hospital.Services });
});

export default router;