import Tarea from '../models/Tarea.js';

// @desc    Obtener todas las tareas con paginación y filtros
// @route   GET /api/tareas
export const getTareas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros
    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.prioridad) filter.prioridad = req.query.prioridad;
    if (req.query.departamento) filter.departamento = req.query.departamento;
    if (req.query.asignado) filter.asignado = { $regex: req.query.asignado, $options: 'i' };

    // Búsqueda por texto
    if (req.query.search) {
      filter.$or = [
        { titulo: { $regex: req.query.search, $options: 'i' } },
        { descripcion: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const tareas = await Tarea.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tarea.countDocuments(filter);

    res.json({
      success: true,
      data: tareas,
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

// @desc    Obtener una tarea por ID
// @route   GET /api/tareas/:id
export const getTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    res.json({
      success: true,
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nueva tarea
// @route   POST /api/tareas
export const createTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.create(req.body);

    res.status(201).json({
      success: true,
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar tarea completa
// @route   PUT /api/tareas/:id
export const updateTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    res.json({
      success: true,
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar tarea parcialmente
// @route   PATCH /api/tareas/:id
export const patchTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    res.json({
      success: true,
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar tarea
// @route   DELETE /api/tareas/:id
export const deleteTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de tareas
// @route   GET /api/tareas/estadisticas
export const getEstadisticasTareas = async (req, res, next) => {
  try {
    const total = await Tarea.countDocuments();
    const porEstado = await Tarea.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 },
        },
      },
    ]);
    const porPrioridad = await Tarea.aggregate([
      {
        $group: {
          _id: '$prioridad',
          count: { $sum: 1 },
        },
      },
    ]);
    const porDepartamento = await Tarea.aggregate([
      {
        $group: {
          _id: '$departamento',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porPrioridad,
        porDepartamento,
      },
    });
  } catch (error) {
    next(error);
  }
};
