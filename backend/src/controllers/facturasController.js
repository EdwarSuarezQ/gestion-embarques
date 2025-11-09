import Factura from '../models/Factura.js';

const getFacturas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.estado) filter.estado = req.query.estado;
    if (req.query.cliente) filter.cliente = { $regex: req.query.cliente, $options: 'i' };
    if (req.query.search) {
      filter.$or = [
        { idFactura: { $regex: req.query.search, $options: 'i' } },
        { cliente: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const facturas = await Factura.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Factura.countDocuments(filter);

    res.json({
      success: true,
      data: facturas,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findById(req.params.id);
    if (!factura) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }
    res.json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

const createFactura = async (req, res, next) => {
  try {
    const factura = await Factura.create(req.body);
    res.status(201).json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

const updateFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!factura) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }
    res.json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

const patchFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!factura) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }
    res.json({ success: true, data: factura });
  } catch (error) {
    next(error);
  }
};

const deleteFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);
    if (!factura) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }
    res.json({ success: true, message: 'Factura eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

const getFacturasByEstado = async (req, res, next) => {
  try {
    const facturas = await Factura.find({ estado: req.params.estado }).sort({ createdAt: -1 });
    res.json({ success: true, data: facturas, count: facturas.length });
  } catch (error) {
    next(error);
  }
};

const pagarFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndUpdate(
      req.params.id,
      { estado: 'paid' },
      { new: true, runValidators: true }
    );
    if (!factura) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }
    res.json({ success: true, data: factura, message: 'Factura marcada como pagada' });
  } catch (error) {
    next(error);
  }
};

const getFacturasByCliente = async (req, res, next) => {
  try {
    const facturas = await Factura.find({
      cliente: { $regex: req.params.nombre, $options: 'i' },
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: facturas, count: facturas.length });
  } catch (error) {
    next(error);
  }
};

const getEstadisticasFacturas = async (req, res, next) => {
  try {
    const total = await Factura.countDocuments();
    const porEstado = await Factura.aggregate([
      { $group: { _id: '$estado', count: { $sum: 1 } } },
    ]);
    const montoTotal = await Factura.aggregate([
      { $group: { _id: null, total: { $sum: '$monto' } } },
    ]);
    const montoPorEstado = await Factura.aggregate([
      { $group: { _id: '$estado', total: { $sum: '$monto' } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        porEstado,
        montoTotal: montoTotal[0]?.total || 0,
        montoPorEstado,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getFacturas,
  getFactura,
  createFactura,
  updateFactura,
  patchFactura,
  deleteFactura,
  getFacturasByEstado,
  pagarFactura,
  getFacturasByCliente,
  getEstadisticasFacturas,
};
