const express = require("express");
const bcrypt = require("bcryptjs");
const { rateLimit } = require("express-rate-limit");
const pool = require("./db");

const router = express.Router();

router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");

    if (
        req.method !== "GET" &&
        req.get("origin") !== process.env.APP_ORIGIN
    ) {
        return res.status(403).json({
            error: "Origen no permitido."
        });
    }

    next();
});

const limitarIntentos = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: {
        error: "Demasiados intentos. Probá nuevamente en unos minutos."
    }
});

router.post("/registro", limitarIntentos, async (req, res) => {
    const { nombre, email, password } = req.body || {};

    if (
        typeof nombre !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            error: "Completá todos los campos."
        });
    }

    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim().toLowerCase();

    if (!nombreLimpio || nombreLimpio.length > 100) {
        return res.status(400).json({
            error: "El nombre debe tener entre 1 y 100 caracteres."
        });
    }

    if (
        emailLimpio.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)
    ) {
        return res.status(400).json({
            error: "Ingresá un correo válido."
        });
    }

    if (
        password.length < 8 ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        return res.status(400).json({
            error: "Usá una contraseña de al menos 8 caracteres y como máximo 72 bytes."
        });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(`
        INSERT INTO usuarios (nombre, email, password_hash, admin)
        VALUES ($1, $2, $3, FALSE)
    `, [nombreLimpio, emailLimpio, passwordHash]);

    res.status(201).json({
        mensaje: "Cuenta creada correctamente. Ya podés iniciar sesión."
    });
});

router.post("/login", limitarIntentos, async (req, res) => {
    const { email, password } = req.body || {};

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        email.length > 254 ||
        !password ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        return res.status(400).json({
            error: "Ingresá un correo y una contraseña válidos."
        });
    }

    const resultado = await pool.query(`
        SELECT id, nombre, email, password_hash, admin
        FROM usuarios
        WHERE email = $1
    `, [email.trim().toLowerCase()]);

    const usuario = resultado.rows[0];

    if (!usuario) {
        return res.status(401).json({
            error: "Correo o contraseña incorrectos."
        });
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordCorrecta) {
        return res.status(401).json({
            error: "Correo o contraseña incorrectos."
        });
    }

    req.session.regenerate((error) => {
        if (error) {
            return res.status(500).json({
                error: "No se pudo iniciar la sesión."
            });
        }

        req.session.usuarioId = usuario.id;

        req.session.save((error) => {
            if (error) {
                return res.status(500).json({
                    error: "No se pudo guardar la sesión."
                });
            }

            res.json({
                mensaje: "Inicio de sesión correcto.",
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    admin: usuario.admin
                }
            });
        });
    });
});

router.get("/yo", async (req, res) => {
    if (!req.session.usuarioId) {
        return res.json({ usuario: null });
    }

    const resultado = await pool.query(`
        SELECT id, nombre, email, admin
        FROM usuarios
        WHERE id = $1
    `, [req.session.usuarioId]);

    res.json({
        usuario: resultado.rows[0] || null
    });
});

router.use((error, req, res, next) => {
    if (error.code === "23505") {
        return res.status(409).json({
            error: "Ese correo ya está registrado."
        });
    }

    console.error("Error de autenticación:", error.message);

    res.status(500).json({
        error: "No se pudo completar la operación."
    });
});

module.exports = router;