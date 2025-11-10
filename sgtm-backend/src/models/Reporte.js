const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['tareas', 'embarques', 'facturacion', 'personal', 'rutas', 'embarcaciones', 'almacenes']
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  modulo: {
    type: String,
    required: true
  },
  campos: {
    type: [String],
    default: []
  },
  filtros: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  formato: {
    type: String,
    enum: ['csv', 'json', 'pdf', 'xlsx'],
    default: 'csv'
  },
  estado: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  archivo: {
    type: String
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Reporte', reporteSchema);

