const $ = id => document.getElementById(id);

const formProducto = $("formProducto");
const editor = $("editor");
const confirmacion = $("confirmacion");

let datos = {
    productos: [],
    marcas: [],
    categorias: []
};

let editando = null;
let eliminando = null;

function campo(nombre) {
    return formProducto.elements.namedItem(nombre);
}

function mensaje(texto) {
    $("mensaje").textContent = texto;
}

async function api(ruta, metodo = "GET", cuerpo) {
    const respuesta = await fetch(`/api/admin${ruta}`, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: cuerpo === undefined
            ? undefined
            : JSON.stringify(cuerpo)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        if ([401, 403].includes(respuesta.status)) {
            $("panel").hidden = true;
            $("listaProductos").replaceChildren();

            if (editor.open) editor.close();
            if (confirmacion.open) confirmacion.close();
        }

        throw new Error(
            resultado.error || "No se pudo completar la operación."
        );
    }

    return resultado;
}

function llenarSelector(nombre, opciones, textoInicial) {
    const select = campo(nombre);

    select.replaceChildren(new Option(textoInicial, ""));

    opciones.forEach(opcion => {
        const nombreVisible =
            opcion.nombre + (opcion.activo ? "" : " (inactiva)");

        select.add(new Option(nombreVisible, opcion.id));
    });
}

async function cargarPanel() {
    datos = await api("/datos");

    llenarSelector(
        "marca_id",
        datos.marcas,
        "Seleccioná una marca"
    );

    llenarSelector(
        "genero_id",
        datos.categorias.filter(c => c.tipo === "genero"),
        "Seleccioná un género"
    );

    llenarSelector(
        "segmento_id",
        datos.categorias.filter(c => c.tipo === "segmento"),
        "Sin especificar"
    );

    renderProductos();

    $("panel").hidden = false;
}

function renderProductos() {
    const tbody = $("listaProductos");
    tbody.replaceChildren();

    if (!datos.productos.length) {
        const fila = tbody.insertRow();
        const celda = fila.insertCell();

        celda.colSpan = 7;
        celda.textContent = "Todavía no hay productos.";
        return;
    }

    datos.productos.forEach(producto => {
        const fila = tbody.insertRow();

        const valores = [
            producto.nombre,
            producto.marca,
            producto.tamano_ml ?? "Sin presentación",
            producto.precio == null
                ? "—"
                : Number(producto.precio).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS"
                }),
            producto.stock ?? "—",
            producto.activo && producto.variante_activa
                ? "Activo"
                : "Inactivo"
        ];

        valores.forEach(valor => {
            fila.insertCell().textContent = valor;
        });

        const acciones = fila.insertCell();

        const editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";
        editar.addEventListener("click", () => {
            abrirEditor(producto);
        });

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.textContent = "Eliminar";
        eliminar.className = "peligro";

        eliminar.addEventListener("click", () => {
            eliminando = producto;

            $("textoEliminar").textContent =
                `¿Querés eliminar "${producto.nombre}"?`;

            $("errorEliminar").textContent = "";
            confirmacion.showModal();
        });

        acciones.append(editar, eliminar);
    });
}

function abrirEditor(producto = null) {
    editando = producto;
    formProducto.reset();

    $("errorEditor").textContent = "";

    $("tituloEditor").textContent = producto
        ? "Editar producto y presentación"
        : "Agregar producto";

    if (producto) {
        [
            "nombre",
            "marca_id",
            "descripcion",
            "imagen",
            "familia_olfativa",
            "tamano_ml",
            "precio",
            "stock"
        ].forEach(nombre => {
            campo(nombre).value = producto[nombre] ?? "";
        });

        campo("notas").value = (producto.notas || []).join(", ");
        campo("activo").checked = producto.activo;
        campo("variante_activa").checked =
            producto.variante_activa ?? true;

        for (const tipo of ["genero", "segmento"]) {
            const categoria = datos.categorias.find(c =>
                c.tipo === tipo &&
                producto.categoria_ids.includes(c.id)
            );

            campo(`${tipo}_id`).value = categoria?.id ?? "";
        }
    } else {
        campo("stock").value = 0;
    }

    editor.showModal();
}

$("nuevo").addEventListener("click", () => {
    abrirEditor();
});

$("cancelar").addEventListener("click", () => {
    editor.close();
});

formProducto.addEventListener("submit", async event => {
    event.preventDefault();

    const boton = formProducto.querySelector('[type="submit"]');
    boton.disabled = true;

    $("errorEditor").textContent = "";

    const producto = Object.fromEntries(new FormData(formProducto));

    producto.activo = campo("activo").checked;
    producto.variante_activa = campo("variante_activa").checked;

    producto.notas = producto.notas
        .split(",")
        .map(nota => nota.trim())
        .filter(Boolean);

    producto.variante_id = editando?.variante_id ?? null;

    try {
        const ruta = editando
            ? `/productos/${editando.id}`
            : "/productos";

        const metodo = editando ? "PUT" : "POST";

        await api(ruta, metodo, producto);

        editor.close();
        mensaje("Producto guardado.");

        await cargarPanel();
    } catch (error) {
        if (editor.open) {
            $("errorEditor").textContent = error.message;
        } else {
            mensaje(error.message);
        }
    } finally {
        boton.disabled = false;
    }
});

