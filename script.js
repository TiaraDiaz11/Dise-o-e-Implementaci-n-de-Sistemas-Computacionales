let carrito = [];
let favoritos = [];

const contadorCarrito = document.getElementById("contador");
const abrirCarrito = document.getElementById("abrirCarrito");
const modalCarrito = document.getElementById("modalCarrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const vaciarCarrito = document.getElementById("vaciarCarrito");

const productGrid = document.getElementById("productGrid");

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

        imagen: "assets/img/goodGirlVery.jpeg"
    },
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

    let html = "";

function renderProductos(lista){

    productGrid.innerHTML="";
    
    lista.forEach(producto=>{
        productGrid.innerHTML += `
        <div class="product-card"
            data-id="${producto.id}"
            data-nombre="${producto.nombre}"
            data-marca="${producto.marca}"
            data-precio="${producto.precio}"
            data-genero="${producto.genero}"
            data-tipo="${producto.tipo}">

            <div class="favorito">♡</div>

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                class="product-image">

            <h3>${producto.nombre}</h3>

            <p>${producto.marca}</p>

            <span>$${producto.precio.toLocaleString("es-AR")}</span>

            <button>Agregar al carrito</button>

        </div>

        `;
    });

}

renderProductos(catalogo); //renderiza la funcion de cartas.

const productos = document.querySelectorAll(".product-card"); //importante, no tocar.

function configurarEventosProductos() {

    const botonesCarrito = document.querySelectorAll(".product-card button");
    const corazones = document.querySelectorAll(".favorito");
    const imagenesPerfumes = document.querySelectorAll(".product-image");

    // AGREGAR AL CARRITO

    botonesCarrito.forEach(boton => {

        boton.addEventListener("click", () => {

            const producto = boton.closest(".product-card");

            const id = Number(producto.dataset.id);
            const nombre = producto.dataset.nombre;
            const precio = Number(producto.dataset.precio);
            const imagen = producto.querySelector(".product-image").src;
            const productoExistente = carrito.find(item => item.id === id);

            if (productoExistente) {
                productoExistente.cantidad++;

            } else {
                carrito.push({
                    id,
                    nombre,
                    precio,
                    imagen,
                    cantidad: 1
                });

            }

            actualizarCarrito();
        });
    });

    // FAVORITOS

  corazones.forEach(corazon => {

    corazon.addEventListener("click", () => {

        const producto = corazon.closest(".product-card");
        const id = Number(producto.dataset.id);
        const nombre = producto.dataset.nombre;
        const precio = Number(producto.dataset.precio);
        const imagen = producto.querySelector(".product-image").src;

        const existe = favoritos.find(item => item.id === id);

        if (existe) {

            favoritos = favoritos.filter(
                item => item.id !== id
            );
        });
    }

            corazon.textContent = "♡";
            corazon.classList.remove("activo");

        } else {

            favoritos.push({
                id,
                nombre,
                precio,
                imagen
            });

            corazon.textContent = "♥";
            corazon.classList.add("activo");

    // Categorías

    if (filtro !== "todos") {

        if (filtro === "menor-mayor") {

            resultado.sort((a,b) => a.precio - b.precio);

        } else if (filtro === "mayor-menor") {

            resultado.sort((a,b) => b.precio - a.precio);

        } else {

            resultado = resultado.filter(producto => {

                return (
                    producto.genero === filtro || producto.tipo === filtro
                );
            });

        }
    }

        actualizarFavoritos();
    });
});

    // IMAGEN DEL PERFUME

    imagenesPerfumes.forEach(imagen => {

        imagen.addEventListener("click", () => {
            alert("Acá después vamos a abrir la ficha completa del perfume." );
        });
    });
}

configurarEventosProductos();


function actualizarCarrito(){

    listaCarrito.innerHTML = "";

    let cantidadTotal = 0;

    let precioTotal = 0;


    if(carrito.length === 0){

        listaCarrito.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

    }


    carrito.forEach((producto, index) => {

        cantidadTotal +=
            producto.cantidad;

        precioTotal +=
            producto.precio *
            producto.cantidad;


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
        "$" +
        precioTotal.toLocaleString("es-AR");


    document
        .querySelectorAll(".sumar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            boton.dataset.index
                        );

                    carrito[index].cantidad++;

                    actualizarCarrito();

                }
            );

        });

    document
        .querySelectorAll(".restar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            boton.dataset.index
                        );


                    if(
                        carrito[index].cantidad > 1
                    ){

                        carrito[index].cantidad--;

                    }else{

                        carrito.splice(
                            index,
                            1
                        );

                    }


                    actualizarCarrito();

                }
            );

        });

    document
        .querySelectorAll(
            ".eliminar-producto"
        )
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            boton.dataset.index
                        );

                    carrito.splice(
                        index,
                        1
                    );

                    actualizarCarrito();

                }
            );

        });

}

abrirCarrito.addEventListener(
    "click",
    () => {

        modalCarrito.classList.add(
            "activo"
        );

        actualizarCarrito();

    }
);

cerrarCarrito.addEventListener(
    "click",
    () => {

        modalCarrito.classList.remove(
            "activo"
        );

    }
);

vaciarCarrito.addEventListener(
    "click",
    () => {

        carrito = [];

        actualizarCarrito();

    }
);

