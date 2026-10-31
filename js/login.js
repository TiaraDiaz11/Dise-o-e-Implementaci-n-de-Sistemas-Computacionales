const loginSection = document.getElementById("loginSection");
const registroSection = document.getElementById("registroSection");
const mostrarRegistro = document.getElementById("mostrarRegistro");
const volverLogin = document.getElementById("volverLogin");
const loginForm = document.getElementById("loginForm");
const registroForm = document.getElementById("registroForm");

const loginPassword = document.getElementById("loginPassword");
const mostrarPassword = document.getElementById("mostrarPassword");
const iconoPassword = document.getElementById("iconoPassword");

mostrarPassword.addEventListener("click", () => {
    if (loginPassword.type === "password") {
        loginPassword.type = "text";
        mostrarPassword.setAttribute("aria-label", "Ocultar contraseña");

        iconoPassword.innerHTML = `
            <path d="M3 3l18 18"></path>
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path>
            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.1 3.7"></path>
            <path d="M6.1 6.1C3.5 7.8 2 12 2 12s3.5 7 10 7a10.8 10.8 0 0 0 2.1-.2"></path>
        `;
    } else {
        loginPassword.type = "password";
        mostrarPassword.setAttribute("aria-label", "Mostrar contraseña");

        iconoPassword.innerHTML = `
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>
            <circle cx="12" cy="12" r="2.5"></circle>
        `;
    }
});

mostrarRegistro.addEventListener("click", event => {
    event.preventDefault();

    loginSection.style.display = "none";
    registroSection.style.display = "block";
});

volverLogin.addEventListener("click", event => {
    event.preventDefault();

    registroSection.style.display = "none";
    loginSection.style.display = "block";
});

registroForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("registroEmail").value.trim();
    const password = document.getElementById("registroPassword").value;
    const confirmarPassword =
        document.getElementById("confirmarPassword").value;

    const mensaje = document.getElementById("registroMensaje");
    const boton = registroForm.querySelector('button[type="submit"]');

    if (password !== confirmarPassword) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.style.color = "red";
        return;
    }

    boton.disabled = true;
    mensaje.textContent = "Creando cuenta…";
    mensaje.style.color = "";

    try {
        const respuesta = await fetch("/api/auth/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                email,
                password
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) { throw new Error(resultado.error || "No se pudo crear la cuenta."); }

        mensaje.textContent = resultado.mensaje;
        mensaje.style.color = "green";

        registroForm.reset();
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = "red";
    } finally {
        boton.disabled = false;
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = loginPassword.value;
    const mensaje = document.getElementById("loginMensaje");
    const boton = loginForm.querySelector('button[type="submit"]');

    boton.disabled = true;
    mensaje.textContent = "Iniciando sesión…";
    mensaje.style.color = "";

    try {
        const respuesta = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.error || "No se pudo iniciar sesión."
            );
        }

        // Quitar los datos del sistema anterior.
        localStorage.removeItem("usuario");
        localStorage.removeItem("sesionIniciada");

        window.location.href = "/Views/index.html";
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = "red";
    } finally {
        boton.disabled = false;
    }
});