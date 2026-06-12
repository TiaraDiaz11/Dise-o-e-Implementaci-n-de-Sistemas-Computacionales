let contador = 0;
const botonesCarrito = document.querySelectorAll(".product-card button");
const contadorHTML = document.getElementById("contador");

botonesCarrito.forEach(boton => {

    boton.addEventListener("click", () => {
        contador++;
        contadorHTML.textContent = contador;
        alert("Producto agregado al carrito");
    });

});

const favoritos = document.querySelectorAll(".favorito");

favoritos.forEach(corazon => {
    corazon.addEventListener("click", () => {
        corazon.classList.toggle("activo");

        if(corazon.textContent === "♡"){
            corazon.textContent = "♥";
        }else{
            corazon.textContent = "♡";
        }

    });

});

const buscador = document.getElementById("buscador");

buscador.addEventListener("keyup", () => {
    const texto = buscador.value.toLowerCase();
    const productos = document.querySelectorAll(".product-card");

    productos.forEach(producto => {
        const nombre = producto.querySelector("h3").textContent.toLowerCase();

        if (nombre.includes(texto)){
            producto.style.display = "block";
        }else {
            producto.style.display = "none";
        }

    });

});

const perfumes = document.querySelectorAll(".product-image");

perfumes.forEach(perfume => {
    perfume.addEventListener("click", () => {
        alert("Acá después vamos a abrir la ficha completa del perfume.");
    });
});