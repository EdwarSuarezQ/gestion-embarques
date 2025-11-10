const { body, query, param } = require('express-validator');

// Validaciones para Tareas
exports.validateTarea = [
  body('titulo').trim().notEmpty().withMessage('El título es requerido'),
  body('fecha').matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('La fecha debe tener el formato DD/MM/YYYY'),
  body('prioridad').optional().isIn(['high', 'medium', 'low']).withMessage('Prioridad inválida'),
  body('estado').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Estado inválido')
];

// Validaciones para Embarques
exports.validateEmbarque = [
  body('idEmbarque').trim().notEmpty().withMessage('El ID de embarque es requerido'),
  body('buque').trim().notEmpty().withMessage('El nombre del buque es requerido'),
  body('origen').trim().notEmpty().withMessage('El origen es requerido'),
  body('destino').trim().notEmpty().withMessage('El destino es requerido'),
  body('fechaEstimada').matches(/^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/).withMessage('La fecha debe tener el formato DD/MM/YYYY - HH:mm'),
  body('teus').isInt({ min: 0 }).withMessage('Los TEUs deben ser un número mayor o igual a 0'),
  body('tipoCarga').isIn(['container', 'bulk', 'liquid', 'vehicles']).withMessage('Tipo de carga inválido'),
  body('estado').optional().isIn(['pending', 'in-transit', 'loading', 'unloading', 'completed']).withMessage('Estado inválido')
];

// Validaciones para Rutas
exports.validateRuta = [
  body('idRuta').trim().notEmpty().withMessage('El ID de ruta es requerido'),
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('origen').trim().notEmpty().withMessage('El origen es requerido'),
  body('paisOrigen').trim().notEmpty().withMessage('El país de origen es requerido'),
  body('destino').trim().notEmpty().withMessage('El destino es requerido'),
  body('paisDestino').trim().notEmpty().withMessage('El país de destino es requerido'),
  body('tipo').isIn(['international', 'regional', 'coastal']).withMessage('Tipo de ruta inválido'),
  body('estado').optional().isIn(['active', 'pending', 'completed', 'inactive']).withMessage('Estado inválido'),
  body('viajesAnio').optional().isInt({ min: 0 }).withMessage('Los viajes por año deben ser un número mayor o igual a 0')
];

// Validaciones para Facturas
exports.validateFactura = [
  body('idFactura').trim().notEmpty().withMessage('El ID de factura es requerido'),
  body('cliente').trim().notEmpty().withMessage('El cliente es requerido'),
  body('fechaEmision').matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('La fecha debe tener el formato DD/MM/YYYY'),
  body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser un número mayor o igual a 0'),
  body('estado').optional().isIn(['paid', 'pending', 'overdue', 'cancelled']).withMessage('Estado inválido')
];

// Validaciones para Personal
exports.validatePersonal = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('puesto').trim().notEmpty().withMessage('El puesto es requerido'),
  body('departamento').trim().notEmpty().withMessage('El departamento es requerido'),
  body('estado').optional().isIn(['active', 'inactive']).withMessage('Estado inválido')
];

// Validaciones para Embarcaciones
exports.validateEmbarcacion = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('fecha').matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('La fecha debe tener el formato DD/MM/YYYY'),
  body('capacidad').trim().notEmpty().withMessage('La capacidad es requerida'),
  body('tipo').isIn(['container', 'bulk', 'general', 'tanker']).withMessage('Tipo inválido'),
  body('estado').optional().isIn(['pending', 'in-transit', 'in-route', 'in-port']).withMessage('Estado inválido')
];

// Validaciones para Almacenes
exports.validateAlmacen = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('ubicacion').trim().notEmpty().withMessage('La ubicación es requerida'),
  body('capacidad').isInt({ min: 0 }).withMessage('La capacidad debe ser un número mayor o igual a 0'),
  body('ocupacion').optional().isInt({ min: 0, max: 100 }).withMessage('La ocupación debe estar entre 0 y 100'),
  body('estado').optional().isIn(['operativo', 'mantenimiento', 'inoperativo']).withMessage('Estado inválido'),
  body('proximoMantenimiento').optional().matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('La fecha debe tener el formato DD/MM/YYYY')
];

// Validaciones para Autenticación
exports.validateRegister = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Validaciones para paginación
exports.validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('sort').optional().isString().withMessage('El ordenamiento debe ser una cadena')
];

