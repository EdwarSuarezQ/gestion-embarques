const mongoose = require('mongoose');

const embarqueSchema = new mongoose.Schema({
  idEmbarque: {
    type: String,
    required: [true, 'El ID de embarque es requerido'],
    unique: true,
    trim: true
  },
  buque: {
    type: String,
    required: [true, 'El nombre del buque es requerido'],
    trim: true
  },
  imo: {
    type: String,
    trim: true
  },
  origen: {
    type: String,
    required: [true, 'El origen es requerido'],
    trim: true
  },
  destino: {
    type: String,
    required: [true, 'El destino es requerido'],
    trim: true
  },
  fechaEstimada: {
    type: String,
    required: [true, 'La fecha estimada es requerida'],
    match: [/^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/, 'La fecha debe tener el formato DD/MM/YYYY - HH:mm']
  },
  teus: {
    type: Number,
    min: [0, 'Los TEUs deben ser mayor o igual a 0'],
    required: [true, 'Los TEUs son requeridos']
  },
  tipoCarga: {
    type: String,
    enum: ['container', 'bulk', 'liquid', 'vehicles'],
    required: [true, 'El tipo de carga es requerido']
  },
  estado: {
    type: String,
    enum: ['pending', 'in-transit', 'loading', 'unloading', 'completed'],
    default: 'pending'
  },
  distancia: {
    type: String,
    trim: true
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
embarqueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

embarqueSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Embarque', embarqueSchema);

