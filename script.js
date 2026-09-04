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


// ==============================
// CATÁLOGO
// ==============================

const catalogo = [
    {
        id: 1,
        nombre: "Le Male Elixir",
        marca: "Jean Paul Gaultier",
        precio: 50000,
        genero: "hombre",
        tipo: "disenador",
        imagen: "imagenes/leMaleElixir.jpeg"
    },

    {
        id: 2,
        nombre: "Good Girl Very",
        marca: "Carolina Herrera",
        precio: 41600,
        genero: "mujer",
        tipo: "disenador",
        imagen: "imagenes/goodGirlVery.jpeg"
    },

    {
        id: 3,
        nombre: "Invictus",
        marca: "Paco Rabanne",
        precio: 21000,
        genero: "hombre",
        tipo: "disenador",
        imagen: "imagenes/invictus.jpeg"
    },

    {
        id: 4,
        nombre: "La Bomba",
        marca: "Carolina Herrera",
        precio: 39000,
        genero: "mujer",
        tipo: "disenador",
        imagen: "imagenes/laBomba.jpeg"
    }
];


// ==============================
// GUARDAR DATOS
// ==============================

function guardarDatosLocal() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );
}


// ==============================
// MOSTRAR PRODUCTOS
// ==============================

function renderProductos(lista) {

    productGrid.innerHTML = "";

    lista.forEach(producto => {

        const esFavorito = favoritos.some(
            item => item.id === producto.id
        );

        productGrid.innerHTML += `
            <div
                class="product-card"
                data-id="${producto.id}"
                data-nombre="${producto.nombre}"
                data-marca="${producto.marca}"
                data-precio="${producto.precio}"
                data-genero="${producto.genero}"
                data-tipo="${producto.tipo}"
            >

                <div class="favorito ${esFavorito ? "activo" : ""}">
                    ${esFavorito ? "♥" : "♡"}
                </div>

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    class="product-image"
                >

                <h3>${producto.nombre}</h3>

                <p>${producto.marca}</p>

                <span>
                    $${producto.precio.toLocaleString("es-AR")}
                </span>

                <button>
                    Agregar al carrito
                </button>

            </div>
        `;
    });

    configurarEventosProductos();
}


// ==============================
// EVENTOS DE PRODUCTOS
// ==============================

function configurarEventosProductos() {

    const botonesCarrito =
        document.querySelectorAll(".product-card button");

    const corazones =
        document.querySelectorAll(".favorito");

    const imagenesPerfumes =
        document.querySelectorAll(".product-image");


    // AGREGAR AL CARRITO

    botonesCarrito.forEach(boton => {

        boton.addEventListener("click", () => {

            const producto =
                boton.closest(".product-card");

            const id =
                Number(producto.dataset.id);

            const nombre =
                producto.dataset.nombre;

            const precio =
                Number(producto.dataset.precio);

            const imagen =
                producto.querySelector(".product-image").src;

            const productoExistente =
                carrito.find(item => item.id === id);


            if (productoExistente) {

                productoExistente.cantidad++;

            } else {

                carrito.push({
                    id: id,
                    nombre: nombre,
                    precio: precio,
                    imagen: imagen,
                    cantidad: 1
                });
            }

            guardarDatosLocal();
            actualizarCarrito();
        });
    });


    // FAVORITOS

    corazones.forEach(corazon => {

        corazon.addEventListener("click", () => {

            const producto =
                corazon.closest(".product-card");

            const id =
                Number(producto.dataset.id);

            const nombre =
                producto.dataset.nombre;

            const precio =
                Number(producto.dataset.precio);

            const imagen =
                producto.querySelector(".product-image").src;

            const existe =
                favoritos.find(item => item.id === id);


            if (existe) {

                favoritos = favoritos.filter(
                    item => item.id !== id
                );

                corazon.textContent = "♡";
                corazon.classList.remove("activo");

            } else {

                favoritos.push({
                    id: id,
                    nombre: nombre,
                    precio: precio,
                    imagen: imagen
                });

                corazon.textContent = "♥";
                corazon.classList.add("activo");
            }

            guardarDatosLocal();
            actualizarFavoritos();
        });
    });


    // IMAGEN DEL PERFUME

    imagenesPerfumes.forEach(imagen => {

        imagen.addEventListener("click", () => {

            alert(
                "Acá después vamos a abrir la ficha completa del perfume."
            );

        });

    });
}


// ==============================
// CARRITO
// ==============================

function actualizarCarrito() {

    listaCarrito.innerHTML = "";

    let cantidadTotal = 0;
    let precioTotal = 0;


    if (carrito.length === 0) {

        listaCarrito.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;
    }


    carrito.forEach((producto, index) => {

        cantidadTotal += producto.cantidad;

        precioTotal +=
            producto.precio * producto.cantidad;


        const elemento =
            document.createElement("div");

        elemento.classList.add(
            "producto-carrito"
        );


        elemento.innerHTML = `
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="info-carrito">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    $${producto.precio.toLocaleString("es-AR")}
                </p>

                <div class="cantidad">

                    <button
                        class="restar"
                        data-index="${index}"
                    >
                        -
                    </button>

                    <span>
                        ${producto.cantidad}
                    </span>

                    <button
                        class="sumar"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="eliminar-producto"
                data-index="${index}"
            >
                ×
            </button>
        `;


        listaCarrito.appendChild(elemento);
    });


    contadorCarrito.textContent =
        cantidadTotal;

    totalCarrito.textContent =
        "$" + precioTotal.toLocaleString("es-AR");


    // SUMAR PRODUCTO

    document
        .querySelectorAll(".sumar")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const index =
                    Number(boton.dataset.index);

                carrito[index].cantidad++;

                guardarDatosLocal();
                actualizarCarrito();
            });
        });


    // RESTAR PRODUCTO

    document
        .querySelectorAll(".restar")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const index =
                    Number(boton.dataset.index);


                if (carrito[index].cantidad > 1) {

                    carrito[index].cantidad--;

                } else {

                    carrito.splice(index, 1);
                }

                guardarDatosLocal();
                actualizarCarrito();
            });
        });


    // ELIMINAR PRODUCTO

    document
        .querySelectorAll(".eliminar-producto")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const index =
                    Number(boton.dataset.index);

                carrito.splice(index, 1);

                guardarDatosLocal();
                actualizarCarrito();
            });
        });
}


