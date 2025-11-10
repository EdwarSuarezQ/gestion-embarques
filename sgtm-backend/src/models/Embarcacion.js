const mongoose = require('mongoose');

const EmbarcacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  imo: { type: String, trim: true },
  origen: { type: String, trim: true },
  destino: { type: String, trim: true },
  fecha: { type: String, required: true, match: /^\d{2}\/\d{2}\/\d{4}$/ },
  capacidad: { type: String, required: true, trim: true },
  tipo: {
    type: String,
    enum: ['container', 'bulk', 'general', 'tanker'],
    required: true,
  },
  estado: {
    type: String,
    enum: ['pending', 'in-transit', 'in-route', 'in-port'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

EmbarcacionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Embarcacion', EmbarcacionSchema);
