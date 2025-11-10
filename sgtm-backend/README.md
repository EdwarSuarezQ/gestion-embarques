# SGTM Backend - Sistema de Gestión de Transporte Marítimo

Backend completo desarrollado con Node.js, Express.js y MongoDB para el Sistema de Gestión de Transporte Marítimo.

## 🚀 Características

- ✅ Autenticación JWT completa
- ✅ CRUD completo para todos los módulos
- ✅ Sistema de estadísticas avanzado
- ✅ Exportación multi-formato (CSV, JSON, PDF, Excel)
- ✅ Validación de datos con express-validator
- ✅ Paginación y filtros avanzados
- ✅ Manejo de errores centralizado
- ✅ Rate limiting y seguridad

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio o navegar al directorio del proyecto:
```bash
cd sgtm-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sgtm
JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_EXPIRE=7d
```

4. Poblar la base de datos con datos de prueba:
```bash
npm run seed
```

5. Iniciar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Estructura del Proyecto

```
sgtm-backend/
├── src/
│   ├── models/          # Modelos Mongoose
│   ├── controllers/     # Controladores de lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── services/        # Servicios de negocio
│   ├── utils/           # Utilidades y helpers
│   ├── config/          # Configuraciones
│   └── app.js           # Aplicación principal
├── scripts/             # Scripts de utilidad
├── uploads/             # Archivos exportados
└── package.json
```

## 🔐 Autenticación

### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "user"
}
```

### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Usar Token
Incluir el token en el header de las peticiones:
```http
Authorization: Bearer <token>
```

## 📡 Endpoints Principales

### Tareas
- `GET /api/tareas` - Listar tareas (con paginación)
- `POST /api/tareas` - Crear tarea
- `GET /api/tareas/:id` - Obtener tarea
- `PUT /api/tareas/:id` - Actualizar tarea
- `DELETE /api/tareas/:id` - Eliminar tarea
- `GET /api/tareas/estadisticas` - Estadísticas de tareas

### Embarques
- `GET /api/embarques` - Listar embarques
- `POST /api/embarques` - Crear embarque
- `GET /api/embarques/activos` - Embarques activos
- `GET /api/embarques/estado/:estado` - Filtrar por estado
- `PUT /api/embarques/:id/estado` - Actualizar estado

### Rutas
- `GET /api/rutas` - Listar rutas
- `POST /api/rutas` - Crear ruta
- `GET /api/rutas/activas` - Rutas activas
- `GET /api/rutas/internacionales` - Rutas internacionales

### Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `GET /api/facturas/pendientes` - Facturas pendientes
- `PUT /api/facturas/:id/pagar` - Marcar como pagada

### Personal
- `GET /api/personal` - Listar personal
- `POST /api/personal` - Crear personal
- `GET /api/personal/activos` - Personal activo
- `GET /api/personal/departamento/:depto` - Filtrar por departamento

### Embarcaciones
- `GET /api/embarcaciones` - Listar embarcaciones
- `POST /api/embarcaciones` - Crear embarcación

### Almacenes
- `GET /api/almacenes` - Listar almacenes
- `POST /api/almacenes` - Crear almacén
- `PUT /api/almacenes/:id/ocupacion` - Actualizar ocupación

### Estadísticas
- `GET /api/estadisticas/generales` - Estadísticas generales
- `GET /api/estadisticas/dashboard` - Dashboard completo
- `GET /api/estadisticas/tendencias` - Tendencias

### Exportación
- `GET /api/exportar/tipos` - Tipos de reporte disponibles
- `POST /api/exportar/generar` - Generar exportación
- `GET /api/exportar/historial` - Historial de exportaciones
- `GET /api/exportar/descargar/:id` - Descargar archivo

## 🔍 Paginación y Filtros

Todos los endpoints de listado soportan paginación y filtros:

```http
GET /api/tareas?page=1&limit=10&search=inspección&estado=pending&sort=createdAt:desc
```

Parámetros:
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)
- `search`: Búsqueda por texto
- `sort`: Ordenamiento (ej: `createdAt:desc`)

## 📊 Ejemplos de Uso

### Crear una Tarea
```javascript
const response = await fetch('http://localhost:3000/api/tareas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    titulo: 'Nueva tarea',
    descripcion: 'Descripción de la tarea',
    asignado: 'Juan Pérez',
    fecha: '20/12/2024',
    prioridad: 'high',
    estado: 'pending',
    departamento: 'Operaciones'
  })
});
```

### Generar Exportación
```javascript
const response = await fetch('http://localhost:3000/api/exportar/generar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    tipo: 'tareas',
    formato: 'csv',
    modulo: 'tareas',
    campos: ['titulo', 'descripcion', 'asignado', 'fecha', 'estado']
  })
});
```

## 🛠️ Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo (con nodemon)
- `npm run seed` - Poblar base de datos con datos de prueba

## 🔒 Seguridad

- Autenticación JWT
- Rate limiting configurado
- Validación de datos en todos los endpoints
- CORS configurado
- Contraseñas hasheadas con bcrypt

## 📝 Notas

- Todos los endpoints (excepto `/api/auth/*`) requieren autenticación
- Las fechas deben seguir el formato `DD/MM/YYYY` o `DD/MM/YYYY - HH:mm`
- Los archivos exportados se guardan en `uploads/exports/`

## 🤝 Integración con Frontend

Ver el archivo `apiService.js` en la carpeta del frontend para ejemplos de integración.

## 📄 Licencia

ISC

