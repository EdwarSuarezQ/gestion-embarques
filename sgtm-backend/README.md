# SGTM Backend

Backend para el Sistema de Gestión de Transporte Marítimo (SGTM).

## Requisitos

- Node.js >= 18
- MongoDB corriendo localmente o en un servicio accesible

## Instalación

1. Copia el archivo `.env.example` a `.env` y ajusta las variables (URI de Mongo, JWT secret, etc.).
2. Instala dependencias:

```bash
npm install
```

3. Ejecuta seed para datos de prueba:

```bash
npm run seed
```

4. Arranca el servidor:

```bash
npm run dev
# o
npm start
```

## Endpoints disponibles (inicio)

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/refresh-token
- POST /api/auth/logout

- CRUD Tareas
  - POST /api/tareas
  - GET /api/tareas
  - GET /api/tareas/:id
  - PUT /api/tareas/:id
  - PATCH /api/tareas/:id
  - DELETE /api/tareas/:id
  - GET /api/tareas/estadisticas

## Integración con frontend

- Base API: http://localhost:3000/api
- Autenticación: enviar header `Authorization: Bearer <token>` en requests protegidos

## Próximos pasos

- Implementar modelos restantes (Embarques, Rutas, Facturas, Personal, Embarcaciones, Almacenes)
- Implementar servicios de estadísticas y exportación
- Añadir validaciones y sanitización adicionales
- Documentación completa de la API
