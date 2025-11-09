import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/database.js';
import Tarea from '../src/models/Tarea.js';
import Embarque from '../src/models/Embarque.js';
import Ruta from '../src/models/Ruta.js';
import Factura from '../src/models/Factura.js';
import Personal from '../src/models/Personal.js';
import Embarcacion from '../src/models/Embarcacion.js';
import Almacen from '../src/models/Almacen.js';
import User from '../src/models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar colecciones
    await Tarea.deleteMany({});
    await Embarque.deleteMany({});
    await Ruta.deleteMany({});
    await Factura.deleteMany({});
    await Personal.deleteMany({});
    await Embarcacion.deleteMany({});
    await Almacen.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️  Colecciones limpiadas');

    // Crear usuarios
    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@sgtm.com',
      password: 'admin123',
      rol: 'admin',
    });

    const user = await User.create({
      nombre: 'Usuario Test',
      email: 'user@sgtm.com',
      password: 'user123',
      rol: 'user',
    });

    console.log('✅ Usuarios creados');

    // Crear tareas
    const tareas = await Tarea.insertMany([
      {
        titulo: 'Inspección de contenedores',
        descripcion: 'Realizar inspección de seguridad en contenedores del buque MSC Oscar',
        asignado: 'Juan Pérez',
        fecha: '15/12/2024',
        prioridad: 'high',
        estado: 'in-progress',
        departamento: 'Operaciones',
      },
      {
        titulo: 'Actualización de documentación',
        descripcion: 'Actualizar documentos de embarque para ruta Buenaventura-Cartagena',
        asignado: 'María González',
        fecha: '16/12/2024',
        prioridad: 'medium',
        estado: 'pending',
        departamento: 'Administración',
      },
      {
        titulo: 'Mantenimiento de grúas',
        descripcion: 'Revisión y mantenimiento preventivo de grúas del muelle 3',
        asignado: 'Carlos Rodríguez',
        fecha: '14/12/2024',
        prioridad: 'high',
        estado: 'completed',
        departamento: 'Mantenimiento',
      },
      {
        titulo: 'Coordinación de carga',
        descripcion: 'Coordinar carga de productos químicos en buque Evergreen',
        asignado: 'Ana Martínez',
        fecha: '17/12/2024',
        prioridad: 'high',
        estado: 'pending',
        departamento: 'Operaciones',
      },
      {
        titulo: 'Revisión de facturas',
        descripcion: 'Revisar y validar facturas del mes de noviembre',
        asignado: 'Luis Sánchez',
        fecha: '18/12/2024',
        prioridad: 'medium',
        estado: 'pending',
        departamento: 'Contabilidad',
      },
    ]);

    console.log('✅ Tareas creadas');

    // Crear embarques
    const embarques = await Embarque.insertMany([
      {
        idEmbarque: 'EMB-2024-001',
        buque: 'MSC Oscar',
        imo: '9703318',
        origen: 'Buenaventura',
        destino: 'Cartagena',
        fechaEstimada: '20/12/2024 - 08:30',
        teus: 4500,
        tipoCarga: 'container',
        estado: 'in-transit',
        distancia: '350 nm',
      },
      {
        idEmbarque: 'EMB-2024-002',
        buque: 'Evergreen A-class',
        imo: '9811000',
        origen: 'Buenaventura',
        destino: 'Panamá',
        fechaEstimada: '22/12/2024 - 14:00',
        teus: 6800,
        tipoCarga: 'container',
        estado: 'loading',
        distancia: '520 nm',
      },
      {
        idEmbarque: 'EMB-2024-003',
        buque: 'CMA CGM Marco Polo',
        imo: '9454438',
        origen: 'Buenaventura',
        destino: 'Los Angeles',
        fechaEstimada: '25/12/2024 - 10:00',
        teus: 12000,
        tipoCarga: 'container',
        estado: 'pending',
        distancia: '3200 nm',
      },
      {
        idEmbarque: 'EMB-2024-004',
        buque: 'Bulk Carrier Alpha',
        imo: '9123456',
        origen: 'Buenaventura',
        destino: 'Shanghai',
        fechaEstimada: '28/12/2024 - 16:30',
        teus: 0,
        tipoCarga: 'bulk',
        estado: 'pending',
        distancia: '8500 nm',
      },
      {
        idEmbarque: 'EMB-2024-005',
        buque: 'Tanker Beta',
        imo: '9234567',
        origen: 'Buenaventura',
        destino: 'Rotterdam',
        fechaEstimada: '30/12/2024 - 12:00',
        teus: 0,
        tipoCarga: 'liquid',
        estado: 'pending',
        distancia: '5200 nm',
      },
    ]);

    console.log('✅ Embarques creados');

    // Crear rutas
    const rutas = await Ruta.insertMany([
      {
        idRuta: 'RUT-001',
        nombre: 'Buenaventura - Cartagena',
        origen: 'Buenaventura',
        paisOrigen: 'Colombia',
        destino: 'Cartagena',
        paisDestino: 'Colombia',
        distancia: '350 nm',
        duracion: '2 días',
        tipo: 'coastal',
        estado: 'active',
        viajesAnio: 156,
      },
      {
        idRuta: 'RUT-002',
        nombre: 'Buenaventura - Panamá',
        origen: 'Buenaventura',
        paisOrigen: 'Colombia',
        destino: 'Panamá',
        paisDestino: 'Panamá',
        distancia: '520 nm',
        duracion: '3 días',
        tipo: 'regional',
        estado: 'active',
        viajesAnio: 98,
      },
      {
        idRuta: 'RUT-003',
        nombre: 'Buenaventura - Los Angeles',
        origen: 'Buenaventura',
        paisOrigen: 'Colombia',
        destino: 'Los Angeles',
        paisDestino: 'Estados Unidos',
        distancia: '3200 nm',
        duracion: '18 días',
        tipo: 'international',
        estado: 'active',
        viajesAnio: 45,
      },
      {
        idRuta: 'RUT-004',
        nombre: 'Buenaventura - Shanghai',
        origen: 'Buenaventura',
        paisOrigen: 'Colombia',
        destino: 'Shanghai',
        paisDestino: 'China',
        distancia: '8500 nm',
        duracion: '35 días',
        tipo: 'international',
        estado: 'active',
        viajesAnio: 24,
      },
      {
        idRuta: 'RUT-005',
        nombre: 'Buenaventura - Rotterdam',
        origen: 'Buenaventura',
        paisOrigen: 'Colombia',
        destino: 'Rotterdam',
        paisDestino: 'Países Bajos',
        distancia: '5200 nm',
        duracion: '22 días',
        tipo: 'international',
        estado: 'active',
        viajesAnio: 32,
      },
    ]);

    console.log('✅ Rutas creadas');

    // Crear facturas
    const facturas = await Factura.insertMany([
      {
        idFactura: 'FAC-2024-001',
        cliente: 'Importadora ABC S.A.',
        fechaEmision: '01/12/2024',
        monto: 125000000,
        estado: 'paid',
      },
      {
        idFactura: 'FAC-2024-002',
        cliente: 'Exportadora XYZ Ltda.',
        fechaEmision: '05/12/2024',
        monto: 87500000,
        estado: 'pending',
      },
      {
        idFactura: 'FAC-2024-003',
        cliente: 'Comercializadora Global',
        fechaEmision: '10/12/2024',
        monto: 210000000,
        estado: 'paid',
      },
      {
        idFactura: 'FAC-2024-004',
        cliente: 'Transportes Marítimos S.A.',
        fechaEmision: '12/12/2024',
        monto: 156000000,
        estado: 'overdue',
      },
      {
        idFactura: 'FAC-2024-005',
        cliente: 'Logística Internacional',
        fechaEmision: '15/12/2024',
        monto: 98000000,
        estado: 'pending',
      },
    ]);

    console.log('✅ Facturas creadas');

    // Crear personal
    const personal = await Personal.insertMany([
      {
        nombre: 'Juan Pérez',
        email: 'juan.perez@sgtm.com',
        puesto: 'Supervisor de Operaciones',
        departamento: 'Operaciones',
        estado: 'active',
      },
      {
        nombre: 'María González',
        email: 'maria.gonzalez@sgtm.com',
        puesto: 'Administradora',
        departamento: 'Administración',
        estado: 'active',
      },
      {
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@sgtm.com',
        puesto: 'Técnico de Mantenimiento',
        departamento: 'Mantenimiento',
        estado: 'active',
      },
      {
        nombre: 'Ana Martínez',
        email: 'ana.martinez@sgtm.com',
        puesto: 'Coordinadora de Carga',
        departamento: 'Operaciones',
        estado: 'active',
      },
      {
        nombre: 'Luis Sánchez',
        email: 'luis.sanchez@sgtm.com',
        puesto: 'Contador',
        departamento: 'Contabilidad',
        estado: 'active',
      },
      {
        nombre: 'Pedro López',
        email: 'pedro.lopez@sgtm.com',
        puesto: 'Operador de Grúa',
        departamento: 'Operaciones',
        estado: 'active',
      },
    ]);

    console.log('✅ Personal creado');

    // Crear embarcaciones
    const embarcaciones = await Embarcacion.insertMany([
      {
        nombre: 'MSC Oscar',
        imo: '9703318',
        origen: 'Buenaventura',
        destino: 'Cartagena',
        fecha: '20/12/2024',
        capacidad: '19,224 TEU',
        tipo: 'container',
        estado: 'in-transit',
      },
      {
        nombre: 'Evergreen A-class',
        imo: '9811000',
        origen: 'Buenaventura',
        destino: 'Panamá',
        fecha: '22/12/2024',
        capacidad: '20,388 TEU',
        tipo: 'container',
        estado: 'in-route',
      },
      {
        nombre: 'Bulk Carrier Alpha',
        imo: '9123456',
        origen: 'Buenaventura',
        destino: 'Shanghai',
        fecha: '28/12/2024',
        capacidad: '80,000 DWT',
        tipo: 'bulk',
        estado: 'pending',
      },
      {
        nombre: 'Tanker Beta',
        imo: '9234567',
        origen: 'Buenaventura',
        destino: 'Rotterdam',
        fecha: '30/12/2024',
        capacidad: '150,000 DWT',
        tipo: 'tanker',
        estado: 'pending',
      },
    ]);

    console.log('✅ Embarcaciones creadas');

    // Crear almacenes
    const almacenes = await Almacen.insertMany([
      {
        nombre: 'Almacén Principal',
        ubicacion: 'Muelle 1 - Zona A',
        capacidad: 5000,
        ocupacion: 75,
        estado: 'operativo',
        proximoMantenimiento: '15/01/2025',
      },
      {
        nombre: 'Almacén Secundario',
        ubicacion: 'Muelle 2 - Zona B',
        capacidad: 3500,
        ocupacion: 60,
        estado: 'operativo',
        proximoMantenimiento: '20/01/2025',
      },
      {
        nombre: 'Almacén de Contenedores Refrigerados',
        ubicacion: 'Muelle 3 - Zona C',
        capacidad: 2000,
        ocupacion: 45,
        estado: 'operativo',
        proximoMantenimiento: '10/02/2025',
      },
      {
        nombre: 'Almacén Temporal',
        ubicacion: 'Muelle 4 - Zona D',
        capacidad: 1500,
        ocupacion: 90,
        estado: 'mantenimiento',
        proximoMantenimiento: '05/01/2025',
      },
    ]);

    console.log('✅ Almacenes creados');

    console.log('\n🎉 Datos de prueba creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Usuarios: 2`);
    console.log(`   - Tareas: ${tareas.length}`);
    console.log(`   - Embarques: ${embarques.length}`);
    console.log(`   - Rutas: ${rutas.length}`);
    console.log(`   - Facturas: ${facturas.length}`);
    console.log(`   - Personal: ${personal.length}`);
    console.log(`   - Embarcaciones: ${embarcaciones.length}`);
    console.log(`   - Almacenes: ${almacenes.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error);
    process.exit(1);
  }
};

seedData();
