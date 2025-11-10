const mongoose = require('mongoose');

const exportacionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true
  },
  formato: {
    type: String,
    enum: ['csv', 'json', 'pdf', 'xlsx'],
    required: true
  },
  modulo: {
    type: String,
    required: true
  },
  filtros: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  estado: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  archivo: {
    type: String
  },
  rutaArchivo: {
    type: String
  },
  tamano: {
    type: Number
  },
  error: {
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

module.exports = mongoose.model('Exportacion', exportacionSchema);

