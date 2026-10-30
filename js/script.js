let catalogo = [];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const contadorCarrito = document.getElementById("contador");
const abrirCarrito = document.getElementById("abrirCarrito");
const modalCarrito = document.getElementById("modalCarrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const vaciarCarrito = document.getElementById("vaciarCarrito");
const productGrid = document.getElementById("productGrid");
const contadorFavoritos = document.getElementById("contadorFavoritos");
const abrirFavoritos = document.getElementById("abrirFavoritos");
const modalFavoritos = document.getElementById("modalFavoritos");
const cerrarFavoritos = document.getElementById("cerrarFavoritos");
const listaFavoritos = document.getElementById("listaFavoritos");
const buscador = document.getElementById("buscador");
const searchIcon = document.querySelector(".search-icon");
const searchContainer = document.querySelector(".search-container");
const botonesCategorias = document.querySelectorAll(".categoria");
const botonContacto = document.getElementById("botonContacto");
const contactoOpciones = document.getElementById("contactoOpciones");
const modalFicha = document.getElementById("modalFicha");
const cerrarFicha = document.getElementById("cerrarFicha");
const fichaImg = document.getElementById("fichaImg");
const fichaTitulo = document.getElementById("fichaTitulo");
const fichaMarca = document.getElementById("fichaMarca");
const fichaPrecio = document.getElementById("fichaPrecio");
const fichaMl = document.getElementById("fichaMl");
const fichaDesc = document.getElementById("fichaDesc");
const fichaGenero = document.getElementById("fichaGenero");
const fichaNotas = document.getElementById("fichaNotas");
const fichaAgregar = document.getElementById("fichaAgregar");

let productoFicha = null;
let tarjetaOrigen = null;

async function cargarProductos() {
    productGrid.textContent = "Cargando perfumes…";

    try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) { throw new Error(`Error HTTP ${respuesta.status}`); }

        const productos = await respuesta.json();

        if (!Array.isArray(productos)) { throw new Error("El servidor no devolvió una lista"); }

        catalogo = productos;
        aplicarFiltros();
        actualizarCarrito();
        actualizarFavoritos();
    } catch (error) {
        console.error("Error al cargar productos:", error);

        productGrid.textContent = "No se pudieron cargar los perfumes. Recargá la página para reintentar.";
    }
}

function guardarDatosLocal() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-AR");
}

function obtenerMl(producto) {
    if (producto.ml) return producto.ml;
    return catalogo.find(p => p.id === producto.id)?.cantidadml || "";
}

function renderProductos(lista) {
    if (lista.length === 0) {
        productGrid.innerHTML = `
            <p class="sin-resultados">No se encontraron resultados</p>
        `;
        return;
    }

    productGrid.innerHTML = lista.map((producto, index) => {
        const esFavorito = favoritos.some(item => item.id === producto.id);

        return `
            <div class="product-card" data-id="${producto.id}" style="--i:${index}">
                <div class="favorito ${esFavorito ? "activo" : ""}">${esFavorito ? "♥" : "♡"}</div>
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                <h3>${producto.nombre}</h3>
                <p>${producto.marca}</p>
                <p class="product-card__ml">${producto.cantidadml}</p>
                <span>${formatearPrecio(producto.precio)}</span>
                <button ${producto.stock <= 0 ? "disabled" : ""}>
                  ${producto.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
                </button>
            </div>
        `;
    }).join("");
}

function configurarEventosProductos() {
    productGrid.addEventListener("click", e => {
        const card = e.target.closest(".product-card");
        if (!card) return;

        const producto = catalogo.find(p => p.id === Number(card.dataset.id));
        if (!producto) return;

        if (e.target.closest(".favorito")) {
            alternarFavorito(producto, card);
        } else if (e.target.closest("button")) {
            agregarAlCarrito(producto);
        } else if (e.target.closest(".product-image")) {
            abrirFicha(producto, card);
        }
    });
}

