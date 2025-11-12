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

## Próximos pasos

- Implementar servicios de estadísticas y exportación
- Añadir validaciones y sanitización adicionales
- Documentación completa de la API
- Implementar servicios de Autentificacion de usuarios:

  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me
  - POST /api/auth/refresh-token
  - POST /api/auth/logout