const contadorFavoritos =
    document.getElementById(
        "contadorFavoritos"
    );

const abrirFavoritos =
    document.getElementById(
        "abrirFavoritos"
    );

const modalFavoritos =
    document.getElementById(
        "modalFavoritos"
    );

const cerrarFavoritos =
    document.getElementById(
        "cerrarFavoritos"
    );

const listaFavoritos =
    document.getElementById(
        "listaFavoritos"
    );


function actualizarFavoritos() {

    contadorFavoritos.textContent = favoritos.length;
    listaFavoritos.innerHTML = "";

    if (favoritos.length === 0) {

        listaFavoritos.innerHTML = ` <p class="carrito-vacio"> No tenés perfumes favoritos.</p>`;

        return;
    }

    favoritos.forEach((producto, index) => {

        const elemento = document.createElement("div");
        elemento.classList.add("producto-favorito");

        elemento.innerHTML = `

            <img src="${producto.imagen}" alt="${producto.nombre}">

            <div>
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio.toLocaleString("es-AR")}</p>
            </div>

            <button class="eliminar-favorito" data-index="${index}"> × </button>
        `;

        listaFavoritos.appendChild(elemento);
    });

    document.querySelectorAll(".eliminar-favorito").forEach(boton => {
        
        boton.addEventListener("click", () => {
                const index =Number(boton.dataset.index);
                const id = favoritos[index].id;
                favoritos.splice(index, 1);

                document.querySelectorAll(".favorito").forEach(corazon => {

                        const producto =corazon.closest(".product-card");

                        if (Number(producto.dataset.id) === id) {
                            corazon.textContent = "♡";
                            corazon.classList.remove("activo");
                        }
                    });

                actualizarFavoritos();
            });
        });
}

abrirFavoritos.addEventListener("click",() => {
    modalFavoritos.classList.add("activo"); actualizarFavoritos();
});

cerrarFavoritos.addEventListener("click",() => { 
    modalFavoritos.classList.remove("activo");
});

const buscador = document.getElementById("buscador");
const searchIcon = document.querySelector(".search-icon");
const searchContainer = document.querySelector(".search-container");

searchIcon.addEventListener("click",() => {
        searchContainer.classList.toggle("active");

        if(searchContainer.classList.contains("active")){

            buscador.focus();

        }else{
            buscador.value = "";
            aplicarFiltros();
        }
    }
);

            productos.forEach(producto => {
                    producto.style.display = "block";
                }
            );
        }
    }
);


buscador.addEventListener(
    "input",
    () => {

        const texto =
            buscador.value
                .toLowerCase()
                .trim();


        productos.forEach(
            producto => {

                const contenido =
                    producto.textContent
                        .toLowerCase();


                if(
                    contenido.includes(texto)
                ){

                    producto.style.display =
                        "block";

                }else{

                    producto.style.display =
                        "none";

                }

            }
        );

    }
);

const botonesCategorias =
    document.querySelectorAll(
        ".categoria"
    );


botonesCategorias.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                botonesCategorias.forEach(
                    b => {

                        b.classList.remove(
                            "activo"
                        );

                    }
                );


                boton.classList.add(
                    "activo"
                );


                const filtro =
                    boton.dataset.filtro;

                if(
                    filtro === "menor-mayor"
                ){

                    const ordenados =
                        [...productos].sort(
                            (a,b) => {

                                return (
                                    Number(
                                        a.dataset.precio
                                    ) -
                                    Number(
                                        b.dataset.precio
                                    )
                                );

                            }
                        );


                    ordenados.forEach(
                        producto => {

                            producto.style.display =
                                "block";

                            document
                                .querySelector(
                                    ".product-grid"
                                )
                                .appendChild(
                                    producto
                                );

                        }
                    );

                    return;
                }

                if(
                    filtro === "mayor-menor"
                ){

                    const ordenados =
                        [...productos].sort(
                            (a,b) => {

                                return (
                                    Number(
                                        b.dataset.precio
                                    ) -
                                    Number(
                                        a.dataset.precio
                                    )
                                );

                            }
                        );


                    ordenados.forEach(
                        producto => {

                            producto.style.display =
                                "block";

                            document
                                .querySelector(
                                    ".product-grid"
                                )
                                .appendChild(
                                    producto
                                );

                        }
                    );

                    return;
                }


                // FILTROS

                productos.forEach(
                    producto => {

                        const genero =
                            producto.dataset.genero;

                        const tipo =
                            producto.dataset.tipo;


                        if(
                            filtro === "todos"
                        ){

                            producto.style.display =
                                "block";

                        }

                        else if(
                            filtro === genero
                        ){

                            producto.style.display =
                                "block";

                        }

                        else if(
                            filtro === tipo
                        ){

                            producto.style.display =
                                "block";

                        }

                        else{

                            producto.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }
);


const botonContacto =
    document.getElementById(
        "botonContacto"
    );

const contactoOpciones =
    document.getElementById(
        "contactoOpciones"
    );


botonContacto.addEventListener("click", (e) => {
    
    e.preventDefault()
    contactoOpciones.classList.toggle("activo");
    }
);

document.addEventListener("click",(e) => {

        if(!e.target.closest(".contacto-menu")){

            contactoOpciones.classList.remove("activo");

        }
    }
);