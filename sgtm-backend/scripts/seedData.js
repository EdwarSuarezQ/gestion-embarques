require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const User = require('../src/models/User');
const Tarea = require('../src/models/Tarea');
const Embarque = require('../src/models/Embarque');
const Ruta = require('../src/models/Ruta');
const Factura = require('../src/models/Factura');
const Personal = require('../src/models/Personal');
const Embarcacion = require('../src/models/Embarcacion');
const Almacen = require('../src/models/Almacen');

// Conectar a la base de datos
connectDB();

const seedData = async () => {
  try {
    // Limpiar datos existentes
    await User.deleteMany({});
    await Tarea.deleteMany({});
    await Embarque.deleteMany({});
    await Ruta.deleteMany({});
    await Factura.deleteMany({});
    await Personal.deleteMany({});
    await Embarcacion.deleteMany({});
    await Almacen.deleteMany({});

    console.log('Datos anteriores eliminados...');

    // Crear usuarios
    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@sgtm.com',
      password: 'admin123',
      rol: 'admin',
      estado: 'active'
    });

    const user = await User.create({
      nombre: 'Usuario Test',
      email: 'user@sgtm.com',
      password: 'user123',
      rol: 'user',
      estado: 'active'
    });

    console.log('Usuarios creados...');

    // Crear tareas
    const tareas = await Tarea.insertMany([
      {
        titulo: 'Inspección de contenedores peligrosos',
        descripcion: 'Revisar contenedores con mercancía clase 3 en muelle 5',
        asignado: 'Carlos Martínez',
        fecha: '15/12/2024',
        prioridad: 'high',
        estado: 'pending',
        departamento: 'Operaciones Portuarias'
      },
      {
        titulo: 'Revisión de documentación de embarque',
        descripcion: 'Verificar toda la documentación del embarque EMB-2024-001',
        asignado: 'Ana García',
        fecha: '16/12/2024',
        prioridad: 'medium',
        estado: 'in-progress',
        departamento: 'Documentación'
      },
      {
        titulo: 'Mantenimiento preventivo de grúas',
        descripcion: 'Realizar mantenimiento preventivo en grúas del muelle 3',
        asignado: 'Luis Rodríguez',
        fecha: '14/12/2024',
        prioridad: 'high',
        estado: 'completed',
        departamento: 'Mantenimiento'
      },
      {
        titulo: 'Coordinación con aduanas',
        descripcion: 'Coordinar proceso de desaduanamiento para próximo embarque',
        asignado: 'María López',
        fecha: '17/12/2024',
        prioridad: 'medium',
        estado: 'pending',
        departamento: 'Aduanas'
      },
      {
        titulo: 'Capacitación de personal nuevo',
        descripcion: 'Capacitar personal nuevo en procedimientos de seguridad',
        asignado: 'Pedro Sánchez',
        fecha: '18/12/2024',
        prioridad: 'low',
        estado: 'pending',
        departamento: 'Recursos Humanos'
      }
    ]);

    console.log('Tareas creadas...');

    // Crear embarques
    const embarques = await Embarque.insertMany([
      {
        idEmbarque: 'EMB-2024-001',
        buque: 'MSC GINA',
        imo: '9456789',
        origen: 'Shanghai, China',
        destino: 'Buenaventura, Colombia',
        fechaEstimada: '20/12/2024 - 08:30',
        teus: 15000,
        tipoCarga: 'container',
        estado: 'in-transit',
        distancia: '7,500 nm'
      },
      {
        idEmbarque: 'EMB-2024-002',
        buque: 'CMA CGM MARCO POLO',
        imo: '9456790',
        origen: 'Rotterdam, Países Bajos',
        destino: 'Cartagena, Colombia',
        fechaEstimada: '22/12/2024 - 14:00',
        teus: 18000,
        tipoCarga: 'container',
        estado: 'loading',
        distancia: '4,200 nm'
      },
      {
        idEmbarque: 'EMB-2024-003',
        buque: 'EVERGREEN ACE',
        imo: '9456791',
        origen: 'Los Angeles, USA',
        destino: 'Buenaventura, Colombia',
        fechaEstimada: '25/12/2024 - 10:00',
        teus: 12000,
        tipoCarga: 'container',
        estado: 'pending',
        distancia: '2,800 nm'
      },
      {
        idEmbarque: 'EMB-2024-004',
        buque: 'MAERSK MADRID',
        imo: '9456792',
        origen: 'Valencia, España',
        destino: 'Buenaventura, Colombia',
        fechaEstimada: '18/12/2024 - 16:30',
        teus: 9000,
        tipoCarga: 'container',
        estado: 'completed',
        distancia: '4,500 nm'
      }
    ]);

    console.log('Embarques creados...');

    // Crear rutas
    const rutas = await Ruta.insertMany([
      {
        idRuta: 'RUT-001',
        nombre: 'Ruta Asia-Pacífico',
        origen: 'Shanghai',
        paisOrigen: 'China',
        destino: 'Buenaventura',
        paisDestino: 'Colombia',
        distancia: '7,500 nm',
        duracion: '25 días',
        tipo: 'international',
        estado: 'active',
        viajesAnio: 12
      },
      {
        idRuta: 'RUT-002',
        nombre: 'Ruta Europa-Atlántico',
        origen: 'Rotterdam',
        paisOrigen: 'Países Bajos',
        destino: 'Cartagena',
        paisDestino: 'Colombia',
        distancia: '4,200 nm',
        duracion: '15 días',
        tipo: 'international',
        estado: 'active',
        viajesAnio: 8
      },
      {
        idRuta: 'RUT-003',
        nombre: 'Ruta Pacífico Este',
        origen: 'Los Angeles',
        paisOrigen: 'USA',
        destino: 'Buenaventura',
        paisDestino: 'Colombia',
        distancia: '2,800 nm',
        duracion: '10 días',
        tipo: 'regional',
        estado: 'active',
        viajesAnio: 24
      },
      {
        idRuta: 'RUT-004',
        nombre: 'Ruta Costera Colombia',
        origen: 'Cartagena',
        paisOrigen: 'Colombia',
        destino: 'Buenaventura',
        paisDestino: 'Colombia',
        distancia: '450 nm',
        duracion: '3 días',
        tipo: 'coastal',
        estado: 'active',
        viajesAnio: 36
      }
    ]);

    console.log('Rutas creadas...');

    // Crear facturas
    const facturas = await Factura.insertMany([
      {
        idFactura: 'FAC-2024-001',
        cliente: 'Importadora ABC S.A.',
        fechaEmision: '01/12/2024',
        monto: 15000000,
        estado: 'paid'
      },
      {
        idFactura: 'FAC-2024-002',
        cliente: 'Exportadora XYZ Ltda.',
        fechaEmision: '05/12/2024',
        monto: 23000000,
        estado: 'pending'
      },
      {
        idFactura: 'FAC-2024-003',
        cliente: 'Comercializadora DEF S.A.S.',
        fechaEmision: '10/12/2024',
        monto: 18500000,
        estado: 'pending'
      },
      {
        idFactura: 'FAC-2024-004',
        cliente: 'Distribuidora GHI S.A.',
        fechaEmision: '15/11/2024',
        monto: 12000000,
        estado: 'overdue'
      },
      {
        idFactura: 'FAC-2024-005',
        cliente: 'Logística JKL Ltda.',
        fechaEmision: '12/12/2024',
        monto: 9500000,
        estado: 'paid'
      }
    ]);

    console.log('Facturas creadas...');

    // Crear personal
    const personal = await Personal.insertMany([
      {
        nombre: 'Carlos Martínez',
        email: 'carlos.martinez@sgtm.com',
        puesto: 'Supervisor de Operaciones',
        departamento: 'Operaciones Portuarias',
        estado: 'active'
      },
      {
        nombre: 'Ana García',
        email: 'ana.garcia@sgtm.com',
        puesto: 'Especialista en Documentación',
        departamento: 'Documentación',
        estado: 'active'
      },
      {
        nombre: 'Luis Rodríguez',
        email: 'luis.rodriguez@sgtm.com',
        puesto: 'Técnico de Mantenimiento',
        departamento: 'Mantenimiento',
        estado: 'active'
      },
      {
        nombre: 'María López',
        email: 'maria.lopez@sgtm.com',
        puesto: 'Coordinadora de Aduanas',
        departamento: 'Aduanas',
        estado: 'active'
      },
      {
        nombre: 'Pedro Sánchez',
        email: 'pedro.sanchez@sgtm.com',
        puesto: 'Gerente de Recursos Humanos',
        departamento: 'Recursos Humanos',
        estado: 'active'
      },
      {
        nombre: 'Laura Fernández',
        email: 'laura.fernandez@sgtm.com',
        puesto: 'Analista Financiero',
        departamento: 'Finanzas',
        estado: 'active'
      }
    ]);

    console.log('Personal creado...');

    // Crear embarcaciones
    const embarcaciones = await Embarcacion.insertMany([
      {
        nombre: 'MSC GINA',
        imo: '9456789',
        origen: 'Shanghai, China',
        destino: 'Buenaventura, Colombia',
        fecha: '20/12/2024',
        capacidad: '15,000 TEUs',
        tipo: 'container',
        estado: 'in-transit'
      },
      {
        nombre: 'CMA CGM MARCO POLO',
        imo: '9456790',
        origen: 'Rotterdam, Países Bajos',
        destino: 'Cartagena, Colombia',
        fecha: '22/12/2024',
        capacidad: '18,000 TEUs',
        tipo: 'container',
        estado: 'in-port'
      },
      {
        nombre: 'EVERGREEN ACE',
        imo: '9456791',
        origen: 'Los Angeles, USA',
        destino: 'Buenaventura, Colombia',
        fecha: '25/12/2024',
        capacidad: '12,000 TEUs',
        tipo: 'container',
        estado: 'in-route'
      },
      {
        nombre: 'BULK CARRIER ALPHA',
        imo: '9456793',
        origen: 'Buenos Aires, Argentina',
        destino: 'Buenaventura, Colombia',
        fecha: '19/12/2024',
        capacidad: '50,000 toneladas',
        tipo: 'bulk',
        estado: 'in-transit'
      }
    ]);

    console.log('Embarcaciones creadas...');

    // Crear almacenes
    const almacenes = await Almacen.insertMany([
      {
        nombre: 'Almacén Principal',
        ubicacion: 'Muelle 1 - Buenaventura',
        capacidad: 50000,
        ocupacion: 75,
        estado: 'operativo',
        proximoMantenimiento: '15/01/2025'
      },
      {
        nombre: 'Almacén Secundario',
        ubicacion: 'Muelle 2 - Buenaventura',
        capacidad: 30000,
        ocupacion: 45,
        estado: 'operativo',
        proximoMantenimiento: '20/02/2025'
      },
      {
        nombre: 'Almacén de Contenedores',
        ubicacion: 'Muelle 3 - Buenaventura',
        capacidad: 80000,
        ocupacion: 90,
        estado: 'operativo',
        proximoMantenimiento: '10/01/2025'
      },
      {
        nombre: 'Almacén en Mantenimiento',
        ubicacion: 'Muelle 4 - Buenaventura',
        capacidad: 25000,
        ocupacion: 0,
        estado: 'mantenimiento',
        proximoMantenimiento: '05/01/2025'
      }
    ]);

    console.log('Almacenes creados...');

    console.log('\n✅ Datos de prueba creados exitosamente!');
    console.log('\nUsuarios de prueba:');
    console.log('  Admin: admin@sgtm.com / admin123');
    console.log('  User:  user@sgtm.com / user123');
    console.log('\nTotal de registros:');
    console.log(`  Tareas: ${tareas.length}`);
    console.log(`  Embarques: ${embarques.length}`);
    console.log(`  Rutas: ${rutas.length}`);
    console.log(`  Facturas: ${facturas.length}`);
    console.log(`  Personal: ${personal.length}`);
    console.log(`  Embarcaciones: ${embarcaciones.length}`);
    console.log(`  Almacenes: ${almacenes.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error al crear datos de prueba:', error);
    process.exit(1);
  }
};

seedData();

