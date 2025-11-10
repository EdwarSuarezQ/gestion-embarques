const express = require('express');
const router = express.Router();
const controller = require('../controllers/embarquesController');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/estadisticas', auth, controller.stats);
router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.patch('/:id', auth, controller.patch);
router.delete('/:id', auth, controller.remove);

// specialized endpoints
router.get('/estado/:estado', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Embarque').find({
      estado: req.params.estado,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});

router.get('/tipo/:tipo', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Embarque').find({
      tipoCarga: req.params.tipo,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});

router.get('/buque/:nombre', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Embarque').find({
      buque: new RegExp(req.params.nombre, 'i'),
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});

router.get('/activos', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Embarque').find({
      estado: { $in: ['in-transit', 'loading', 'unloading'] },
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/estado', auth, async (req, res, next) => {
  try {
    const embarque = await require('../models/Embarque').findById(
      req.params.id,
    );
    if (!embarque)
      return require('../utils/apiResponse').notFound(
        res,
        'Embarque no encontrado',
      );
    embarque.estado = req.body.estado;
    await embarque.save();
    return require('../utils/apiResponse').success(
      res,
      embarque,
      'Estado actualizado',
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
