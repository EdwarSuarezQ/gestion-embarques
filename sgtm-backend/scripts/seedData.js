const dotenv = require('dotenv');
dotenv.config();
const { connectDB } = require('../src/utils/database');
const User = require('../src/models/User');
const Tarea = require('../src/models/Tarea');

async function seed() {
  await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/sgtm');
  console.log('DB conectada para seed');

  // limpiar colecciones básicas
  await User.deleteMany({});
  await Tarea.deleteMany({});

  const admin = new User({
    nombre: 'Admin',
    email: 'admin@sgtm.test',
    password: 'admin123',
    rol: 'admin',
  });
  const user = new User({
    nombre: 'Usuario',
    email: 'user@sgtm.test',
    password: 'user123',
    rol: 'user',
  });
  await admin.save();
  await user.save();

  const tareas = [
    {
      titulo: 'Inspección de contenedores peligrosos',
      descripcion: 'Revisar contenedores con mercancía clase 3 en muelle 5',
      asignado: 'Carlos Martínez',
      fecha: '15/12/2024',
      prioridad: 'high',
      estado: 'pending',
      departamento: 'Operaciones Portuarias',
    },
    {
      titulo: 'Limpieza de almacén A',
      descripcion: '',
      asignado: 'María Perez',
      fecha: '01/01/2025',
      prioridad: 'low',
      estado: 'pending',
      departamento: 'Almacén',
    },
  ];
  await Tarea.insertMany(tareas);

  console.log('Seed completado');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