$("cancelarEliminar").addEventListener("click", () => {
    confirmacion.close();
});

$("confirmarEliminar").addEventListener("click", async () => {
    if (!eliminando) return;

    const boton = $("confirmarEliminar");
    boton.disabled = true;

    try {
        await api(`/productos/${eliminando.id}`, "DELETE");

        confirmacion.close();
        eliminando = null;

        mensaje("Producto eliminado.");

        await cargarPanel();
    } catch (error) {
        if (confirmacion.open) {
            $("errorEliminar").textContent = error.message;
        } else {
            mensaje(error.message);
        }
    } finally {
        boton.disabled = false;
    }
});

async function iniciar() {
    mensaje("Cargando productos…");

    try {
        await cargarPanel();
        mensaje("");
    } catch (error) {
        mensaje(error.message);
    }
}

const modalCatalogos = $("modalCatalogos");
let catalogoPorEliminar = null;

function cancelarBorradoCatalogo() {
    catalogoPorEliminar = null;
    $("confirmarBorradoCatalogo").hidden = true;
}

function mostrarCatalogos() {
    cancelarBorradoCatalogo();

    const tipo = $("tipoCatalogo").value;

    const elementos = tipo === "marcas"
        ? datos.marcas
        : datos.categorias.filter(c => c.tipo === "segmento");

    const lista = $("listaCatalogos");
    lista.replaceChildren();

    if (!elementos.length) {
        const item = document.createElement("li");
        item.textContent = "Todavía no hay registros.";
        lista.append(item);
        return;
    }

    elementos.forEach(elemento => {
        const item = document.createElement("li");

        const nombre = document.createElement("span");
        nombre.textContent = elemento.nombre;

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "peligro";
        eliminar.textContent = "Eliminar";

        eliminar.addEventListener("click", () => {
            catalogoPorEliminar = {
                tipo,
                id: elemento.id
            };

            $("textoBorradoCatalogo").textContent =
                `¿Eliminar "${elemento.nombre}"?`;

            $("confirmarBorradoCatalogo").hidden = false;
            $("mensajeCatalogo").textContent = "";
        });

        item.append(nombre, eliminar);
        lista.append(item);
    });
}

$("abrirCatalogos").addEventListener("click", () => {
    $("mensajeCatalogo").textContent = "";
    $("formCatalogo").reset();

    mostrarCatalogos();
    modalCatalogos.showModal();
});

$("tipoCatalogo").addEventListener("change", () => {
    $("mensajeCatalogo").textContent = "";
    mostrarCatalogos();
});

$("cerrarCatalogos").addEventListener("click", () => {
    modalCatalogos.close();
});

$("cancelarBorradoCatalogo").addEventListener(
    "click",
    cancelarBorradoCatalogo
);

$("formCatalogo").addEventListener("submit", async event => {
    event.preventDefault();

    const boton = event.currentTarget.querySelector('[type="submit"]');
    boton.disabled = true;

    const tipo = $("tipoCatalogo").value;
    const nombre = $("nombreCatalogo").value.trim();

    try {
        await api(`/catalogos/${tipo}`, "POST", { nombre });

        // Actualiza los datos y los selectores del formulario de productos.
        await cargarPanel();

        mostrarCatalogos();
        $("nombreCatalogo").value = "";
        $("mensajeCatalogo").textContent = "Registro agregado.";
    } catch (error) {
        $("mensajeCatalogo").textContent = error.message;
    } finally {
        boton.disabled = false;
    }
});

$("aceptarBorradoCatalogo").addEventListener("click", async () => {
    if (!catalogoPorEliminar) return;

    const boton = $("aceptarBorradoCatalogo");
    boton.disabled = true;

    const { tipo, id } = catalogoPorEliminar;

    try {
        await api(`/catalogos/${tipo}/${id}`, "DELETE");

        await cargarPanel();
        mostrarCatalogos();

        $("mensajeCatalogo").textContent = "Registro eliminado.";
    } catch (error) {
        $("mensajeCatalogo").textContent = error.message;
        cancelarBorradoCatalogo();
    } finally {
        boton.disabled = false;
    }
});

iniciar();

const formPermisos = document.getElementById("formPermisos");

formPermisos.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document
        .getElementById("emailAdministrador")
        .value.trim()
        .toLowerCase();

    const mensaje = document.getElementById("mensajePermisos");
    const boton = formPermisos.querySelector('button[type="submit"]');

    if (!confirm(`¿Otorgar permisos de administrador a ${email}?`)) {
        return;
    }

    boton.disabled = true;
    mensaje.textContent = "Guardando permisos…";

    try {
        const respuesta = await fetch("/api/admin/usuarios/otorgar-admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || "No se pudieron otorgar permisos.");
        }

        mensaje.textContent = resultado.mensaje;
        formPermisos.reset();
    } catch (error) {
        mensaje.textContent = error.message;
    } finally {
        boton.disabled = false;
    }
});