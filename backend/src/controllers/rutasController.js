import Ruta from '../models/Ruta.js';

const getRutas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.tipo) filter.tipo = req.query.tipo;
    if (req.query.origen) filter.origen = { $regex: req.query.origen, $options: 'i' };
    if (req.query.search) {
      filter.$or = [
        { idRuta: { $regex: req.query.search, $options: 'i' } },
        { nombre: { $regex: req.query.search, $options: 'i' } },
        { origen: { $regex: req.query.search, $options: 'i' } },
        { destino: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const rutas = await Ruta.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Ruta.countDocuments(filter);

    res.json({
      success: true,
      data: rutas,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findById(req.params.id);
    if (!ruta) {
      return res.status(404).json({ success: false, message: 'Ruta no encontrada' });
    }
    res.json({ success: true, data: ruta });
  } catch (error) {
    next(error);
  }
};

const createRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.create(req.body);
    res.status(201).json({ success: true, data: ruta });
  } catch (error) {
    next(error);
  }
};

const updateRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ruta) {
      return res.status(404).json({ success: false, message: 'Ruta no encontrada' });
    }
    res.json({ success: true, data: ruta });
  } catch (error) {
    next(error);
  }
};

const patchRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ruta) {
      return res.status(404).json({ success: false, message: 'Ruta no encontrada' });
    }
    res.json({ success: true, data: ruta });
  } catch (error) {
    next(error);
  }
};

const deleteRuta = async (req, res, next) => {
  try {
    const ruta = await Ruta.findByIdAndDelete(req.params.id);
    if (!ruta) {
      return res.status(404).json({ success: false, message: 'Ruta no encontrada' });
    }
    res.json({ success: true, message: 'Ruta eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

const getRutasActivas = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({ estado: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, data: rutas, count: rutas.length });
  } catch (error) {
    next(error);
  }
};

const getRutasByTipo = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({ tipo: req.params.tipo }).sort({ createdAt: -1 });
    res.json({ success: true, data: rutas, count: rutas.length });
  } catch (error) {
    next(error);
  }
};

const getRutasByOrigen = async (req, res, next) => {
  try {
    const rutas = await Ruta.find({
      origen: { $regex: req.params.ciudad, $options: 'i' },
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: rutas, count: rutas.length });
  } catch (error) {
    next(error);
  }
};

const getEstadisticasRutas = async (req, res, next) => {
  try {
    const total = await Ruta.countDocuments();
    const porEstado = await Ruta.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } },
    ]);
    const porTipo = await Ruta.aggregate([
      { $group: { _id: '$tipo', count: { $sum: 1 } } },
    ]);
    const viajesTotal = await Ruta.aggregate([
      { $group: { _id: null, total: { $sum: '$viajesAnio' } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porTipo,
        viajesTotal: viajesTotal[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getRutas,
  getRuta,
  createRuta,
  updateRuta,
  patchRuta,
  deleteRuta,
  getRutasActivas,
  getRutasByTipo,
  getRutasByOrigen,
  getEstadisticasRutas,
};
