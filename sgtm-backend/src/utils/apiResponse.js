exports.success = (res, data = {}, message = 'OK', code = 200) =>
  res.status(code).json({ success: true, message, data });
exports.error = (res, message = 'Error', code = 500, errors = null) =>
  res.status(code).json({ success: false, message, errors });
exports.notFound = (res, message = 'No encontrado') =>
  exports.error(res, message, 404);
exports.unauthorized = (res, message = 'No autorizado') =>
  exports.error(res, message, 401);
