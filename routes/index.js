import { Router } from 'express';
import userRoutes from './user.js';
import viewAuth from './views/auth.js';
import apiAuth from './auth.js';
import bookingApiRoutes from './bookings.js';
import bookingViewRoutes from './views/bookings.js';
import hospitalViewRoutes from './views/hospitals.js';
import hospitalApiRoutes from './hospitals.js';


const router = Router();

router.use('/', userRoutes);

router.use('/', viewAuth);
router.use('/api/auth', apiAuth);
router.use('/booking', bookingViewRoutes);
router.use('/api/booking', bookingApiRoutes);
router.use('/hospital', hospitalViewRoutes);
router.use('/api/hospitals', hospitalApiRoutes);

export default router;