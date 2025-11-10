const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  puesto: {
    type: String,
    required: [true, 'El puesto es requerido'],
    trim: true
  },
  departamento: {
    type: String,
    required: [true, 'El departamento es requerido'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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
personalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

personalSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Personal', personalSchema);

