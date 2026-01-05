// Express error handler: whenever we call next(err) or throw inside async routes,
// this middleware converts it into a JSON response.
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? "🥷" : err.stack,
  });
}
