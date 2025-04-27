import { Router } from 'express';
import authRoutes from './auth.js';
import user from './user.js';

const router = Router();

router.use('/', authRoutes);
router.use('/', user);

export default router;