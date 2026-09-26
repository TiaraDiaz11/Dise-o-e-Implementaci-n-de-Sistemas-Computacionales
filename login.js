const loginSection = document.getElementById("loginSection");
const registroSection = document.getElementById("registroSection");
const mostrarRegistro = document.getElementById("mostrarRegistro");
const volverLogin = document.getElementById("volverLogin");
const loginForm = document.getElementById("loginForm");
const registroForm = document.getElementById("registroForm");

mostrarRegistro.addEventListener("click", function(event) {
    event.preventDefault();
    loginSection.style.display = "none";
    registroSection.style.display = "block";

});

volverLogin.addEventListener("click", function(event) {
    event.preventDefault();
    registroSection.style.display = "none";
    loginSection.style.display = "block";

});

registroForm.addEventListener("submit", function(event) {

    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("registroEmail").value;
    const password = document.getElementById("registroPassword").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;
    const registroMensaje = document.getElementById("registroMensaje");

    if (password !== confirmarPassword) {
        registroMensaje.textContent = "Las contraseñas no coinciden";
        registroMensaje.style.color = "red";
        return;
    }

    const usuario = { nombre: nombre, email: email, password: password};
    localStorage.setItem("usuario", JSON.stringify(usuario));
    registroMensaje.textContent = "Cuenta creada correctamente";
    registroMensaje.style.color = "green";

    setTimeout(function() {
        registroSection.style.display = "none";
        loginSection.style.display = "block";
        registroForm.reset();
    }, 1000);

});

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginMensaje = document.getElementById("loginMensaje");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
        loginMensaje.textContent = "Primero tenés que crear una cuenta";
        loginMensaje.style.color = "red";
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (email === usuario.email && password === usuario.password) {

        loginMensaje.textContent = "Inicio de sesión correcto";
        loginMensaje.style.color = "green";

        localStorage.setItem("sesionIniciada", "true");

        setTimeout(function() {window.location.href = "index.html"
            ;}, 1000);

    } else {
        loginMensaje.textContent = "Correo o contraseña incorrectos";
        loginMensaje.style.color = "red";
    }

});