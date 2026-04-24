import { getAuth } from '@clerk/express';
import { User } from '../models/index.js';
import { createError } from './errorHandler.js';

/**
 * Middleware: verifies Clerk session, syncs user to DB, attaches req.user
 */
export const requireAuth = async (req, _res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return next(createError('Unauthorized — please sign in', 401));
        }

        // Look up user in our DB
        let user = await User.findOne({ where: { clerk_id: userId } });

        // First-time login: auto-create user record (data will be enriched by webhook/profile)
        if (!user) {
            [user] = await User.findOrCreate({
                where: { clerk_id: userId },
                defaults: {
                    email: `${userId}@pending.clerk`,
                    name: 'New User',
                    role: 'user'
                }
            });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

