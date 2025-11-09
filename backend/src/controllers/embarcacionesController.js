import Embarcacion from '../models/Embarcacion.js';

const getEmbarcaciones = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.tipo) filter.tipo = req.query.tipo;
    if (req.query.search) {
      filter.$or = [
        { nombre: { $regex: req.query.search, $options: 'i' } },
        { imo: { $regex: req.query.search, $options: 'i' } },
        { origen: { $regex: req.query.search, $options: 'i' } },
        { destino: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const embarcaciones = await Embarcacion.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Embarcacion.countDocuments(filter);

    res.json({
      success: true,
      data: embarcaciones,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findById(req.params.id);
    if (!embarcacion) {
      return res.status(404).json({ success: false, message: 'Embarcación no encontrada' });
    }
    res.json({ success: true, data: embarcacion });
  } catch (error) {
    next(error);
  }
};

const createEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.create(req.body);
    res.status(201).json({ success: true, data: embarcacion });
  } catch (error) {
    next(error);
  }
};

const updateEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!embarcacion) {
      return res.status(404).json({ success: false, message: 'Embarcación no encontrada' });
    }
    res.json({ success: true, data: embarcacion });
  } catch (error) {
    next(error);
  }
};

const patchEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!embarcacion) {
      return res.status(404).json({ success: false, message: 'Embarcación no encontrada' });
    }
    res.json({ success: true, data: embarcacion });
  } catch (error) {
    next(error);
  }
};

const deleteEmbarcacion = async (req, res, next) => {
  try {
    const embarcacion = await Embarcacion.findByIdAndDelete(req.params.id);
    if (!embarcacion) {
      return res.status(404).json({ success: false, message: 'Embarcación no encontrada' });
    }
    res.json({ success: true, message: 'Embarcación eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

const getEstadisticasEmbarcaciones = async (req, res, next) => {
  try {
    const total = await Embarcacion.countDocuments();
    const porEstado = await Embarcacion.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } },
    ]);
    const porTipo = await Embarcacion.aggregate([
      { $group: { _id: '$tipo', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porTipo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getEmbarcaciones,
  getEmbarcacion,
  createEmbarcacion,
  updateEmbarcacion,
  patchEmbarcacion,
  deleteEmbarcacion,
  getEstadisticasEmbarcaciones,
};
