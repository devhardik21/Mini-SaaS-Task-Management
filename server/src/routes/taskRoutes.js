import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getStats,
    getChartData,
    validateCreateTask,
    validateUpdateTask,
} from '../controllers/taskController.js';

const router = Router();

// All task routes require auth
router.use(requireAuth);
router.use(strictLimiter);

router.get('/stats', getStats);
router.get('/chart', getChartData);
router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.patch('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;
