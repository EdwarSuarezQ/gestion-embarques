import mongoose from 'mongoose';

const personalSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'El email debe tener un formato válido'],
      trim: true,
      lowercase: true,
    },
    puesto: {
      type: String,
      trim: true,
    },
    departamento: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'El estado debe ser: active o inactive',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Personal', personalSchema);
