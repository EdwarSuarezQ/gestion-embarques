# SGTM Backend - Sistema de Gestión de Transporte Marítimo

Backend completo desarrollado con Node.js, Express.js y MongoDB para el Sistema de Gestión de Transporte Marítimo (SGTM).

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Modelos de Datos](#modelos-de-datos)
- [Ejemplos de Uso](#ejemplos-de-uso)

## ✨ Características

- ✅ API RESTful completa
- ✅ Autenticación JWT
- ✅ Validación de datos con express-validator
- ✅ Paginación y filtros avanzados
- ✅ Sistema de estadísticas completo
- ✅ Exportación multi-formato (CSV, JSON, PDF, Excel)
- ✅ Manejo centralizado de errores
- ✅ Rate limiting
- ✅ Logging de requests
- ✅ Compresión de respuestas
- ✅ CORS configurado

## 🛠 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **express-validator** - Validación de datos
- **csv-writer** - Exportación CSV
- **ExcelJS** - Exportación Excel
- **PDFKit** - Exportación PDF

## 📦 Instalación

1. Clonar el repositorio
```bash
cd backend
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Editar `.env` con tus configuraciones

5. Iniciar MongoDB (asegúrate de tener MongoDB corriendo)

6. Ejecutar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

7. (Opcional) Cargar datos de prueba
```bash
npm run seed
```

## ⚙️ Configuración

### Variables de Entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/sgtm

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5500
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── models/          # Modelos Mongoose
│   ├── controllers/      # Controladores
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middlewares
│   ├── services/         # Servicios de negocio
│   ├── utils/            # Utilidades
│   ├── config/           # Configuración
│   └── app.js            # Aplicación principal
├── scripts/
│   └── seedData.js       # Script de datos de prueba
├── uploads/              # Archivos exportados
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Obtener Usuario Actual
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Tareas

#### Listar Tareas
```http
GET /api/tareas?page=1&limit=10&estado=pending&prioridad=high
Authorization: Bearer <token>
```

#### Obtener Tarea por ID
```http
GET /api/tareas/:id
Authorization: Bearer <token>
```

#### Crear Tarea
```http
POST /api/tareas
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Inspección de contenedores",
  "descripcion": "Realizar inspección de seguridad",
  "asignado": "Juan Pérez",
  "fecha": "15/12/2024",
  "prioridad": "high",
  "estado": "pending",
  "departamento": "Operaciones"
}
```

#### Actualizar Tarea
```http
PUT /api/tareas/:id
PATCH /api/tareas/:id
Authorization: Bearer <token>
```

#### Eliminar Tarea
```http
DELETE /api/tareas/:id
Authorization: Bearer <token>
```

#### Estadísticas de Tareas
```http
GET /api/tareas/estadisticas
Authorization: Bearer <token>
```

### Embarques

#### Listar Embarques
```http
GET /api/embarques?page=1&limit=10&estado=in-transit&tipoCarga=container
Authorization: Bearer <token>
```

#### Endpoints Especializados
```http
GET /api/embarques/estado/:estado
GET /api/embarques/tipo/:tipo
GET /api/embarques/buque/:nombre
GET /api/embarques/estadisticas
```

#### Crear Embarque
```http
POST /api/embarques
Authorization: Bearer <token>
Content-Type: application/json

{
  "idEmbarque": "EMB-2024-001",
  "buque": "MSC Oscar",
  "imo": "9703318",
  "origen": "Buenaventura",
  "destino": "Cartagena",
  "fechaEstimada": "20/12/2024 - 08:30",
  "teus": 4500,
  "tipoCarga": "container",
  "estado": "in-transit",
  "distancia": "350 nm"
}
```

### Rutas

#### Listar Rutas
```http
GET /api/rutas?page=1&limit=10&estado=active&tipo=international
Authorization: Bearer <token>
```

#### Endpoints Especializados
```http
GET /api/rutas/activas
GET /api/rutas/tipo/:tipo
GET /api/rutas/origen/:ciudad
GET /api/rutas/estadisticas
```

### Facturas

#### Listar Facturas
```http
GET /api/facturas?page=1&limit=10&estado=pending
Authorization: Bearer <token>
```

#### Endpoints Especializados
```http
GET /api/facturas/estado/:estado
GET /api/facturas/cliente/:nombre
PUT /api/facturas/:id/pagar
GET /api/facturas/estadisticas
```

### Personal

#### Listar Personal
```http
GET /api/personal?page=1&limit=10&estado=active&departamento=Operaciones
Authorization: Bearer <token>
```

#### Endpoints Especializados
```http
GET /api/personal/activos
GET /api/personal/departamento/:depto
PUT /api/personal/:id/estado
GET /api/personal/estadisticas
```

### Embarcaciones

#### Listar Embarcaciones
```http
GET /api/embarcaciones?page=1&limit=10&estado=in-transit&tipo=container
Authorization: Bearer <token>
```

### Almacenes

#### Listar Almacenes
```http
GET /api/almacenes?page=1&limit=10&estado=operativo
Authorization: Bearer <token>
```

#### Endpoints Especializados
```http
GET /api/almacenes/ocupacion/:nivel
GET /api/almacenes/mantenimiento/proximos
GET /api/almacenes/estado/:estado
GET /api/almacenes/estadisticas
```

### Estadísticas

#### Estadísticas Generales
```http
GET /api/estadisticas/generales
Authorization: Bearer <token>
```

#### Distribución por Estados
```http
GET /api/estadisticas/distribucion
Authorization: Bearer <token>
```

#### Indicadores de Rendimiento (KPIs)
```http
GET /api/estadisticas/indicadores
Authorization: Bearer <token>
```

#### Estadísticas Filtradas
```http
GET /api/estadisticas/filtradas?fechaInicio=2024-01-01&fechaFin=2024-12-31
Authorization: Bearer <token>
```

### Exportación

#### Obtener Tipos de Reporte
```http
GET /api/exportar/tipos
Authorization: Bearer <token>
```

#### Generar Reporte
```http
POST /api/exportar/generar
Authorization: Bearer <token>
Content-Type: application/json

{
  "tipo": "embarques",
  "formato": "csv",
  "filtros": {
    "estado": "in-transit"
  }
}
```

#### Exportación Múltiple
```http
POST /api/exportar/multiple
Authorization: Bearer <token>
Content-Type: application/json

{
  "tipos": ["embarques", "facturas"],
  "formato": "xlsx",
  "filtros": {}
}
```

#### Historial de Exportaciones
```http
GET /api/exportar/historial?page=1&limit=10
Authorization: Bearer <token>
```

#### Descargar Archivo Exportado
```http
GET /api/exportar/descargar/:id
Authorization: Bearer <token>
```

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/register` y `/api/auth/login`) requieren autenticación mediante JWT.

