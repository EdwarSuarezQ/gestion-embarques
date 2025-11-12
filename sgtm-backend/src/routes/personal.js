const express = require('express');
const router = express.Router();
const controller = require('../controllers/personalController');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/estadisticas', auth, controller.stats);
router.get('/departamento/:depto', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Personal').find({
      departamento: req.params.depto,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.put('/:id/estado', auth, async (req, res, next) => {
  try {
    const p = await require('../models/Personal').findById(req.params.id);
    if (!p)
      return require('../utils/apiResponse').notFound(
        res,
        'Personal no encontrado',
      );
    p.estado = req.body.estado;
    await p.save();
    return require('../utils/apiResponse').success(
      res,
      p,
      'Estado actualizado',
    );
  } catch (err) {
    next(err);
  }
});
router.get('/activos', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Personal').find({
      estado: 'active',
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/puesto/:puesto', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Personal').find({
      puesto: req.params.puesto,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});
router.get('/email/:email', auth, async (req, res, next) => {
  try {
    const items = await require('../models/Personal').find({
      email: req.params.email,
    });
    return require('../utils/apiResponse').success(res, items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.patch('/:id', auth, controller.patch);
router.delete('/:id', auth, controller.remove);

module.exports = router;
