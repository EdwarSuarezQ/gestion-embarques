const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();

const { connectDB } = require("./utils/database");
const apiResponse = require("./utils/apiResponse");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const tareasRoutes = require("./routes/tareas");
const embarquesRoutes = require("./routes/embarques");
const rutasRoutes = require("./routes/rutas");
const facturasRoutes = require("./routes/facturas");
const personalRoutes = require("./routes/personal");
const embarcacionesRoutes = require("./routes/embarcaciones");
const almacenesRoutes = require("./routes/almacenes");

const app = express();

// Connect DB
connectDB(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sgtm")
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// API Routes - TODAS DEBEN ESTAR AQUÍ
app.use("/api/auth", authRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/embarques", embarquesRoutes);
app.use("/api/rutas", rutasRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/embarcaciones", embarcacionesRoutes);
app.use("/api/almacenes", almacenesRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Not found
app.use((req, res) => {
  console.log("❌ Ruta no encontrada:", req.method, req.url);
  apiResponse.notFound(res, "Ruta no encontrada");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
