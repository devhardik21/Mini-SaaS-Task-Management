import { ActivityLog, User } from '../models/index.js';

// GET /api/activity
export const getActivityLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const where = isAdmin ? {} : { user_id: userId };

        const activities = await ActivityLog.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['name', 'avatar_url']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: 50
        });

        // Flatten the response to match the previous structure if needed
        const formattedActivities = activities.map(a => ({
            ...a.toJSON(),
            user_name: a.User?.name,
            user_avatar: a.User?.avatar_url
        }));

        res.json({ activities: formattedActivities });
    } catch (err) {
        next(err);
    }
};

