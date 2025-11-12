const express = require('express');
const router = express.Router();
const controller = require('../controllers/almacenesController');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/estadisticas', auth, controller.stats);
router.get('/ocupacion/:nivel', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Almacen').find({
      ocupacion: { $gte: Number(req.params.nivel) },
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/mantenimiento/proximos', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Almacen')
      .find({ proximoMantenimiento: { $exists: true } })
      .sort('proximoMantenimiento');
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/estado/:estado', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Almacen').find({
      estado: req.params.estado,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/capacidad/:min/:max', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Almacen').find({
      capacidad: { $gte: Number(req.params.min), $lte: Number(req.params.max) },
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.put('/:id/ocupacion', auth, controller.updateOcupacion);

router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.patch('/:id', auth, controller.patch);
router.delete('/:id', auth, controller.remove);

module.exports = router;
