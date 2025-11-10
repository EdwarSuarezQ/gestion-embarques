# Guía de Integración Frontend-Backend

Esta guía explica cómo integrar el frontend existente con el nuevo backend.

## 📋 Pasos de Integración

### 1. Copiar el Servicio API

Copia el archivo `apiService.js` a tu proyecto frontend (por ejemplo, en `assets/JS/services/apiService.js`).

### 2. Configurar la URL Base

Ajusta la constante `API_BASE` en `apiService.js` según tu configuración:

```javascript
const API_BASE = 'http://localhost:3000/api'; // Cambiar según tu entorno
```

### 3. Implementar Autenticación

#### Login
```javascript
import apiService from './services/apiService.js';

async function login(email, password) {
  try {
    const response = await apiService.login(email, password);
    if (response.success) {
      // Token guardado automáticamente
      console.log('Login exitoso');
      // Redirigir o actualizar UI
    }
  } catch (error) {
    console.error('Error en login:', error);
    // Mostrar error al usuario
  }
}
```

#### Verificar Autenticación al Cargar
```javascript
// Al iniciar la aplicación
if (!apiService.token) {
  // Redirigir a login
  window.location.href = '#login';
}
```

### 4. Reemplazar Arrays Locales

#### Antes (con arrays locales):
```javascript
let tareas = [];

function obtenerTareas() {
  // Datos locales
  renderizarTareas(tareas);
}

function crearTarea(tarea) {
  tareas.push(tarea);
  guardarTareas();
}
```

#### Después (con API):
```javascript
let tareas = [];

async function obtenerTareas() {
  try {
    mostrarCargando(true);
    const response = await apiService.getTareas(1, 100);
    if (response.success) {
      tareas = response.data.data; // Datos de la API
      renderizarTareas(tareas);
    }
  } catch (error) {
    mostrarError('Error al cargar tareas');
  } finally {
    mostrarCargando(false);
  }
}

async function crearTarea(tarea) {
  try {
    const response = await apiService.createTarea(tarea);
    if (response.success) {
      tareas.push(response.data);
      renderizarTareas(tareas);
      mostrarToast('Tarea creada exitosamente', 'success');
    }
  } catch (error) {
    mostrarError('Error al crear tarea');
  }
}
```

### 5. Actualizar Funciones CRUD

#### Ejemplo Completo: Módulo de Tareas

```javascript
// Inicialización
async function inicializarModulo() {
  await obtenerTareas();
  configurarEventos();
}

// Obtener tareas
async function obtenerTareas() {
  try {
    const response = await apiService.getTareas(1, 100);
    if (response.success) {
      tareas = response.data.data;
      renderizarTareas();
      actualizarEstadisticas();
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarError('No se pudieron cargar las tareas');
  }
}

// Crear tarea
async function crearTarea() {
  const tarea = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    asignado: document.getElementById('asignado').value,
    fecha: document.getElementById('fecha').value,
    prioridad: document.getElementById('prioridad').value,
    estado: 'pending',
    departamento: document.getElementById('departamento').value
  };

  try {
    const response = await apiService.createTarea(tarea);
    if (response.success) {
      tareas.push(response.data);
      renderizarTareas();
      mostrarToast('Tarea creada exitosamente', 'success');
      cerrarModal();
    }
  } catch (error) {
    mostrarError('Error al crear la tarea');
  }
}

// Actualizar tarea
async function actualizarTarea(id, updates) {
  try {
    const response = await apiService.patchTarea(id, updates);
    if (response.success) {
      const index = tareas.findIndex(t => t._id === id);
      if (index !== -1) {
        tareas[index] = response.data;
        renderizarTareas();
        mostrarToast('Tarea actualizada', 'success');
      }
    }
  } catch (error) {
    mostrarError('Error al actualizar la tarea');
  }
}

// Eliminar tarea
async function eliminarTarea(id) {
  if (!confirm('¿Está seguro de eliminar esta tarea?')) return;

  try {
    const response = await apiService.deleteTarea(id);
    if (response.success) {
      tareas = tareas.filter(t => t._id !== id);
      renderizarTareas();
      mostrarToast('Tarea eliminada', 'success');
    }
  } catch (error) {
    mostrarError('Error al eliminar la tarea');
  }
}
```

### 6. Manejo de Estados de Carga

```javascript
function mostrarCargando(mostrar) {
  const loader = document.getElementById('loader');
  if (mostrar) {
    loader.style.display = 'block';
  } else {
    loader.style.display = 'none';
  }
}

// En tus funciones async
async function cargarDatos() {
  mostrarCargando(true);
  try {
    // ... llamada API
  } finally {
    mostrarCargando(false);
  }
}
```

### 7. Manejo de Errores

