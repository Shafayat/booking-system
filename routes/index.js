import { Router } from 'express';
import authRoutes from './auth.js';
import user from './user.js';

// You can mount routes with a prefix if preferred, e.g. /auth, /profile
const router = Router();

router.use('/', authRoutes);
router.use('/', user);

export default router;