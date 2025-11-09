import mongoose from 'mongoose';

const embarqueSchema = new mongoose.Schema(
  {
    idEmbarque: {
      type: String,
      required: [true, 'El ID de embarque es obligatorio'],
      unique: true,
      trim: true,
    },
    buque: {
      type: String,
      trim: true,
    },
    imo: {
      type: String,
      trim: true,
    },
    origen: {
      type: String,
      trim: true,
    },
    destino: {
      type: String,
      trim: true,
    },
    fechaEstimada: {
      type: String,
      match: [
        /^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/,
        'La fecha debe tener el formato dd/mm/yyyy - HH:mm',
      ],
    },
    teus: {
      type: Number,
      min: [0, 'Los TEUs no pueden ser negativos'],
    },
    tipoCarga: {
      type: String,
      enum: {
        values: ['container', 'bulk', 'liquid', 'vehicles'],
        message: 'El tipo de carga debe ser: container, bulk, liquid o vehicles',
      },
    },
    estado: {
      type: String,
      enum: {
        values: ['pending', 'in-transit', 'loading', 'unloading', 'completed'],
        message: 'El estado debe ser: pending, in-transit, loading, unloading o completed',
      },
      default: 'pending',
    },
    distancia: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Embarque', embarqueSchema);
