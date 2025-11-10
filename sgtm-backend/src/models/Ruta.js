const mongoose = require('mongoose');

const rutaSchema = new mongoose.Schema({
  idRuta: {
    type: String,
    required: [true, 'El ID de ruta es requerido'],
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  origen: {
    type: String,
    required: [true, 'El origen es requerido'],
    trim: true
  },
  paisOrigen: {
    type: String,
    required: [true, 'El país de origen es requerido'],
    trim: true
  },
  destino: {
    type: String,
    required: [true, 'El destino es requerido'],
    trim: true
  },
  paisDestino: {
    type: String,
    required: [true, 'El país de destino es requerido'],
    trim: true
  },
  distancia: {
    type: String,
    trim: true
  },
  duracion: {
    type: String,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['international', 'regional', 'coastal'],
    required: [true, 'El tipo de ruta es requerido']
  },
  estado: {
    type: String,
    enum: ['active', 'pending', 'completed', 'inactive'],
    default: 'active'
  },
  viajesAnio: {
    type: Number,
    min: [0, 'Los viajes por año deben ser mayor o igual a 0'],
    default: 0
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
rutaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

rutaSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Ruta', rutaSchema);

