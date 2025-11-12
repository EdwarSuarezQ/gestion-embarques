const mongoose = require('mongoose');

const RutaSchema = new mongoose.Schema({
  idRuta: { type: String, required: true, unique: true, trim: true },
  nombre: { type: String, required: true, trim: true },
  origen: { type: String, required: true, trim: true },
  paisOrigen: { type: String, required: true, trim: true },
  destino: { type: String, required: true, trim: true },
  paisDestino: { type: String, required: true, trim: true },
  distancia: { type: String, trim: true },
  duracion: { type: String, trim: true },
  tipo: {
    type: String,
    enum: ['international', 'regional', 'coastal'],
    required: true,
  },
  estado: {
    type: String,
    enum: ['active', 'pending', 'completed', 'inactive'],
    default: 'active',
  },
  viajesAnio: { type: Number, min: 0, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RutaSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ruta', RutaSchema);
