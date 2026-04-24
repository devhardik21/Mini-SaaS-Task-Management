import { User, Task, sequelize } from '../models/index.js';
import { createError } from '../middleware/errorHandler.js';

// GET /api/users/me
export const getMe = async (req, res) => {
    res.json({ user: req.user });
};

// PATCH /api/users/me — update profile (name, avatar synced from Clerk webhook)
export const updateMe = async (req, res, next) => {
    try {
        const { name } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return next(createError('User not found', 404));

        if (name) user.name = name;
        await user.save();

        res.json({ user });
    } catch (err) {
        next(err);
    }
};

// GET /api/users — admin only: all users with task counts
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM tasks AS task
                            WHERE task.user_id = "User".id
                        )`),
                        'task_count'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM tasks AS task
                            WHERE task.user_id = "User".id
                            AND task.status = 'completed'
                        )`),
                        'completed_count'
                    ]
                ]
            },
            order: [['created_at', 'DESC']]
        });
        res.json({ users });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/users/:id/role — admin only: promote/demote user
export const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return next(createError('Invalid role. Must be "user" or "admin"', 400));
        }

        const user = await User.findByPk(id);
        if (!user) return next(createError('User not found', 404));

        user.role = role;
        await user.save();

        res.json({ user, message: `Role updated to ${role}` });
    } catch (err) {
        next(err);
    }
};

// POST /api/users/sync — Clerk webhook or manual sync to update user profile
export const syncUser = async (req, res, next) => {
    try {
        const { clerk_id, email, name, avatar_url } = req.body;
        if (!clerk_id) return next(createError('clerk_id is required', 400));

        const [user, created] = await User.findOrCreate({
            where: { clerk_id },
            defaults: { email, name, avatar_url }
        });

        if (!created) {
            user.email = email;
            user.name = name;
            user.avatar_url = avatar_url;
            await user.save();
        }

        res.json({ user });
    } catch (err) {
        next(err);
    }
};

