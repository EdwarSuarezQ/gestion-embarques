const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  puesto: { type: String, required: true, trim: true },
  departamento: { type: String, required: true, trim: true },
  estado: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PersonalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Personal', PersonalSchema);
