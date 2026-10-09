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
    },
    {
        id: 5,
        nombre: "Khamrah Qahwa",
        marca: "Lattafa",
        precio: 43000,
        cantidadml: "100ml",
        genero: "unisex",
        tipo: "oriental",
        imagen: "imagenes/lattafaKhamrah.jpg",
        descripcion: "Es una fragancia cálida, opulenta y de tinte gourmand (dulce y comestible), famosa por su gran parecido conceptual a los postres especiados y licores frente a la chimenea.",
        notas: ["Canela", "Nuez Moscada" , "Bergamota"]
    },
    {
        id: 6,
        nombre: "Khamrah Waha",
        marca: "Lattafa",
        precio: 43000,
        cantidadml: "100ml",
        genero: "unisex",
        tipo: "Aromática Acuática",
        imagen: "imagenes/waha.jpg",
        descripcion: "Inicia con un fuerte chispante cítrico y notas acuáticas/saladas (destacando el pepino y la bergamota) para luego dar paso a un secado dulce, amaderado y avainillado característico del fondo de haba tonka y vainilla",
        notas: ["Yuzu","Bergamota", "Enebro", "Jengibre"]
    },
    {
        id: 7,
        nombre: "Le Beau",
        marca: "Jean Paul Galtier",
        precio: 40000,
        cantidadml: "125ml",
        genero: "hombre",
        tipo: "Amaderada Aromática",
        imagen: "imagenes/leBeau-Jean.jpg",
        descripcion: "Es una fragancia tropical, dulce, fresca y muy seductora, reconocida por su característico toque cremoso de coco combinado con la calidez del haba tonka.",
        notas: ["Bergamota", "Madera de coco", "Haba Tonka"]
    },
    {
        id: 8,
        nombre: "Erba Pura",
        marca: "Xerjoff",
        precio: 43000,
        cantidadml: "100ml",
        genero: "unisex",
        tipo: "Oriental",
        imagen: "imagenes/Erba.jpg",
        descripcion:" Destaca por ser un aroma dulce, alegre, estridente y sumamente almizclado que no pasa desapercibido. Debido a su potencia, se recomienda moderar las aplicaciones para evitar que resulte invasivo en espacios cerrados.",
        notas: [" Naranja Siciliana", "Bergamota de Calabria", "Limón Siciliano"]
    },
    {
        id: 9,
        nombre: "Erba Pura Full-BOX",
        marca: "Xerjoff",
        precio: 46000,
        cantidadml: "100ml",
        genero: "unisex",
        tipo: "Oriental",
        imagen: "imagenes/Xerjoff-erba-pura-paquete.jpg",
        descripcion:" Destaca por ser un aroma dulce, alegre, estridente y sumamente almizclado que no pasa desapercibido. Debido a su potencia, se recomienda moderar las aplicaciones para evitar que resulte invasivo en espacios cerrados. Hecho en una caja más elegante, ideal para resaltar entre el resto.",
        notas: [" Naranja Siciliana", "Bergamota de Calabria", "Limón Siciliano"]
    },
    {
        id: 10,
        nombre: "Le Male Le Parfum",
        marca: "Jean Paul Galtier",
        precio: 40000,
        cantidadml: "100ml",
        genero: "hombre",
        tipo: "Oriental",
        imagen: "imagenes/leMale-Jean.jpg",
        descripcion:"Fragancia masculina intensa, elegante y sofisticada. Combina la frescura aromática del cardamomo con un corazón cálido de lavanda e iris, sobre un fondo envolvente de vainilla y notas amaderadas. Su aroma es profundo, especiado y sensual, ideal para la noche, ocasiones especiales y días frescos..",
        notas: ["Cardamomo","Lavanda","Iris","Vainilla","Notas amaderadas"]
    },
    {
        id: 11,
        nombre: "Art Of Universe",
        marca: "Lattafa",
        precio: 43000,
        cantidadml: "100ml",
        genero: "unisex",
        tipo: "arabe",
        imagen: "imagenes/art-lataffa.jpg",
        descripcion:"Cítrico, frutal y fresco. Abre con notas vibrantes de mandarina y bergamota, acompañadas por el toque especiado del jengibre y la frescura de la menta. En el corazón aparecen la pera jugosa y la flor de azahar, mientras que el almizcle, el ámbar y el cedro aportan un cierre cálido y elegante.",
        notas: ["Mandarina", "Bergamota", "Pera", "Flor de azahar", "Almizcle", "Ámbar", "Cedro"]
    },
    {
        id: 12,
        nombre: "Le Male",
        marca: "Jean Paul Galtier",
        precio: 40000,
        cantidadml: "100ml",
        genero: "hombre",
        tipo: "Oriental",
        imagen: "imagenes/leMale-Celeste.jpg",
        descripcion:"Fragancia masculina fresca, aromática y envolvente. Combina notas verdes y refrescantes con un corazón aromático y un fondo cálido y cremoso, creando un aroma atractivo, moderno y versátil, ideal para destacar tanto de día como de noche.",
        notas: ["Menta", "Lavanda", "Vainilla","Pimienta blanca","Notas marinas", "Ámbar", "Notas amaderadas"]
    },
    {
        id: 13,
        nombre: "Le Male Ultra Elixir",
        marca: "Jean Paul Galtier",
        precio: 40000,
        cantidadml: "125ml",
        genero: "hombre",
        tipo: "Oriental",
        imagen: "imagenes/leMale-UltraElixir.jpg",
        descripcion:"Oriental fougère, dulce e intenso. Abre con una combinación frutal y fresca de pera, lavanda, menta, bergamota y limón. Evoluciona hacia un corazón especiado de canela, esclarea y alcaravea, y cierra con un fondo magnético de vainilla negra, ámbar, pachulí y madera de cedro.",
        notas: ["Pera","Canela","Vainilla negra","Pachulí"]
    }
];

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

configurarEventosProductos();
renderProductos(catalogo);
actualizarCarrito();
actualizarFavoritos();
mostrarOpiniones();