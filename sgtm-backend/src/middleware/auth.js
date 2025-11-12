// Authentication middleware disabled for development/testing.
// This module intentionally allows all requests and attaches a default
// user role to `req.user`. Revert this file to restore JWT checks.

module.exports = (req, res, next) => {
  // Optional: log that auth is disabled (commented out to reduce noise)
  // console.warn('Auth middleware is disabled (development mode)');

  // Provide a minimal `req.user` so controllers that expect it won't crash.
  req.user = { rol: 'admin', nombre: 'dev', _id: null };
  next();
};
