// Utilidad para respuestas estandarizadas de la API

exports.successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.errorResponse = (res, message = 'Error en la operación', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

exports.paginatedResponse = (res, data, pagination, message = 'Datos obtenidos exitosamente') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

