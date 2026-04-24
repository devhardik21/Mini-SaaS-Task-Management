import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
    getMe,
    updateMe,
    getAllUsers,
    updateUserRole,
    syncUser,
} from '../controllers/userController.js';

const router = Router();

router.use(requireAuth);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.post('/sync', syncUser);                          // called from frontend after Clerk login
router.get('/', requireAdmin, getAllUsers);               // admin only
router.patch('/:id/role', requireAdmin, updateUserRole); // admin only

export default router;
