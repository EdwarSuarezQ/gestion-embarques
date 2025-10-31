// Variables globales
let almacenes = [];

function inicializar() {
  renderizarAlmacenes();
  configurarEventosGlobales();
  actualizarEstadisticas();
  actualizarPanelesInferiores();
}

function renderizarAlmacenes() {
  const tableBody = document.getElementById("almacenes-table-body");
  const sinResultados = document.getElementById("sin-resultados");

  if (!tableBody) {
    console.error("No se encontró el table body para almacenes");
    return;
  }

  tableBody.innerHTML = almacenes
    .map((almacen) => generarFilaTabla(almacen))
    .join("");

  // Mostrar/ocultar mensaje de sin resultados
  if (almacenes.length === 0) {
    tableBody.innerHTML = "";
    sinResultados.classList.remove("hidden");
  } else {
    sinResultados.classList.add("hidden");
  }
}

function generarFilaTabla(almacen) {
  const estadoInfo = getEstadoInfo(almacen.estado);
  const nivelOcupacion = getNivelOcupacion(almacen.ocupacion);

  return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${escapeHtml(
                  almacen.nombre
                )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(
                  almacen.ubicacion
                )}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${almacen.capacidad.toLocaleString()} TEUs
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-20 bg-gray-200 rounded-full h-2 mr-3">
                        <div class="h-2 rounded-full progress-bar ${
                          nivelOcupacion.clase
                        }" style="width: ${almacen.ocupacion}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-600">${
                      almacen.ocupacion
                    }%</span>
                </div>
                <div class="text-xs text-gray-400 mt-1">${
                  nivelOcupacion.texto
                }</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  estadoInfo.clase
                }">
                    <span class="w-2 h-2 rounded-full mr-1 ${
                      estadoInfo.clase.replace("status-", "bg-").split(" ")[0]
                    }"></span>
                    ${estadoInfo.texto}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-800 mr-3 edit-btn" data-id="${
                  almacen.id
                }" title="Editar almacén">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 delete-btn" data-id="${
                  almacen.id
                }" title="Eliminar almacén">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

function actualizarEstadisticas() {
  const totalAlmacenes = almacenes.length;
  const almacenesOperativos = almacenes.filter(
    (a) => a.estado === "operativo"
  ).length;
  const almacenesMantenimiento = almacenes.filter(
    (a) => a.estado === "mantenimiento"
  ).length;
  const capacidadTotal = almacenes.reduce((sum, a) => sum + a.capacidad, 0);

  document.getElementById("total-almacenes").textContent = totalAlmacenes;
  document.getElementById("almacenes-operativos").textContent =
    almacenesOperativos;
  document.getElementById("almacenes-mantenimiento").textContent =
    almacenesMantenimiento;
  document.getElementById("capacidad-total").textContent =
    capacidadTotal.toLocaleString() + " TEUs";
}

function actualizarPanelesInferiores() {
  actualizarEstadisticasEstado();
  actualizarProximosMantenimientos();
}

function actualizarEstadisticasEstado() {
  const container = document.getElementById("estadisticas-estado");
  if (!container) return;

  const estados = {
    operativo: {
      nombre: "Operativos",
      color: "green",
      cantidad: almacenes.filter((a) => a.estado === "operativo").length,
    },
    mantenimiento: {
      nombre: "En Mantenimiento",
      color: "yellow",
      cantidad: almacenes.filter((a) => a.estado === "mantenimiento").length,
    },
    inoperativo: {
      nombre: "Inoperativos",
      color: "red",
      cantidad: almacenes.filter((a) => a.estado === "inoperativo").length,
    },
  };

  const total = almacenes.length;

  container.innerHTML = Object.values(estados)
    .map(
      (estado) => `
            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span class="flex items-center">
                        <span class="w-3 h-3 bg-${
                          estado.color
                        }-500 rounded-full mr-2"></span>
                        ${estado.nombre}
                    </span>
                    <span>${estado.cantidad} almacenes</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-${
                      estado.color
                    }-500 h-2 rounded-full" style="width: ${
        total > 0 ? (estado.cantidad / total) * 100 : 0
      }%"></div>
                </div>
            </div>
        `
    )
    .join("");
}

