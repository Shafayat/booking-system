import { Router } from 'express';
import Hospital from '../models/hospital.js';
import Service from '../models/service.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * List all hospitals (API)
 * GET /api/hospitals/list
 */
router.get('/list', authMiddleware, async (req, res) => {
    const hospitals = await Hospital.findAll();
    res.json({ hospitals });
});

/**
 * List services for a hospital (API)
 * GET /api/hospitals/:id/services
 */
router.get('/:id/services', authMiddleware, async (req, res) => {
    const hospital = await Hospital.findByPk(req.params.id, { include: [Service] });
    if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json({ hospital, services: hospital.Services });
});

export default router;