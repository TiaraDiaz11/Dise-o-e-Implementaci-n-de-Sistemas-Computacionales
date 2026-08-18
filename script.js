// ==========================================
// VARIABLES
// ==========================================

let carrito = [];

let favoritos = [];


// ==========================================
// PRODUCTOS
// ==========================================

const productos =
    Array.from(
        document.querySelectorAll(".product-card")
    );


// ==========================================
// CARRITO
// ==========================================

const botonesCarrito =
    document.querySelectorAll(
        ".product-card button"
    );

const contadorCarrito =
    document.getElementById("contador");

const abrirCarrito =
    document.getElementById("abrirCarrito");

const modalCarrito =
    document.getElementById("modalCarrito");

const cerrarCarrito =
    document.getElementById("cerrarCarrito");

const listaCarrito =
    document.getElementById("listaCarrito");

const totalCarrito =
    document.getElementById("totalCarrito");

const vaciarCarrito =
    document.getElementById("vaciarCarrito");


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

botonesCarrito.forEach(boton => {

    boton.addEventListener("click", () => {

        const producto =
            boton.closest(".product-card");

        const nombre =
            producto.dataset.nombre;

        const precio =
            Number(producto.dataset.precio);

        const imagen =
            producto.querySelector(
                ".product-image"
            ).src;


        const productoExistente =
            carrito.find(
                item => item.nombre === nombre
            );


        if (productoExistente) {

            productoExistente.cantidad++;

        } else {

            carrito.push({

                nombre: nombre,

                precio: precio,

                imagen: imagen,

                cantidad: 1

            });

        }


        actualizarCarrito();

    });

});


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

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


    // SUMAR

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


    // RESTAR

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


    // ELIMINAR

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


// ==========================================
// ABRIR CARRITO
// ==========================================

abrirCarrito.addEventListener(
    "click",
    () => {

        modalCarrito.classList.add(
            "activo"
        );

        actualizarCarrito();

    }
);


// ==========================================
// CERRAR CARRITO
// ==========================================

cerrarCarrito.addEventListener(
    "click",
    () => {

        modalCarrito.classList.remove(
            "activo"
        );

    }
);


// ==========================================
// VACIAR CARRITO
// ==========================================

vaciarCarrito.addEventListener(
    "click",
    () => {

        carrito = [];

        actualizarCarrito();

    }
);


// ==========================================
// FAVORITOS
// ==========================================

const corazones =
    document.querySelectorAll(
        ".favorito"
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


// ==========================================
// AGREGAR / QUITAR FAVORITO
// ==========================================

corazones.forEach(corazon => {

    corazon.addEventListener(
        "click",
        () => {

            const producto =
                corazon.closest(
                    ".product-card"
                );

            const nombre =
                producto.dataset.nombre;

            const precio =
                Number(
                    producto.dataset.precio
                );

            const imagen =
                producto.querySelector(
                    ".product-image"
                ).src;


            const existe =
                favoritos.find(
                    item =>
                        item.nombre === nombre
                );


            if(existe){

                favoritos =
                    favoritos.filter(
                        item =>
                            item.nombre !== nombre
                    );

                corazon.textContent = "♡";

                corazon.classList.remove(
                    "activo"
                );

            }else{

                favoritos.push({

                    nombre: nombre,

                    precio: precio,

                    imagen: imagen

                });

                corazon.textContent = "♥";

                corazon.classList.add(
                    "activo"
                );

            }


            actualizarFavoritos();

        }
    );

});


// ==========================================
// ACTUALIZAR FAVORITOS
// ==========================================

function actualizarFavoritos(){

    contadorFavoritos.textContent =
        favoritos.length;


    listaFavoritos.innerHTML = "";


    if(favoritos.length === 0){

        listaFavoritos.innerHTML = `
            <p class="carrito-vacio">
                No tenés perfumes favoritos.
            </p>
        `;

        return;

    }


    favoritos.forEach(
        (producto, index) => {

            const elemento =
                document.createElement(
                    "div"
                );

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


            listaFavoritos.appendChild(
                elemento
            );

        }
    );


    document
        .querySelectorAll(
            ".eliminar-favorito"
        )
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            boton.dataset.index
                        );

                    const nombre =
                        favoritos[index]
                            .nombre;


                    favoritos.splice(
                        index,
                        1
                    );


                    corazones.forEach(
                        corazon => {

                            const producto =
                                corazon.closest(
                                    ".product-card"
                                );


                            if(
                                producto.dataset.nombre ===
                                nombre
                            ){

                                corazon.textContent =
                                    "♡";

                                corazon.classList.remove(
                                    "activo"
                                );

                            }

                        }
                    );


                    actualizarFavoritos();

                }
            );

        });

}


// ==========================================
// ABRIR FAVORITOS
// ==========================================

abrirFavoritos.addEventListener(
    "click",
    () => {

        modalFavoritos.classList.add(
            "activo"
        );

        actualizarFavoritos();

    }
);


// ==========================================
// CERRAR FAVORITOS
// ==========================================

cerrarFavoritos.addEventListener(
    "click",
    () => {

        modalFavoritos.classList.remove(
            "activo"
        );

    }
);


// ==========================================
// BUSCADOR
// ==========================================

const buscador =
    document.getElementById(
        "buscador"
    );

const searchIcon =
    document.querySelector(
        ".search-icon"
    );

const searchContainer =
    document.querySelector(
        ".search-container"
    );


searchIcon.addEventListener(
    "click",
    () => {

        searchContainer.classList.toggle(
            "active"
        );


        if(
            searchContainer.classList.contains(
                "active"
            )
        ){

            buscador.focus();

        }else{

            buscador.value = "";

            productos.forEach(
                producto => {

                    producto.style.display =
                        "block";

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


// ==========================================
// CATEGORÍAS
// ==========================================

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


                // MENOR A MAYOR

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


                // MAYOR A MENOR

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


// ==========================================
// IMÁGENES DE PERFUMES
// ==========================================

const imagenesPerfumes =
    document.querySelectorAll(
        ".product-image"
    );


imagenesPerfumes.forEach(
    imagen => {

        imagen.addEventListener(
            "click",
            () => {

                alert(
                    "Acá después vamos a abrir la ficha completa del perfume."
                );

            }
        );

    }
);


// ==========================================
// MENÚ CONTACTO
// ==========================================

const botonContacto =
    document.getElementById(
        "botonContacto"
    );

const contactoOpciones =
    document.getElementById(
        "contactoOpciones"
    );


botonContacto.addEventListener(
    "click",
    (e) => {

        e.preventDefault();

        contactoOpciones.classList.toggle(
            "activo"
        );

    }
);


// CERRAR CONTACTO AL HACER CLIC AFUERA

document.addEventListener(
    "click",
    (e) => {

        if(
            !e.target.closest(
                ".contacto-menu"
            )
        ){

            contactoOpciones.classList.remove(
                "activo"
            );

        }

    }
);