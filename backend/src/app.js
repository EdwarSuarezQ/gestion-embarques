import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import tareasRoutes from './routes/tareas.js';
import embarquesRoutes from './routes/embarques.js';
import rutasRoutes from './routes/rutas.js';
import facturasRoutes from './routes/facturas.js';
import personalRoutes from './routes/personal.js';
import embarcacionesRoutes from './routes/embarcaciones.js';
import almacenesRoutes from './routes/almacenes.js';
import estadisticasRoutes from './routes/estadisticas.js';
import exportarRoutes from './routes/exportar.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
});

app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rutas
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SGTM Backend está funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/embarques', embarquesRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/embarcaciones', embarcacionesRoutes);
app.use('/api/almacenes', almacenesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/exportar', exportarRoutes);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API disponible en: http://localhost:${PORT}/api`);
});

export default app;
