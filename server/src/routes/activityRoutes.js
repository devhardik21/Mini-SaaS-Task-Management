import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getActivityLog } from '../controllers/activityController.js';

const router = Router();

router.use(requireAuth);
router.get('/', getActivityLog);

export default router;
