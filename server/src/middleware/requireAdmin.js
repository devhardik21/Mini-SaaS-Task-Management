import { createError } from './errorHandler.js';

export const requireAdmin = (req, _res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(createError('Forbidden — admin access required', 403));
    }
    next();
};