### Uso del Token

Incluir el token en el header de la petición:

```http
Authorization: Bearer <tu_token_jwt>
```

### Respuesta de Autenticación

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📊 Modelos de Datos

### Tarea
```javascript
{
  titulo: String (required),
  descripcion: String,
  asignado: String,
  fecha: String (dd/mm/yyyy),
  prioridad: "high" | "medium" | "low",
  estado: "pending" | "in-progress" | "completed",
  departamento: String
}
```

### Embarque
```javascript
{
  idEmbarque: String (required, unique),
  buque: String,
  imo: String,
  origen: String,
  destino: String,
  fechaEstimada: String (dd/mm/yyyy - HH:mm),
  teus: Number (min: 0),
  tipoCarga: "container" | "bulk" | "liquid" | "vehicles",
  estado: "pending" | "in-transit" | "loading" | "unloading" | "completed",
  distancia: String
}
```

### Ruta
```javascript
{
  idRuta: String (required, unique),
  nombre: String,
  origen: String,
  paisOrigen: String,
  destino: String,
  paisDestino: String,
  distancia: String,
  duracion: String,
  tipo: "international" | "regional" | "coastal",
  estado: "active" | "pending" | "completed" | "inactive",
  viajesAnio: Number (min: 0)
}
```

### Factura
```javascript
{
  idFactura: String (required, unique),
  cliente: String,
  fechaEmision: String (dd/mm/yyyy),
  monto: Number (min: 0),
  estado: "paid" | "pending" | "overdue" | "cancelled"
}
```

### Personal
```javascript
{
  nombre: String,
  email: String (valid email format),
  puesto: String,
  departamento: String,
  estado: "active" | "inactive"
}
```

### Embarcación
```javascript
{
  nombre: String,
  imo: String,
  origen: String,
  destino: String,
  fecha: String (dd/mm/yyyy),
  capacidad: String,
  tipo: "container" | "bulk" | "general" | "tanker",
  estado: "pending" | "in-transit" | "in-route" | "in-port"
}
```

### Almacén
```javascript
{
  nombre: String,
  ubicacion: String,
  capacidad: Number (min: 0), // TEUs
  ocupacion: Number (min: 0, max: 100), // %
  estado: "operativo" | "mantenimiento" | "inoperativo",
  proximoMantenimiento: String (dd/mm/yyyy)
}
```

## 📝 Ejemplos de Uso

### Ejemplo: Crear y Listar Embarques

```javascript
// 1. Iniciar sesión
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@sgtm.com',
    password: 'user123'
  })
});

const { data: { token } } = await loginResponse.json();

// 2. Crear embarque
const createResponse = await fetch('http://localhost:3000/api/embarques', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    idEmbarque: 'EMB-2024-006',
    buque: 'Nuevo Buque',
    imo: '9999999',
    origen: 'Buenaventura',
    destino: 'Valparaíso',
    fechaEstimada: '25/12/2024 - 10:00',
    teus: 5000,
    tipoCarga: 'container',
    estado: 'pending',
    distancia: '2500 nm'
  })
});

// 3. Listar embarques
const listResponse = await fetch('http://localhost:3000/api/embarques?estado=pending', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const embarques = await listResponse.json();
```

### Ejemplo: Exportar Reporte

```javascript
// Generar reporte CSV de embarques
const exportResponse = await fetch('http://localhost:3000/api/exportar/generar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    tipo: 'embarques',
    formato: 'csv',
    filtros: {
      estado: 'in-transit'
    }
  })
});

const { data: { id } } = await exportResponse.json();

// Descargar archivo
window.location.href = `http://localhost:3000/api/exportar/descargar/${id}`;
```

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor en desarrollo
npm run dev

# Iniciar servidor en producción
npm start

# Cargar datos de prueba
npm run seed
```

## 📄 Respuestas de Error

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "message": "Mensaje de error descriptivo"
}
```

### Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autenticado
- `403` - No autorizado
- `404` - No encontrado
- `500` - Error del servidor

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Rate limiting implementado
- Validación de datos en todos los endpoints
- Sanitización de inputs
- CORS configurado

## 📞 Soporte

Para más información o soporte, contacta al equipo de desarrollo.

---

**Desarrollado para el Sistema de Gestión de Transporte Marítimo (SGTM)**
