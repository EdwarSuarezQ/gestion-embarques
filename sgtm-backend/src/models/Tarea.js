const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  asignado: {
    type: String,
    trim: true
  },
  fecha: {
    type: String,
    required: [true, 'La fecha es requerida'],
    match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato DD/MM/YYYY']
  },
  prioridad: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  estado: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  departamento: {
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
tareaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

tareaSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Tarea', tareaSchema);

