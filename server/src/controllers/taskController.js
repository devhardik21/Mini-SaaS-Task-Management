import { User, Task, ActivityLog, sequelize } from '../models/index.js';
import { createError } from '../middleware/errorHandler.js';
import { body, validationResult, param } from 'express-validator';
import { Op } from 'sequelize';

// ── Validation rules ──────────────────────────────────────────────────────────
export const validateCreateTask = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('label').optional().trim().isLength({ max: 100 }),
    body('due_date').optional({ nullable: true }).isDate().withMessage('Invalid date format (YYYY-MM-DD)'),
];

export const validateUpdateTask = [
    param('id').isUUID().withMessage('Invalid task ID'),
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('description').optional({ nullable: true }).trim().isLength({ max: 2000 }),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('label').optional({ nullable: true }).trim().isLength({ max: 100 }),
    body('due_date').optional({ nullable: true }).isDate(),
];

const checkValidation = (req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
        err.details = errors.array();
        throw err;
    }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const logActivity = async (userId, action, taskId, taskTitle) => {
    await ActivityLog.create({
        user_id: userId,
        action,
        task_id: taskId,
        task_title: taskTitle
    });
};

// ── Controllers ───────────────────────────────────────────────────────────────

// POST /api/tasks
export const createTask = async (req, res, next) => {
    try {
        checkValidation(req, next);
        const { title, description, status = 'pending', priority = 'medium', label, due_date } = req.body;
        const userId = req.user.id;

        const task = await Task.create({
            user_id: userId,
            title,
            description,
            status,
            priority,
            label,
            due_date
        });

        await logActivity(userId, `Created task "${title}"`, task.id, title);

        res.status(201).json({ task });
    } catch (err) {
        next(err);
    }
};

// GET /api/tasks
export const getTasks = async (req, res, next) => {
    try {
        const { status, priority, label, search } = req.query;
        const isAdmin = req.user.role === 'admin';
        const userId = req.user.id;

        const where = {};
        if (!isAdmin) {
            where.user_id = userId;
        }

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (label) where.label = { [Op.iLike]: `%${label}%` };
        if (search) where.title = { [Op.iLike]: `%${search}%` };

        const tasks = await Task.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['name', 'email', 'avatar_url']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response to include user details at top level if needed by frontend
        const formattedTasks = tasks.map(t => ({
            ...t.toJSON(),
            user_name: t.User?.name,
            user_email: t.User?.email,
            user_avatar: t.User?.avatar_url
        }));

        res.json({ tasks: formattedTasks, count: tasks.length });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/tasks/:id
export const updateTask = async (req, res, next) => {
    try {
        checkValidation(req, next);
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const task = await Task.findByPk(id);
        if (!task) return next(createError('Task not found', 404));
        if (!isAdmin && task.user_id !== userId) {
            return next(createError('You do not have permission to update this task', 403));
        }

        const { title, description, status, priority, label, due_date } = req.body;
        const oldStatus = task.status;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (label !== undefined) task.label = label;
        if (due_date !== undefined) task.due_date = due_date;

        await task.save();

        // Log meaningful status changes
        if (status && status !== oldStatus) {
            const actionText = status === 'completed'
                ? `Completed task "${task.title}"`
                : `Updated "${task.title}" to ${status.replace('_', ' ')}`;
            await logActivity(task.user_id, actionText, task.id, task.title);
        } else if (title || description || priority || label || due_date) {
            await logActivity(task.user_id, `Updated task "${task.title}"`, task.id, task.title);
        }

        res.json({ task });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const task = await Task.findByPk(id);
        if (!task) return next(createError('Task not found', 404));
        if (!isAdmin && task.user_id !== userId) {
            return next(createError('You do not have permission to delete this task', 403));
        }

        const { title, user_id } = task;
        await task.destroy();
        await logActivity(user_id, `Deleted task "${title}"`, null, title);

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// GET /api/tasks/stats
export const getStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        const where = isAdmin ? {} : { user_id: userId };

        const total = await Task.count({ where });
        const completed = await Task.count({ where: { ...where, status: 'completed' } });
        const pending = await Task.count({ where: { ...where, status: 'pending' } });
        const in_progress = await Task.count({ where: { ...where, status: 'in_progress' } });
        const overdue = await Task.count({
            where: {
                ...where,
                status: { [Op.ne]: 'completed' },
                due_date: { [Op.lt]: new Date() }
            }
        });

        res.json({
            total,
            completed,
            pending,
            in_progress,
            overdue,
            completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/tasks/chart
export const getChartData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        const where = {
            status: 'completed',
            updated_at: { [Op.gte]: sequelize.literal("NOW() - INTERVAL '30 days'") }
        };
        if (!isAdmin) where.user_id = userId;

        const results = await Task.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('updated_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where,
            group: [sequelize.fn('DATE', sequelize.col('updated_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('updated_at')), 'ASC']],
            raw: true
        });

        // Fill in missing days with 0
        const chartMap = {};
        results.forEach((r) => {
            chartMap[r.date] = parseInt(r.count);
        });

        const data = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            data.push({ date: dateStr, completed: chartMap[dateStr] || 0 });
        }

        res.json({ chart: data });
    } catch (err) {
        next(err);
    }
};

