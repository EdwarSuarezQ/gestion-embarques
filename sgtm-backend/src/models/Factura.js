const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
  idFactura: { type: String, required: true, unique: true, trim: true },
  cliente: { type: String, required: true, trim: true },
  fechaEmision: {
    type: String,
    required: true,
    match: /^\d{2}\/\d{2}\/\d{4}$/,
  },
  monto: { type: Number, min: 0, required: true },
  estado: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FacturaSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Factura', FacturaSchema);
