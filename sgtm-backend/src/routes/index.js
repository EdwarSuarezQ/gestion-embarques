const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const tareasRoutes = require('./tareas');
const embarquesRoutes = require('./embarques');
const rutasRoutes = require('./rutas');
const facturasRoutes = require('./facturas');
const personalRoutes = require('./personal');
const embarcacionesRoutes = require('./embarcaciones');
const almacenesRoutes = require('./almacenes');
const estadisticasRoutes = require('./estadisticas');
const exportarRoutes = require('./exportar');

router.use('/auth', authRoutes);
router.use('/tareas', tareasRoutes);
router.use('/embarques', embarquesRoutes);
router.use('/rutas', rutasRoutes);
router.use('/facturas', facturasRoutes);
router.use('/personal', personalRoutes);
router.use('/embarcaciones', embarcacionesRoutes);
router.use('/almacenes', almacenesRoutes);
router.use('/estadisticas', estadisticasRoutes);
router.use('/exportar', exportarRoutes);

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API SGTM - Sistema de Gestión de Transporte Marítimo',
    version: '1.0.0'
  });
});

module.exports = router;

