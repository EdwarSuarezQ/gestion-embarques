import mongoose from 'mongoose';

const rutaSchema = new mongoose.Schema(
  {
    idRuta: {
      type: String,
      required: [true, 'El ID de ruta es obligatorio'],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      trim: true,
    },
    origen: {
      type: String,
      trim: true,
    },
    paisOrigen: {
      type: String,
      trim: true,
    },
    destino: {
      type: String,
      trim: true,
    },
    paisDestino: {
      type: String,
      trim: true,
    },
    distancia: {
      type: String,
      trim: true,
    },
    duracion: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      enum: {
        values: ['international', 'regional', 'coastal'],
        message: 'El tipo debe ser: international, regional o coastal',
      },
    },
    estado: {
      type: String,
      enum: {
        values: ['active', 'pending', 'completed', 'inactive'],
        message: 'El estado debe ser: active, pending, completed o inactive',
      },
      default: 'active',
    },
    viajesAnio: {
      type: Number,
      min: [0, 'Los viajes no pueden ser negativos'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Ruta', rutaSchema);
