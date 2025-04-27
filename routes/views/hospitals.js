import { Router } from 'express';
import Hospital from '../../models/hospital.js';
import Service from '../../models/service.js';
import { authMiddleware } from '../../middleware/auth.js';
import axios from "axios";

const router = Router();


function apiUrl(req, path) {
    return `${req.protocol}://${req.get('host')}/api/hospitals${path}`;
}


/**
 * List all hospitals (View)
 * GET /hospitals/list
 */
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const response = await axios.get(apiUrl(req, '/list'), {
            headers: { Cookie: req.headers.cookie || "" }
        });

        // Fix: Use the "hospitals" property from API response
        const hospitals = response.data.hospitals || [];
        res.render('hospitals', { title: 'Hospitals', hospitals });
    } catch (e) {
        res.status(500).render('error', { title: 'Server Error' });
    }
});


/**
 * List services for a hospital (View)
 * GET /hospital/:id/services
 */
router.get('/:id/services', authMiddleware, async (req, res) => {
    try {
        // Call your API to get the hospital's services.
        const response = await axios.get(apiUrl(req, `/${req.params.id}/services`), {
            headers: { Cookie: req.headers.cookie || "" }
        });

        // Extract data, ensure arrays/defaults
        const hospital = response.data.hospital || { name: 'Unknown' };
        const services = response.data.services || [];

        res.render('services', {
            title: `Services at ${hospital.name}`,
            hospital,
            services
        });
    } catch (err) {
        // Show error page with safe defaults, NEVER pass undefined services!
        res.status(500).render('services', {
            title: 'Error',
            hospital: { name: 'Unknown' },
            services: []
        });
    }
});


export default router;