function alternarFavorito(producto, card) {
    const existe = favoritos.find(item => item.id === producto.id);
    const corazon = card.querySelector(".favorito");

    if (existe) {
        favoritos = favoritos.filter(item => item.id !== producto.id);
        corazon.textContent = "♡";
        corazon.classList.remove("activo");
    } else {
        favoritos.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            ml: producto.cantidadml
        });
        corazon.textContent = "♥";
        corazon.classList.add("activo");
    }

    guardarDatosLocal();
    actualizarFavoritos();
}

function agregarAlCarrito(producto) {
    const existente = carrito.find(item => item.id === producto.id);
    const cantidadActual = existente ? existente.cantidad : 0;

    if (cantidadActual >= producto.stock) {
        mostrarNotificacion(
            producto.stock <= 0 ? "Esta presentación está sin stock." : `Ya agregaste las ${producto.stock} unidades disponibles.`
        );
        return;
    }

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            ml: producto.cantidadml,
            cantidad: 1
        });
    }

    guardarDatosLocal();
    actualizarCarrito();
}

function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let cantidadTotal = 0;
    let precioTotal = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
    }

    carrito.forEach((producto, index) => {
        cantidadTotal += producto.cantidad;
        precioTotal += producto.precio * producto.cantidad;
        const elemento = document.createElement("div");
        elemento.classList.add("producto-carrito");
        elemento.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info-carrito">
                <h3>${producto.nombre}</h3>
                <p>${formatearPrecio(producto.precio)} <em class="ml">· ${obtenerMl(producto)}</em></p>
                <div class="cantidad">
                    <button class="restar" data-index="${index}">&minus;</button>
                    <span>${producto.cantidad}</span>
                    <button class="sumar" data-index="${index}">+</button>
                </div>
            </div>
            <button class="eliminar-producto" data-index="${index}">×</button>
        `;

        listaCarrito.appendChild(elemento);
    });

    contadorCarrito.textContent = cantidadTotal;
    totalCarrito.textContent = formatearPrecio(precioTotal);

    listaCarrito.querySelectorAll(".sumar").forEach(boton => {
        boton.addEventListener("click", () => {
            const item = carrito[Number(boton.dataset.index)];
            const producto = catalogo.find(p => p.id === item.id);
            
            if (!producto) {
                mostrarNotificacion("Esta presentación no está disponible en el catálogo.");
                return;
            }
            agregarAlCarrito(producto);
        });
    });

    listaCarrito.querySelectorAll(".restar").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = Number(boton.dataset.index);

            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            } else {
                carrito.splice(index, 1);
            }

            guardarDatosLocal();
            actualizarCarrito();
        });
    });

    listaCarrito.querySelectorAll(".eliminar-producto").forEach(boton => {
        boton.addEventListener("click", () => {
            carrito.splice(Number(boton.dataset.index), 1);
            guardarDatosLocal();
            actualizarCarrito();
        });
    });
}

function actualizarFavoritos() {
    contadorFavoritos.textContent = favoritos.length;
    listaFavoritos.innerHTML = "";

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = `<p class="carrito-vacio">No tenés perfumes favoritos.</p>`;
        return;
    }

    favoritos.forEach((producto, index) => {
        const elemento = document.createElement("div");
        elemento.classList.add("producto-favorito");
        elemento.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div>
                <h3>${producto.nombre}</h3>
                <p>${formatearPrecio(producto.precio)} <em class="ml">· ${obtenerMl(producto)}</em></p>
            </div>
            <button class="eliminar-favorito" data-index="${index}">×</button>
        `;

        listaFavoritos.appendChild(elemento);
    });

    listaFavoritos.querySelectorAll(".eliminar-favorito").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = Number(boton.dataset.index);
            const id = favoritos[index].id;
            favoritos.splice(index, 1);

            productGrid.querySelectorAll(".favorito").forEach(corazon => {
                const producto = corazon.closest(".product-card");

                if (Number(producto.dataset.id) === id) {
                    corazon.textContent = "♡";
                    corazon.classList.remove("activo");
                }
            });

            guardarDatosLocal();
            actualizarFavoritos();
        });
    });
}

function abrirFicha(producto, card) {
    productoFicha = producto;
    tarjetaOrigen = card;
    fichaImg.src = producto.imagen;
    fichaImg.alt = producto.nombre;
    fichaTitulo.textContent = producto.nombre;
    fichaMarca.textContent = producto.marca;
    fichaPrecio.textContent = formatearPrecio(producto.precio);
    fichaMl.textContent = producto.cantidadml;
    fichaDesc.textContent = producto.descripcion;
    fichaGenero.textContent = producto.genero;
    fichaNotas.innerHTML = producto.notas

        .map(nota => `<li>${nota}</li>`)
        .join("");
    
        modalFicha.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modalFicha.classList.add("is-open"));
    cerrarFicha.focus();
}

function cerrarModalFicha() {
    modalFicha.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { modalFicha.hidden = true; }, 350);
    tarjetaOrigen?.querySelector(".product-image")?.focus();
}

abrirCarrito.addEventListener("click", () => {
    modalCarrito.classList.add("activo");
    actualizarCarrito();
});

cerrarCarrito.addEventListener("click", () => {
    modalCarrito.classList.remove("activo");
});

vaciarCarrito.addEventListener("click", () => {
    carrito = [];
    guardarDatosLocal();
    actualizarCarrito();
});

abrirFavoritos.addEventListener("click", () => {
    modalFavoritos.classList.add("activo");
    actualizarFavoritos();
});

cerrarFavoritos.addEventListener("click", () => {
    modalFavoritos.classList.remove("activo");
});

modalFicha.addEventListener("click", e => {
    if (e.target.closest("[data-cerrar-ficha]")) cerrarModalFicha();
});

fichaAgregar.addEventListener("click", () => {
    if (!productoFicha) return;
    agregarAlCarrito(productoFicha);
    fichaAgregar.textContent = "Agregado ✓";
    setTimeout(() => { fichaAgregar.textContent = "Agregar al carrito"; }, 1400);
});

document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!modalFicha.hidden) cerrarModalFicha();
    modalCarrito.classList.remove("activo");
    modalFavoritos.classList.remove("activo");
});

searchIcon.addEventListener("click", () => {
    searchContainer.classList.toggle("active");

    if (searchContainer.classList.contains("active")) {
        buscador.focus();
    } else {
        buscador.value = "";
        aplicarFiltros();
    }
});

buscador.addEventListener("input", aplicarFiltros);

function aplicarFiltros() {
    const texto = buscador.value.toLowerCase().trim();
    const botonActivo = document.querySelector(".categoria.activo");
    const filtro = botonActivo ? botonActivo.dataset.filtro : "todos";
    let resultado = [...catalogo];

    if (texto) {
        resultado = resultado.filter(producto => {
            return producto.nombre.toLowerCase().includes(texto) ||
            producto.marca.toLowerCase().includes(texto);
        });
    }

    if (filtro === "menor-mayor") {
        resultado.sort((a, b) => a.precio - b.precio);
    } else if (filtro === "mayor-menor") {
        resultado.sort((a, b) => b.precio - a.precio);
    } else if (filtro !== "todos") {
        resultado = resultado.filter(producto => {
            return producto.genero === filtro || producto.tipo === filtro;
        });
    }

    renderProductos(resultado);
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", () => {
        botonesCategorias.forEach(b => b.classList.remove("activo"));
        boton.classList.add("activo");
        aplicarFiltros();
    });
});

botonContacto.addEventListener("click", e => {
    e.preventDefault();
    contactoOpciones.classList.toggle("activo");
});

document.addEventListener("click", e => {
    if (!e.target.closest(".contacto-menu")) {
        contactoOpciones.classList.remove("activo");
    }
});

const nombreOpinion = document.getElementById("nombreOpinion");
const textoOpinion = document.getElementById("textoOpinion");
const botonesEstrellas = document.querySelectorAll(".estrellas button");
const publicarOpinion = document.getElementById("publicarOpinion");
const listaOpiniones = document.getElementById("listaOpiniones");
const mensajeOpinion = document.getElementById("mensajeOpinion");

let estrellasSeleccionadas = 0;

botonesEstrellas.forEach(boton => {
    boton.addEventListener("click", () => {
        estrellasSeleccionadas = Number(boton.dataset.estrellas);

        botonesEstrellas.forEach(estrella => {
            if (Number(estrella.dataset.estrellas) <= estrellasSeleccionadas) {
                estrella.classList.add("seleccionada");
            } else {
                estrella.classList.remove("seleccionada");
            }
        });
    });
});

function mostrarOpiniones() {
    listaOpiniones.innerHTML = "";

    const opiniones = JSON.parse(localStorage.getItem("opiniones")) || [];

    if (opiniones.length === 0) {
        listaOpiniones.innerHTML = `
            <p class="sin-opiniones">
                Todavía no hay opiniones. ¡Sé el primero en dejar la tuya!
            </p>
        `;
        return;
    }

    opiniones.forEach(opinion => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("review-card");

        const nombre = document.createElement("h4");
        nombre.textContent = opinion.nombre;

        const texto = document.createElement("p");
        texto.textContent = `"${opinion.texto}"`;

        const estrellas = document.createElement("div");
        estrellas.classList.add("estrellas-mostradas");

        for (let i = 0; i < opinion.estrellas; i++) {
            estrellas.textContent += "★";
        }

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(texto);
        tarjeta.appendChild(estrellas);

        listaOpiniones.appendChild(tarjeta);
    });
}

publicarOpinion.addEventListener("click", () => {
    const nombre = nombreOpinion.value.trim();
    const texto = textoOpinion.value.trim();

    if (nombre === "" || texto === "" || estrellasSeleccionadas === 0) {
        mensajeOpinion.textContent = "Completá todos los campos y elegí una cantidad de estrellas.";
        mensajeOpinion.style.color = "red";
        return;
    }

    const opiniones = JSON.parse(localStorage.getItem("opiniones")) || [];

    const nuevaOpinion = {
        nombre: nombre,
        texto: texto,
        estrellas: estrellasSeleccionadas
    };

    opiniones.push(nuevaOpinion);

    localStorage.setItem("opiniones", JSON.stringify(opiniones));

    mensajeOpinion.textContent = "¡Gracias por dejar tu opinión!";
    mensajeOpinion.style.color = "green";

    nombreOpinion.value = "";
    textoOpinion.value = "";
    estrellasSeleccionadas = 0;

    botonesEstrellas.forEach(estrella => {
        estrella.classList.remove("seleccionada");
    });

    mostrarOpiniones();
});

const notificacion = document.getElementById("notificacion");
const notificacionTexto = document.getElementById("notificacionTexto");
const cerrarNotificacion = document.getElementById("cerrarNotificacion");

let temporizadorNotificacion;

function ocultarNotificacion() {
    clearTimeout(temporizadorNotificacion);
    notificacion.classList.remove("visible");
}

function mostrarNotificacion(mensaje) {
    clearTimeout(temporizadorNotificacion);

    notificacionTexto.textContent = mensaje;
    notificacion.classList.add("visible");

    temporizadorNotificacion = setTimeout(() => {
        ocultarNotificacion();
    }, 4000);
}

cerrarNotificacion.addEventListener("click", ocultarNotificacion);

configurarEventosProductos();
actualizarCarrito();
actualizarFavoritos();
mostrarOpiniones();
cargarProductos();