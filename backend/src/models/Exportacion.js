import mongoose from 'mongoose';

const exportacionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
    },
    formato: {
      type: String,
      enum: ['csv', 'json', 'pdf', 'xlsx'],
      required: true,
    },
    filtros: {
      type: mongoose.Schema.Types.Mixed,
    },
    nombreArchivo: {
      type: String,
      required: true,
    },
    rutaArchivo: {
      type: String,
      required: true,
    },
    tamano: {
      type: Number,
    },
    estado: {
      type: String,
      enum: ['completed', 'processing', 'failed'],
      default: 'processing',
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Exportacion', exportacionSchema);
