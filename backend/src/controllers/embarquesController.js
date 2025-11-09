import Embarque from '../models/Embarque.js';

// @desc    Obtener todos los embarques con paginación y filtros
// @route   GET /api/embarques
export const getEmbarques = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.tipoCarga) filter.tipoCarga = req.query.tipoCarga;
    if (req.query.buque) filter.buque = { $regex: req.query.buque, $options: 'i' };
    if (req.query.search) {
      filter.$or = [
        { idEmbarque: { $regex: req.query.search, $options: 'i' } },
        { buque: { $regex: req.query.search, $options: 'i' } },
        { origen: { $regex: req.query.search, $options: 'i' } },
        { destino: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const embarques = await Embarque.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Embarque.countDocuments(filter);

    res.json({
      success: true,
      data: embarques,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener embarque por ID
// @route   GET /api/embarques/:id
export const getEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findById(req.params.id);

    if (!embarque) {
      return res.status(404).json({
        success: false,
        message: 'Embarque no encontrado',
      });
    }

    res.json({
      success: true,
      data: embarque,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nuevo embarque
// @route   POST /api/embarques
export const createEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.create(req.body);

    res.status(201).json({
      success: true,
      data: embarque,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar embarque completo
// @route   PUT /api/embarques/:id
export const updateEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!embarque) {
      return res.status(404).json({
        success: false,
        message: 'Embarque no encontrado',
      });
    }

    res.json({
      success: true,
      data: embarque,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar embarque parcialmente
// @route   PATCH /api/embarques/:id
export const patchEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!embarque) {
      return res.status(404).json({
        success: false,
        message: 'Embarque no encontrado',
      });
    }

    res.json({
      success: true,
      data: embarque,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar embarque
// @route   DELETE /api/embarques/:id
export const deleteEmbarque = async (req, res, next) => {
  try {
    const embarque = await Embarque.findByIdAndDelete(req.params.id);

    if (!embarque) {
      return res.status(404).json({
        success: false,
        message: 'Embarque no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Embarque eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filtrar embarques por estado
// @route   GET /api/embarques/estado/:estado
export const getEmbarquesByEstado = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({ estado: req.params.estado }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: embarques,
      count: embarques.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filtrar embarques por tipo de carga
// @route   GET /api/embarques/tipo/:tipo
export const getEmbarquesByTipo = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({ tipoCarga: req.params.tipo }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: embarques,
      count: embarques.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buscar embarques por nombre de buque
// @route   GET /api/embarques/buque/:nombre
export const getEmbarquesByBuque = async (req, res, next) => {
  try {
    const embarques = await Embarque.find({
      buque: { $regex: req.params.nombre, $options: 'i' },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: embarques,
      count: embarques.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de embarques
// @route   GET /api/embarques/estadisticas
export const getEstadisticasEmbarques = async (req, res, next) => {
  try {
    const total = await Embarque.countDocuments();
    const porEstado = await Embarque.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 },
        },
      },
    ]);
    const porTipo = await Embarque.aggregate([
      {
        $group: {
          _id: '$tipoCarga',
          count: { $sum: 1 },
        },
      },
    ]);
    const teusTotal = await Embarque.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$teus' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porTipo,
        teusTotal: teusTotal[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
