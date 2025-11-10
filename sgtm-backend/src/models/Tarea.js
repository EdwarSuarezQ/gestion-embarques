const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  asignado: { type: String, trim: true },
  fecha: { type: String, required: true, match: /^\d{2}\/\d{2}\/\d{4}$/ },
  prioridad: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  estado: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  departamento: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TareaSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tarea', TareaSchema);