```javascript
function manejarError(error) {
  console.error('Error:', error);
  
  if (error.message.includes('401') || error.message.includes('No autorizado')) {
    // Token expirado o inválido
    apiService.logout();
    window.location.href = '#login';
    mostrarError('Sesión expirada. Por favor, inicie sesión nuevamente');
  } else {
    mostrarError(error.message || 'Ocurrió un error');
  }
}
```

### 8. Actualizar Estadísticas

```javascript
async function actualizarEstadisticas() {
  try {
    const response = await apiService.getTareasEstadisticas();
    if (response.success) {
      const stats = response.data;
      // Actualizar UI con estadísticas
      document.getElementById('tareas-pendientes').textContent = stats.pendientes;
      document.getElementById('tareas-completadas').textContent = stats.completadas;
      document.getElementById('eficiencia').textContent = stats.eficiencia;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}
```

### 9. Exportación de Datos

```javascript
async function exportarDatos(tipo, formato) {
  try {
    mostrarCargando(true);
    
    // Obtener tipos de reporte
    const tiposResponse = await apiService.getTiposExportacion();
    const tipoReporte = tiposResponse.data.find(t => t.id === tipo);
    
    if (!tipoReporte) {
      throw new Error('Tipo de reporte no encontrado');
    }

    // Generar exportación
    const response = await apiService.generarExportacion(
      tipo,
      formato,
      tipoReporte.modulo,
      tipoReporte.campos
    );

    if (response.success) {
      // Esperar a que se complete
      await esperarExportacion(response.data._id);
      
      // Descargar
      await apiService.descargarExportacion(response.data._id);
      mostrarToast('Exportación generada exitosamente', 'success');
    }
  } catch (error) {
    mostrarError('Error al generar exportación');
  } finally {
    mostrarCargando(false);
  }
}

async function esperarExportacion(id) {
  let intentos = 0;
  const maxIntentos = 30; // 30 segundos máximo

  while (intentos < maxIntentos) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(`http://localhost:3000/api/exportar/estado/${id}`, {
      headers: {
        'Authorization': `Bearer ${apiService.token}`
      }
    });
    
    const data = await response.json();
    
    if (data.data.estado === 'completed') {
      return;
    } else if (data.data.estado === 'failed') {
      throw new Error(data.data.error || 'Error en la exportación');
    }
    
    intentos++;
  }
  
  throw new Error('Tiempo de espera agotado');
}
```

## 🔄 Migración por Módulo

### Módulos a Actualizar:
1. ✅ Tareas (`modules/tareas/tareas.js`)
2. ✅ Embarques (`modules/embarques/embarques.js`)
3. ✅ Rutas (`modules/rutas/rutas.js`)
4. ✅ Facturas (`modules/facturas/facturas.js`)
5. ✅ Personal (`modules/personal/personal.js`)
6. ✅ Embarcaciones (`modules/embarcaciones/embarcaciones.js`)
7. ✅ Almacenes (`modules/almacen/almacen.js`)
8. ✅ Estadísticas (`modules/estadisticas/estadisticas.js`)
9. ✅ Exportar Datos (`modules/exportar-datos/exportar-datos.js`)

## 📝 Notas Importantes

1. **Estructura de Respuesta**: Todas las respuestas de la API tienen esta estructura:
   ```javascript
   {
     success: true/false,
     message: "Mensaje descriptivo",
     data: { ... } // Datos reales
   }
   ```

2. **Paginación**: Los endpoints de listado devuelven:
   ```javascript
   {
     success: true,
     data: [...], // Array de datos
     pagination: {
       currentPage: 1,
       perPage: 10,
       total: 100,
       totalPages: 10,
       hasNextPage: true,
       hasPrevPage: false
     }
   }
   ```

3. **IDs**: MongoDB usa `_id` en lugar de `id`. Ajusta tu código si es necesario.

4. **Fechas**: Mantén el formato `DD/MM/YYYY` o `DD/MM/YYYY - HH:mm` según el campo.

5. **Tokens**: El token se guarda automáticamente en localStorage. Se incluye en todas las peticiones.

## 🚀 Ejemplo de Migración Completa

Ver el archivo `EJEMPLO_MIGRACION.md` para un ejemplo completo de migración de un módulo.

## ❓ Solución de Problemas

### Error 401 (No autorizado)
- Verificar que el token esté guardado
- Verificar que el token no haya expirado
- Hacer login nuevamente

### Error 404 (No encontrado)
- Verificar que el backend esté corriendo
- Verificar la URL base en `apiService.js`
- Verificar que el endpoint exista

### Error de CORS
- Verificar configuración CORS en el backend
- Asegurar que la URL del frontend esté en `CORS_ORIGIN`

### Datos no se actualizan
- Verificar que estés usando `await` en las llamadas async
- Verificar que estés actualizando el array local después de las operaciones
- Verificar que estés llamando a `renderizarTareas()` después de actualizar

