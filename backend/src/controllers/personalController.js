import Personal from '../models/Personal.js';

const getPersonal = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.departamento) filter.departamento = req.query.departamento;
    if (req.query.search) {
      filter.$or = [
        { nombre: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { puesto: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const personal = await Personal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Personal.countDocuments(filter);

    res.json({
      success: true,
      data: personal,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getPersonalById = async (req, res, next) => {
  try {
    const personal = await Personal.findById(req.params.id);
    if (!personal) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, data: personal });
  } catch (error) {
    next(error);
  }
};

const createPersonal = async (req, res, next) => {
  try {
    const personal = await Personal.create(req.body);
    res.status(201).json({ success: true, data: personal });
  } catch (error) {
    next(error);
  }
};

const updatePersonal = async (req, res, next) => {
  try {
    const personal = await Personal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!personal) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, data: personal });
  } catch (error) {
    next(error);
  }
};

const patchPersonal = async (req, res, next) => {
  try {
    const personal = await Personal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!personal) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, data: personal });
  } catch (error) {
    next(error);
  }
};

const deletePersonal = async (req, res, next) => {
  try {
    const personal = await Personal.findByIdAndDelete(req.params.id);
    if (!personal) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, message: 'Personal eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

const getPersonalByDepartamento = async (req, res, next) => {
  try {
    const personal = await Personal.find({
      departamento: { $regex: req.params.depto, $options: 'i' },
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: personal, count: personal.length });
  } catch (error) {
    next(error);
  }
};

const cambiarEstadoPersonal = async (req, res, next) => {
  try {
    const { estado } = req.body;
    if (!['active', 'inactive'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'El estado debe ser "active" o "inactive"',
      });
    }
    const personal = await Personal.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );
    if (!personal) {
      return res.status(404).json({ success: false, message: 'Personal no encontrado' });
    }
    res.json({ success: true, data: personal });
  } catch (error) {
    next(error);
  }
};

const getPersonalActivos = async (req, res, next) => {
  try {
    const personal = await Personal.find({ estado: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, data: personal, count: personal.length });
  } catch (error) {
    next(error);
  }
};

const getEstadisticasPersonal = async (req, res, next) => {
  try {
    const total = await Personal.countDocuments();
    const porEstado = await Personal.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } },
    ]);
    const porDepartamento = await Personal.aggregate([
      { $group: { _id: '$departamento', count: { $sum: 1 } } },
    ]);
    const porPuesto = await Personal.aggregate([
      { $group: { _id: '$puesto', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        porDepartamento,
        porPuesto,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  patchPersonal,
  deletePersonal,
  getPersonalByDepartamento,
  cambiarEstadoPersonal,
  getPersonalActivos,
  getEstadisticasPersonal,
};
