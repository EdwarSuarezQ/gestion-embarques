const mongoose = require('mongoose');

const embarcacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  imo: {
    type: String,
    trim: true
  },
  origen: {
    type: String,
    trim: true
  },
  destino: {
    type: String,
    trim: true
  },
  fecha: {
    type: String,
    required: [true, 'La fecha es requerida'],
    match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato DD/MM/YYYY']
  },
  capacidad: {
    type: String,
    required: [true, 'La capacidad es requerida'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['container', 'bulk', 'general', 'tanker'],
    required: [true, 'El tipo es requerido']
  },
  estado: {
    type: String,
    enum: ['pending', 'in-transit', 'in-route', 'in-port'],
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
embarcacionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

embarcacionSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Embarcacion', embarcacionSchema);

