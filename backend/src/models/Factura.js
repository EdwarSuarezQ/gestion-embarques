import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema(
  {
    idFactura: {
      type: String,
      required: [true, 'El ID de factura es obligatorio'],
      unique: true,
      trim: true,
    },
    cliente: {
      type: String,
      trim: true,
    },
    fechaEmision: {
      type: String,
      match: [/^\d{2}\/\d{2}\/\d{4}$/, 'La fecha debe tener el formato dd/mm/yyyy'],
    },
    monto: {
      type: Number,
      min: [0, 'El monto no puede ser negativo'],
    },
    estado: {
      type: String,
      enum: {
        values: ['paid', 'pending', 'overdue', 'cancelled'],
        message: 'El estado debe ser: paid, pending, overdue o cancelled',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Factura', facturaSchema);
