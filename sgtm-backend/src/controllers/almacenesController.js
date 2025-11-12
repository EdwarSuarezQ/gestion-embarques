const Almacen = require('../models/Almacen');
const crudFactory = require('../utils/crudFactory');

// añadir método especifico para ocupacion
const controller = crudFactory(Almacen);

controller.updateOcupacion = async (req, res, next) => {
  try {
    const { nivel } = req.body;
    const almacen = await Almacen.findById(req.params.id);
    if (!almacen)
      return require('../utils/apiResponse').notFound(
        res,
        'Almacén no encontrado',
      );
    almacen.ocupacion = nivel;
    await almacen.save();
    return require('../utils/apiResponse').success(
      res,
      almacen,
      'Ocupación actualizada',
    );
  } catch (err) {
    next(err);
  }
};

module.exports = controller;
