import mongoose from 'mongoose';

const embarcacionSchema = new mongoose.Schema(
  {
    nombre: {
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
    fecha: {
      type: String,
      match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato dd/mm/yyyy'],
    },
    capacidad: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      enum: {
        values: ['container', 'bulk', 'general', 'tanker'],
        message: 'El tipo debe ser: container, bulk, general o tanker',
      },
    },
    estado: {
      type: String,
      enum: {
        values: ['pending', 'in-transit', 'in-route', 'in-port'],
        message: 'El estado debe ser: pending, in-transit, in-route o in-port',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Embarcacion', embarcacionSchema);
