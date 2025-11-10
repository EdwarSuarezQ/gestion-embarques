const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const corsOptions = require('./config/cors');
const routes = require('./routes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middleware de seguridad y configuración
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // límite de 100 requests
});
app.use('/api/', limiter);

// Rutas
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SGTM Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tareas: '/api/tareas',
      embarques: '/api/embarques',
      rutas: '/api/rutas',
      facturas: '/api/facturas',
      personal: '/api/personal',
      embarcaciones: '/api/embarcaciones',
      almacenes: '/api/almacenes',
      estadisticas: '/api/estadisticas',
      exportar: '/api/exportar'
    }
  });
});

// Manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

