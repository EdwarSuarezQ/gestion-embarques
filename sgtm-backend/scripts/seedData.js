const dotenv = require("dotenv");
dotenv.config();

console.log("🚀 Iniciando seed...");
console.log(
  "🔗 MongoDB URI:",
  process.env.MONGODB_URI || "mongodb://localhost:27017/sgtm"
);

const { connectDB } = require("../src/utils/database");
const User = require("../src/models/User");
const Tarea = require("../src/models/Tarea");

async function seed() {
  try {
    console.log("📡 Conectando a MongoDB...");
    await connectDB(
      process.env.MONGODB_URI || "mongodb://localhost:27017/sgtm"
    );
    console.log("✅ DB conectada para seed");

    console.log("🧹 Limpiando colecciones...");
    await User.deleteMany({});
    await Tarea.deleteMany({});
    console.log("✅ Colecciones limpiadas");

    console.log("👥 Creando usuarios...");
    const admin = new User({
      nombre: "Admin",
      email: "admin@sgtm.test",
      password: "admin123",
      rol: "admin",
    });
    const user = new User({
      nombre: "Usuario",
      email: "user@sgtm.test",
      password: "user123",
      rol: "user",
    });
    await admin.save();
    console.log("✅ Usuario admin creado");
    await user.save();
    console.log("✅ Usuario regular creado");

    console.log("📋 Creando tareas...");
    const tareas = [
      {
        titulo: "Inspección de contenedores peligrosos",
        descripcion: "Revisar contenedores con mercancía clase 3 en muelle 5",
        asignado: "Carlos Martínez",
        fecha: "15/12/2024",
        prioridad: "high",
        estado: "pending",
        departamento: "Operaciones Portuarias",
      },
      {
        titulo: "Limpieza de almacén A",
        descripcion: "",
        asignado: "María Perez",
        fecha: "01/01/2025",
        prioridad: "low",
        estado: "pending",
        departamento: "Almacén",
      },
    ];
    await Tarea.insertMany(tareas);
    console.log("✅ Tareas creadas:", tareas.length);

    console.log("🎉 Seed completado exitosamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:");
    console.error("Mensaje:", err.message);
    console.error("Stack:", err.stack);
    process.exit(1);
  }
}

// Timeout de seguridad (si no termina en 30 segundos)
setTimeout(() => {
  console.error("⏱️ TIMEOUT: El seed tardó más de 30 segundos");
  process.exit(1);
}, 30000);

seed();