function actualizarProximosMantenimientos() {
  const container = document.getElementById("proximos-mantenimientos");
  if (!container) return;

  // Ordenar por fecha de próximo mantenimiento (los más cercanos primero)
  const proximos = almacenes
    .filter((a) => a.proximoMantenimiento)
    .sort((a, b) => {
      const fechaA = new Date(
        a.proximoMantenimiento.split("/").reverse().join("-")
      );
      const fechaB = new Date(
        b.proximoMantenimiento.split("/").reverse().join("-")
      );
      return fechaA - fechaB;
    })
    .slice(0, 4); // Mostrar solo los 4 más próximos

  if (proximos.length === 0) {
    container.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <i class="fas fa-calendar-check text-2xl mb-2"></i>
                <p>No hay mantenimientos programados</p>
            </div>
        `;
    return;
  }

  container.innerHTML = proximos
    .map((almacen) => {
      const diasRestantes = calcularDiasRestantes(almacen.proximoMantenimiento);
      const estadoInfo = getEstadoInfo(almacen.estado);

      return `
                <div class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div class="h-10 w-10 rounded-full ${getColorIconoMantenimiento(
                      diasRestantes
                    )} flex items-center justify-center text-white mr-3">
                        <i class="fas fa-tools"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-sm font-medium">${escapeHtml(
                          almacen.nombre
                        )}</h3>
                        <p class="text-xs text-gray-500">${
                          almacen.proximoMantenimiento
                        } - ${diasRestantes}</p>
                    </div>
                    <span class="status-badge ${estadoInfo.clase} border">${
        estadoInfo.texto
      }</span>
                </div>
            `;
    })
    .join("");
}

function calcularDiasRestantes(fecha) {
  const hoy = new Date();
  const fechaMantenimiento = new Date(fecha.split("/").reverse().join("-"));
  const diffTime = fechaMantenimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays > 1) return `En ${diffDays} días`;
  if (diffDays === -1) return "Ayer";
  return `Hace ${Math.abs(diffDays)} días`;
}

function getColorIconoMantenimiento(diasRestantes) {
  if (
    diasRestantes.includes("Hoy") ||
    diasRestantes.includes("Mañana") ||
    diasRestantes.includes("En 1") ||
    diasRestantes.includes("En 2")
  ) {
    return "bg-red-500";
  } else if (
    diasRestantes.includes("En 3") ||
    diasRestantes.includes("En 4") ||
    diasRestantes.includes("En 5") ||
    diasRestantes.includes("En 6") ||
    diasRestantes.includes("En 7")
  ) {
    return "bg-yellow-500";
  } else {
    return "bg-green-500";
  }
}

function configurarEventosGlobales() {
  // Configurar eventos del modal
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel");

  if (modalClose) modalClose.addEventListener("click", ocultarModal);
  if (modalCancel) modalCancel.addEventListener("click", ocultarModal);

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) ocultarModal();
    });
  }

  // Configurar toast
  const toastClose = document.getElementById("toast-close");
  if (toastClose) toastClose.addEventListener("click", ocultarToast);

  // Botón nuevo almacén
  document.addEventListener("click", function (e) {
    if (
      e.target.id === "btn-nuevo-almacen" ||
      e.target.closest("#btn-nuevo-almacen")
    ) {
      mostrarModalCrear();
    }
  });

  // Filtros
  const filtroEstado = document.getElementById("filtro-estado");
  const filtroOcupacion = document.getElementById("filtro-ocupacion");
  const buscarAlmacenes = document.getElementById("buscar-almacenes");

  if (filtroEstado) filtroEstado.addEventListener("change", aplicarFiltros);
  if (filtroOcupacion)
    filtroOcupacion.addEventListener("change", aplicarFiltros);
  if (buscarAlmacenes)
    buscarAlmacenes.addEventListener("input", aplicarFiltros);

  // Event delegation para botones de editar/eliminar
  document.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (editBtn) {
      const id = parseInt(editBtn.dataset.id);
      mostrarModalEditar(id);
    }

    if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id);
      eliminarAlmacen(id);
    }
  });
}

function aplicarFiltros() {
  const filtroEstado = document.getElementById("filtro-estado")?.value;
  const filtroOcupacion = document.getElementById("filtro-ocupacion")?.value;
  const textoBusqueda = document
    .getElementById("buscar-almacenes")
    ?.value.toLowerCase();

  let almacenesFiltrados = almacenes;

  if (filtroEstado) {
    almacenesFiltrados = almacenesFiltrados.filter(
      (a) => a.estado === filtroEstado
    );
  }

  if (filtroOcupacion) {
    switch (filtroOcupacion) {
      case "baja":
        almacenesFiltrados = almacenesFiltrados.filter(
          (a) => a.ocupacion <= 30
        );
        break;
      case "media":
        almacenesFiltrados = almacenesFiltrados.filter(
          (a) => a.ocupacion > 30 && a.ocupacion <= 70
        );
        break;
      case "alta":
        almacenesFiltrados = almacenesFiltrados.filter((a) => a.ocupacion > 70);
        break;
    }
  }

  if (textoBusqueda) {
    almacenesFiltrados = almacenesFiltrados.filter(
      (a) =>
        a.nombre.toLowerCase().includes(textoBusqueda) ||
        a.ubicacion.toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarAlmacenesFiltrados(almacenesFiltrados);
}

function renderizarAlmacenesFiltrados(almacenesFiltrados) {
  const tableBody = document.getElementById("almacenes-table-body");
  const sinResultados = document.getElementById("sin-resultados");

  if (!tableBody) return;

  tableBody.innerHTML = almacenesFiltrados
    .map((almacen) => generarFilaTabla(almacen))
    .join("");

  // Mostrar/ocultar mensaje de sin resultados
  if (almacenesFiltrados.length === 0) {
    tableBody.innerHTML = "";
    sinResultados.classList.remove("hidden");
  } else {
    sinResultados.classList.add("hidden");
  }
}

// Funciones auxiliares
function getEstadoInfo(estado) {
  const estados = {
    operativo: { texto: "Operativo", clase: "status-operativo" },
    mantenimiento: { texto: "Mantenimiento", clase: "status-mantenimiento" },
    inoperativo: { texto: "Inoperativo", clase: "status-inoperativo" },
  };
  return (
    estados[estado] || { texto: "Desconocido", clase: "status-inoperativo" }
  );
}

function getNivelOcupacion(ocupacion) {
  if (ocupacion <= 30) {
    return { texto: "Baja ocupación", clase: "bg-green-500" };
  } else if (ocupacion <= 70) {
    return { texto: "Ocupación media", clase: "bg-yellow-500" };
  } else {
    return { texto: "Alta ocupación", clase: "bg-red-500" };
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Funciones para el modal
function mostrarModal(titulo, contenido, callbackConfirmar) {
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalSave = document.getElementById("modal-save");
  const modal = document.getElementById("modal");

  if (!modal || !modalTitle || !modalBody || !modalSave) {
    console.error("Elementos del modal no encontrados");
    return;
  }

  modalTitle.textContent = titulo;
  modalBody.innerHTML = contenido;
  modalSave.onclick = callbackConfirmar;
  modal.classList.remove("hidden");
}

function ocultarModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function mostrarModalCrear() {
  const campos = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" id="create-nombre" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                <input type="text" id="create-ubicacion" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad (TEUs) *</label>
                    <input type="number" id="create-capacidad" class="w-full px-3 py-2 border border-gray-300 rounded-md" required min="1">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ocupación (%) *</label>
                    <input type="number" id="create-ocupacion" class="w-full px-3 py-2 border border-gray-300 rounded-md" required min="0" max="100">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="create-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="operativo">Operativo</option>
                        <option value="mantenimiento">En Mantenimiento</option>
                        <option value="inoperativo">Inoperativo</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Próximo Mantenimiento</label>
                    <input type="date" id="create-mantenimiento" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
            </div>
        </div>
    `;

  mostrarModal("Nuevo Almacén", campos, crearAlmacen);
}

