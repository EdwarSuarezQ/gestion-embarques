import mongoose from 'mongoose';

const tareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    asignado: {
      type: String,
      trim: true,
    },
    fecha: {
      type: String,
      match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato dd/mm/yyyy'],
    },
    prioridad: {
      type: String,
      enum: {
        values: ['high', 'medium', 'low'],
        message: 'La prioridad debe ser: high, medium o low',
      },
    },
    estado: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'El estado debe ser: pending, in-progress o completed',
      },
      default: 'pending',
    },
    departamento: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Tarea', tareaSchema);
