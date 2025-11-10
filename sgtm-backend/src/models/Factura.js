const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  idFactura: {
    type: String,
    required: [true, 'El ID de factura es requerido'],
    unique: true,
    trim: true
  },
  cliente: {
    type: String,
    required: [true, 'El cliente es requerido'],
    trim: true
  },
  fechaEmision: {
    type: String,
    required: [true, 'La fecha de emisión es requerida'],
    match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato DD/MM/YYYY']
  },
  monto: {
    type: Number,
    min: [0, 'El monto debe ser mayor o igual a 0'],
    required: [true, 'El monto es requerido']
  },
  estado: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Actualizar updatedAt antes de guardar
facturaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

facturaSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Factura', facturaSchema);

