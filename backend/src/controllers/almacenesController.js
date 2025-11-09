import Almacen from '../models/Almacen.js';

const getAlmacenes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.search) {
      filter.$or = [
        { nombre: { $regex: req.query.search, $options: 'i' } },
        { ubicacion: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const almacenes = await Almacen.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Almacen.countDocuments(filter);

    res.json({
      success: true,
      data: almacenes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findById(req.params.id);
    if (!almacen) {
      return res.status(404).json({ success: false, message: 'Almacén no encontrado' });
    }
    res.json({ success: true, data: almacen });
  } catch (error) {
    next(error);
  }
};

const createAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.create(req.body);
    res.status(201).json({ success: true, data: almacen });
  } catch (error) {
    next(error);
  }
};

const updateAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!almacen) {
      return res.status(404).json({ success: false, message: 'Almacén no encontrado' });
    }
    res.json({ success: true, data: almacen });
  } catch (error) {
    next(error);
  }
};

const patchAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!almacen) {
      return res.status(404).json({ success: false, message: 'Almacén no encontrado' });
    }
    res.json({ success: true, data: almacen });
  } catch (error) {
    next(error);
  }
};

const deleteAlmacen = async (req, res, next) => {
  try {
    const almacen = await Almacen.findByIdAndDelete(req.params.id);
    if (!almacen) {
      return res.status(404).json({ success: false, message: 'Almacén no encontrado' });
    }
    res.json({ success: true, message: 'Almacén eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

const getAlmacenesByOcupacion = async (req, res, next) => {
  try {
    const nivel = parseInt(req.params.nivel);
    let filter = {};

    if (req.params.nivel === 'alto') {
      filter.ocupacion = { $gte: 80 };
    } else if (req.params.nivel === 'medio') {
      filter.ocupacion = { $gte: 50, $lt: 80 };
    } else if (req.params.nivel === 'bajo') {
      filter.ocupacion = { $lt: 50 };
    } else if (!isNaN(nivel)) {
      filter.ocupacion = { $gte: nivel };
    }

    const almacenes = await Almacen.find(filter).sort({ ocupacion: -1 });
    res.json({ success: true, data: almacenes, count: almacenes.length });
  } catch (error) {
    next(error);
  }
};

const getProximosMantenimientos = async (req, res, next) => {
  try {
    const almacenes = await Almacen.find({
      proximoMantenimiento: { $exists: true, $ne: null },
      estado: { $ne: 'inoperativo' },
    }).sort({ proximoMantenimiento: 1 });

    res.json({ success: true, data: almacenes, count: almacenes.length });
  } catch (error) {
    next(error);
  }
};

const getAlmacenesByEstado = async (req, res, next) => {
  try {
    const almacenes = await Almacen.find({ estado: req.params.estado }).sort({ createdAt: -1 });
    res.json({ success: true, data: almacenes, count: almacenes.length });
  } catch (error) {
    next(error);
  }
};

const getEstadisticasAlmacenes = async (req, res, next) => {
  try {
    const total = await Almacen.countDocuments();
    const porEstado = await Almacen.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } },
    ]);
    const capacidadTotal = await Almacen.aggregate([
      { $group: { _id: null, total: { $sum: '$capacidad' } } },
    ]);
    const ocupacionPromedio = await Almacen.aggregate([
      { $group: { _id: null, promedio: { $avg: '$ocupacion' } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        capacidadTotal: capacidadTotal[0]?.total || 0,
        ocupacionPromedio: ocupacionPromedio[0]?.promedio?.toFixed(2) || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAlmacenes,
  getAlmacen,
  createAlmacen,
  updateAlmacen,
  patchAlmacen,
  deleteAlmacen,
  getAlmacenesByOcupacion,
  getProximosMantenimientos,
  getAlmacenesByEstado,
  getEstadisticasAlmacenes,
};
