const mongoose = require('mongoose');

const EmbarqueSchema = new mongoose.Schema({
  idEmbarque: { type: String, required: true, unique: true, trim: true },
  buque: { type: String, required: true, trim: true },
  imo: { type: String, trim: true },
  origen: { type: String, required: true, trim: true },
  destino: { type: String, required: true, trim: true },
  fechaEstimada: {
    type: String,
    required: true,
    match: /^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/,
  },
  teus: { type: Number, min: 0, required: true },
  tipoCarga: {
    type: String,
    enum: ['container', 'bulk', 'liquid', 'vehicles'],
    required: true,
  },
  estado: {
    type: String,
    enum: ['pending', 'in-transit', 'loading', 'unloading', 'completed'],
    default: 'pending',
  },
  distancia: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

EmbarqueSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Embarque', EmbarqueSchema);
