import mongoose from 'mongoose';

const almacenSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    ubicacion: {
      type: String,
      trim: true,
    },
    capacidad: {
      type: Number,
      min: [0, 'La capacidad no puede ser negativa'],
    },
    ocupacion: {
      type: Number,
      min: [0, 'La ocupación no puede ser negativa'],
      max: [100, 'La ocupación no puede ser mayor a 100%'],
    },
    estado: {
      type: String,
      enum: {
        values: ['operativo', 'mantenimiento', 'inoperativo'],
        message: 'El estado debe ser: operativo, mantenimiento o inoperativo',
      },
      default: 'operativo',
    },
    proximoMantenimiento: {
      type: String,
      match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato dd/mm/yyyy'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Almacen', almacenSchema);
