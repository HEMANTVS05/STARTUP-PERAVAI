/**
 * Global error-handling middleware.
 * Must be registered LAST in Express (after all routes).
 */
const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${message}`);
    console.error(err.stack);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorMiddleware };
