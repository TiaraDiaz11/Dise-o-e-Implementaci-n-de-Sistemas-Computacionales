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

// --- Ficha del perfume ---
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

const catalogo = [
    {
        id: 1,
        nombre: "Le Male Elixir",
        marca: "Jean Paul Gaultier",
        precio: 33000,
        cantidadml: "125ml",
        genero: "hombre",
        tipo: "disenador",
        imagen: "imagenes/leMaleElixir.jpeg",
        descripcion: "Eau de parfum amaderada e intensa. Bergamota y almizclero en la apertura, lavanda en el corazon y un fondo de vainilla, vetiver y cedro. Excelente para la noche.",
        notas: ["Bergamota", "Lavanda", "Vainilla", "Cedro"]
    },
    {
        id: 2,
        nombre: "Good Girl Very",
        marca: "Carolina Herrera",
        precio: 41600,
        cantidadml: "90ml",
        genero: "mujer",
        tipo: "disenador",
        imagen: "imagenes/goodGirlVery.jpeg",
        descripcion: "Floral oriental y envolvente. Abre con pera y naranja blood, evoluciona hacia un corazon de jazmin y cierra con patchouli y vainilla.",
        notas: ["Pera", "Jazmin", "Patchouli", "Vainilla"]
    },
    {
        id: 3,
        nombre: "Invictus",
        marca: "Paco Rabanne",
        precio: 21000,
        cantidadml: "100ml",
        genero: "hombre",
        tipo: "disenador",
        imagen: "imagenes/invictus.jpeg",
        descripcion: "Acuatico y fresco. Naranja y notas marinas en la salida, con un corazon de lavanda y un fondo de vetiver y almizcle blanco. Hasta 12 horas de duracion.",
        notas: ["Naranja", "Notas marinas", "Lavanda", "Almizcle"]
    },
    {
        id: 4,
        nombre: "La Bomba",
        marca: "Carolina Herrera",
        precio: 39000,
        cantidadml: "50ml",
        genero: "mujer",
        tipo: "disenador",
        imagen: "imagenes/laBomba.jpeg",
        descripcion: "Gourmand intenso. Canela, caramelo y praline en el corazon, sobre una base de vainilla y tonka bean que deja un rastro dulce.",
        notas: ["Canela", "Caramelo", "Praline", "Vainilla"]
    }
];

function guardarDatosLocal() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-AR");
}

// los items ya guardados en localStorage no tienen "ml": lo busca en el catálogo
function obtenerMl(producto) {
    if (producto.ml) return producto.ml;
    return catalogo.find(p => p.id === producto.id)?.cantidadml || "";
}

// --- Render del catálogo ---
function renderProductos(lista) {
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
                <button>Agregar al carrito</button>
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

// --- Favoritos / Carrito ---
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
            carrito[Number(boton.dataset.index)].cantidad++;
            guardarDatosLocal();
            actualizarCarrito();
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

// --- Ficha del perfume ---
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

// --- Eventos estáticos (una sola vez) ---
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

// --- Init ---
configurarEventosProductos();
renderProductos(catalogo);
actualizarCarrito();
actualizarFavoritos();