function mostrarModalEditar(id) {
  const almacen = almacenes.find((a) => a.id === id);
  if (!almacen) return;

  // Convertir fecha de dd/mm/yyyy a yyyy-mm-dd para el input date
  const fechaMantenimiento = almacen.proximoMantenimiento
    ? almacen.proximoMantenimiento.split("/").reverse().join("-")
    : "";

  const campos = `
        <div class="space-y-4">
            <input type="hidden" id="edit-id" value="${almacen.id}">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" id="edit-nombre" value="${escapeHtml(
                  almacen.nombre
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                <input type="text" id="edit-ubicacion" value="${escapeHtml(
                  almacen.ubicacion
                )}" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad (TEUs) *</label>
                    <input type="number" id="edit-capacidad" value="${
                      almacen.capacidad
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required min="1">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ocupación (%) *</label>
                    <input type="number" id="edit-ocupacion" value="${
                      almacen.ocupacion
                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" required min="0" max="100">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select id="edit-estado" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        <option value="operativo" ${
                          almacen.estado === "operativo" ? "selected" : ""
                        }>Operativo</option>
                        <option value="mantenimiento" ${
                          almacen.estado === "mantenimiento" ? "selected" : ""
                        }>En Mantenimiento</option>
                        <option value="inoperativo" ${
                          almacen.estado === "inoperativo" ? "selected" : ""
                        }>Inoperativo</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Próximo Mantenimiento</label>
                    <input type="date" id="edit-mantenimiento" value="${fechaMantenimiento}" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
            </div>
        </div>
    `;

  mostrarModal("Editar Almacén", campos, editarAlmacen);
}

