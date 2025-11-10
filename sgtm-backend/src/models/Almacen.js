const mongoose = require('mongoose');

const almacenSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación es requerida'],
    trim: true
  },
  capacidad: {
    type: Number,
    min: [0, 'La capacidad debe ser mayor o igual a 0'],
    required: [true, 'La capacidad es requerida']
  },
  ocupacion: {
    type: Number,
    min: [0, 'La ocupación debe ser mayor o igual a 0'],
    max: [100, 'La ocupación no puede ser mayor a 100'],
    default: 0
  },
  estado: {
    type: String,
    enum: ['operativo', 'mantenimiento', 'inoperativo'],
    default: 'operativo'
  },
  proximoMantenimiento: {
    type: String,
    match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato DD/MM/YYYY']
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
almacenSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

almacenSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Almacen', almacenSchema);

