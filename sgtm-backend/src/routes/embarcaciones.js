const express = require('express');
const router = express.Router();
const controller = require('../controllers/embarcacionesController');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/estadisticas', auth, controller.stats);
router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.patch('/:id', auth, controller.patch);
router.delete('/:id', auth, controller.remove);

module.exports = router;
