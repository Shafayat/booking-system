import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import hospitalRoutes from './hospitals.js';
import bookingRoutes from './bookings.js';

const router = Router();

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/booking', bookingRoutes);

export default router;