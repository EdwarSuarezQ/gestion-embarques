const express = require('express');
const router = express.Router();
const controller = require('../controllers/facturasController');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/estadisticas', auth, controller.stats);
router.get('/estado/:estado', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Factura').find({
      estado: req.params.estado,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/cliente/:nombre', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Factura').find({
      cliente: new RegExp(req.params.nombre, 'i'),
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/pendientes', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Factura').find({
      estado: 'pending',
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.put('/:id/pagar', auth, async (req, res, next) => {
  try {
    const f = await require('../models/Factura').findById(req.params.id);
    if (!f)
      return require('../utils/apiResponse').notFound(
        res,
        'Factura no encontrada',
      );
    f.estado = 'paid';
    await f.save();
    return require('../utils/apiResponse').success(res, f, 'Factura pagada');
  } catch (err) {
    next(err);
  }
});
router.put('/:id/estado', auth, async (req, res, next) => {
  try {
    const f = await require('../models/Factura').findById(req.params.id);
    if (!f)
      return require('../utils/apiResponse').notFound(
        res,
        'Factura no encontrada',
      );
    f.estado = req.body.estado;
    await f.save();
    return require('../utils/apiResponse').success(
      res,
      f,
      'Estado actualizado',
    );
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.patch('/:id', auth, controller.patch);
router.delete('/:id', auth, controller.remove);

module.exports = router;
