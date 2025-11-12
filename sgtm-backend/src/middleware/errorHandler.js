const apiResponse = require('../utils/apiResponse');

module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  const errors = err.errors || null;
  return apiResponse.error(res, message, status, errors);
};