// ABRIR CARRITO

abrirCarrito.addEventListener("click", () => {

    modalCarrito.classList.add("activo");

    actualizarCarrito();
});


// CERRAR CARRITO

cerrarCarrito.addEventListener("click", () => {

    modalCarrito.classList.remove("activo");
});


// VACIAR CARRITO

vaciarCarrito.addEventListener("click", () => {

    carrito = [];

    guardarDatosLocal();
    actualizarCarrito();
});


// ==============================
// FAVORITOS
// ==============================

function actualizarFavoritos() {

    contadorFavoritos.textContent =
        favoritos.length;

    listaFavoritos.innerHTML = "";


    if (favoritos.length === 0) {

        listaFavoritos.innerHTML = `
            <p class="carrito-vacio">
                No tenés perfumes favoritos.
            </p>
        `;

        return;
    }


    favoritos.forEach((producto, index) => {

        const elemento =
            document.createElement("div");

        elemento.classList.add(
            "producto-favorito"
        );


        elemento.innerHTML = `
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div>

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    $${producto.precio.toLocaleString("es-AR")}
                </p>

            </div>

            <button
                class="eliminar-favorito"
                data-index="${index}"
            >
                ×
            </button>
        `;


        listaFavoritos.appendChild(elemento);
    });


    document
        .querySelectorAll(".eliminar-favorito")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const index =
                    Number(boton.dataset.index);

                const id =
                    favoritos[index].id;

                favoritos.splice(index, 1);


                document
                    .querySelectorAll(".favorito")
                    .forEach(corazon => {

                        const producto =
                            corazon.closest(".product-card");

                        if (
                            Number(producto.dataset.id) === id
                        ) {

                            corazon.textContent = "♡";

                            corazon.classList.remove(
                                "activo"
                            );
                        }
                    });


                guardarDatosLocal();
                actualizarFavoritos();
            });
        });
}


// ABRIR FAVORITOS

abrirFavoritos.addEventListener("click", () => {

    modalFavoritos.classList.add("activo");

    actualizarFavoritos();
});


// CERRAR FAVORITOS

cerrarFavoritos.addEventListener("click", () => {

    modalFavoritos.classList.remove("activo");
});


// ==============================
// BUSCADOR
// ==============================

searchIcon.addEventListener("click", () => {

    searchContainer.classList.toggle("active");


    if (
        searchContainer.classList.contains("active")
    ) {

        buscador.focus();

    } else {

        buscador.value = "";

        aplicarFiltros();
    }
});


buscador.addEventListener(
    "input",
    aplicarFiltros
);


// ==============================
// FILTROS
// ==============================

function aplicarFiltros() {

    const texto =
        buscador.value.toLowerCase().trim();


    const botonActivo =
        document.querySelector(".categoria.activo");


    const filtro =
        botonActivo
            ? botonActivo.dataset.filtro
            : "todos";


    let resultado =
        [...catalogo];


    // BUSCAR

    if (texto) {

        resultado =
            resultado.filter(producto => {

                return (
                    producto.nombre
                        .toLowerCase()
                        .includes(texto)

                    ||

                    producto.marca
                        .toLowerCase()
                        .includes(texto)
                );
            });
    }


    // FILTRAR Y ORDENAR

    if (filtro === "menor-mayor") {

        resultado.sort(
            (a, b) => a.precio - b.precio
        );

    } else if (filtro === "mayor-menor") {

        resultado.sort(
            (a, b) => b.precio - a.precio
        );

    } else if (filtro !== "todos") {

        resultado =
            resultado.filter(producto => {

                return (
                    producto.genero === filtro
                    ||
                    producto.tipo === filtro
                );
            });
    }


    renderProductos(resultado);
}


// BOTONES DE CATEGORÍAS

botonesCategorias.forEach(boton => {

    boton.addEventListener("click", () => {

        botonesCategorias.forEach(b => {

            b.classList.remove("activo");

        });


        boton.classList.add("activo");

        aplicarFiltros();
    });
});


// ==============================
// CONTACTO
// ==============================

botonContacto.addEventListener("click", e => {

    e.preventDefault();

    contactoOpciones.classList.toggle(
        "activo"
    );
});


document.addEventListener("click", e => {

    if (
        !e.target.closest(".contacto-menu")
    ) {

        contactoOpciones.classList.remove(
            "activo"
        );
    }
});


// ==============================
// INICIAR
// ==============================

renderProductos(catalogo);

actualizarCarrito();

actualizarFavoritos();
