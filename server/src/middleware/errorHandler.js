export const errorHandler = (err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[ERROR] ${status} - ${message}`, err.stack || '');

    res.status(status).json({
        error: true,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const createError = (message, status = 400) => {
    const err = new Error(message);
    err.status = status;
    return err;
};