function crearAlmacen() {
  const nombre = document.getElementById("create-nombre")?.value.trim();
  const ubicacion = document.getElementById("create-ubicacion")?.value.trim();
  const capacidad = parseInt(
    document.getElementById("create-capacidad")?.value
  );
  const ocupacion = parseInt(
    document.getElementById("create-ocupacion")?.value
  );
  const mantenimientoInput = document.getElementById(
    "create-mantenimiento"
  )?.value;

  if (!nombre || !ubicacion || isNaN(capacidad) || isNaN(ocupacion)) {
    mostrarToast("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy
  let proximoMantenimiento = "";
  if (mantenimientoInput) {
    const [anio, mes, dia] = mantenimientoInput.split("-");
    proximoMantenimiento = `${dia}/${mes}/${anio}`;
  }

  const nuevoAlmacen = {
    id: Date.now(),
    nombre: nombre,
    ubicacion: ubicacion,
    capacidad: capacidad,
    ocupacion: ocupacion,
    estado: document.getElementById("create-estado")?.value || "operativo",
    proximoMantenimiento: proximoMantenimiento,
  };

  almacenes.push(nuevoAlmacen);
  guardarAlmacenes();
  renderizarAlmacenes();
  actualizarEstadisticas();
  actualizarPanelesInferiores();
  ocultarModal();
  mostrarToast("¡Almacén creado con éxito!");
}

function editarAlmacen() {
  const id = parseInt(document.getElementById("edit-id")?.value);
  const almacenIndex = almacenes.findIndex((a) => a.id === id);

  if (almacenIndex !== -1) {
    const mantenimientoInput =
      document.getElementById("edit-mantenimiento")?.value;

    // Convertir fecha de yyyy-mm-dd a dd/mm/yyyy
    let proximoMantenimiento = "";
    if (mantenimientoInput) {
      const [anio, mes, dia] = mantenimientoInput.split("-");
      proximoMantenimiento = `${dia}/${mes}/${anio}`;
    }

    almacenes[almacenIndex] = {
      ...almacenes[almacenIndex],
      nombre: document.getElementById("edit-nombre")?.value.trim() || "",
      ubicacion: document.getElementById("edit-ubicacion")?.value.trim() || "",
      capacidad:
        parseInt(document.getElementById("edit-capacidad")?.value) || 0,
      ocupacion:
        parseInt(document.getElementById("edit-ocupacion")?.value) || 0,
      estado: document.getElementById("edit-estado")?.value || "operativo",
      proximoMantenimiento: proximoMantenimiento,
    };

    guardarAlmacenes();
    renderizarAlmacenes();
    actualizarEstadisticas();
    actualizarPanelesInferiores();
    ocultarModal();
    mostrarToast("¡Almacén actualizado con éxito!");
  }
}

function eliminarAlmacen(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este almacén?")) {
    almacenes = almacenes.filter((a) => a.id !== id);
    guardarAlmacenes();
    renderizarAlmacenes();
    actualizarEstadisticas();
    actualizarPanelesInferiores();
    mostrarToast("¡Almacén eliminado con éxito!");
  }
}

function guardarAlmacenes() {
  // Los datos se mantienen en el arreglo almacenes en memoria
  // No se usa localStorage, los datos persisten durante la sesión
  console.log("Almacenes guardados en memoria:", almacenes.length, "elementos");
}

// Funciones para toast
function mostrarToast(mensaje, tipo = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = mensaje;

  // Configurar el color según el tipo
  toast.className = "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50";
  if (tipo === "success") {
    toast.classList.add("bg-green-500", "text-white");
  } else if (tipo === "error") {
    toast.classList.add("bg-red-500", "text-white");
  }

  // Mostrar el toast
  toast.classList.remove("hidden");

  // Ocultar automáticamente después de 3 segundos
  setTimeout(ocultarToast, 3000);
}

function ocultarToast() {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.add("hidden");
  }
}

inicializar();
