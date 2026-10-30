const express = require("express");
const pool = require("./db");

const router = express.Router();

// Control de acceso para todas las rutas administrativas.
router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");

    // Lo utilizaremos cuando exista el sistema de usuarios.
    const esAdministrador = req.usuario?.rol === "admin";

    // Permiso provisional para probar el panel localmente.
    const modoDesarrollo =
        process.env.ADMIN_DEV_MODE === "true" &&
        process.env.NODE_ENV !== "production";

    if (!esAdministrador && !modoDesarrollo) {
        return res.status(403).json({
            error: "Esta sección requiere un usuario administrador."
        });
    }

    next();
});

// Obtener productos y opciones de los formularios.
router.get("/datos", async (req, res) => {
    const [productos, marcas, categorias] = await Promise.all([
        pool.query(`
            SELECT
                p.*,
                m.nombre AS marca,
                v.id AS variante_id,
                v.tamano_ml,
                v.precio,
                v.stock,
                v.activo AS variante_activa,
                ARRAY(
                    SELECT pc.categoria_id
                    FROM producto_categoria pc
                    WHERE pc.producto_id = p.id
                ) AS categoria_ids
            FROM productos p
            JOIN marcas m ON m.id = p.marca_id
            LEFT JOIN variantes_producto v ON v.producto_id = p.id
            ORDER BY p.id DESC, v.tamano_ml
        `),
        pool.query(`
            SELECT id, nombre, activo
            FROM marcas
            ORDER BY nombre
        `),
        pool.query(`
            SELECT id, nombre, tipo, activo
            FROM categorias
            WHERE tipo IN ('genero', 'segmento')
            ORDER BY nombre
        `)
    ]);

    res.json({
        productos: productos.rows,
        marcas: marcas.rows,
        categorias: categorias.rows
    });
});

function errorUsuario(mensaje, estado = 400) {
    const error = new Error(mensaje);
    error.status = estado;
    return error;
}

function validarId(valor) {
    const numero = Number(valor);

    if (!Number.isSafeInteger(numero) || numero <= 0) {
        throw errorUsuario("Identificador inválido.");
    }

    return numero;
}

function validarDecimal(valor, minimo, maximo, nombre) {
    const texto = String(valor);
    const numero = Number(valor);

    if (
        !/^\d+(\.\d{1,2})?$/.test(texto) ||
        !Number.isFinite(numero) ||
        numero < minimo ||
        numero > maximo
    ) {
        throw errorUsuario(`${nombre}: ingresá un valor válido.`);
    }

    return texto;
}

function validarDatos(body) {
    const nombre = String(body.nombre || "").trim();
    const descripcion = String(body.descripcion || "").trim();
    const familia = String(body.familia_olfativa || "").trim();
    const imagen = String(body.imagen || "").trim();

    if (!nombre || nombre.length > 150) {
        throw errorUsuario("El nombre debe tener entre 1 y 150 caracteres.");
    }

    if (descripcion.length > 10000 || familia.length > 100) {
        throw errorUsuario("La descripción o familia es demasiado larga.");
    }

    // Acepta archivos de assets o imágenes alojadas mediante HTTPS.
    if (imagen) {
        const rutaLocal =
            /^\/assets\/[a-zA-Z0-9/_ .-]+$/.test(imagen) &&
            !imagen.includes("..");

        let urlRemota = false;

        try {
            urlRemota = new URL(imagen).protocol === "https:";
        } catch {}

        if (imagen.length > 500 || (!rutaLocal && !urlRemota)) {
            throw errorUsuario(
                "La imagen debe ser una ruta /assets/... o una URL HTTPS."
            );
        }
    }

    const stock = Number(body.stock);

    if (
        body.stock === "" ||
        body.stock == null ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        stock > 2147483647
    ) {
        throw errorUsuario("El stock debe ser un entero mayor o igual a cero.");
    }

    if (
        !Array.isArray(body.notas) ||
        body.notas.length > 30 ||
        body.notas.some(n => typeof n !== "string" || n.length > 100)
    ) {
        throw errorUsuario("Las notas ingresadas no son válidas.");
    }

    if (
        typeof body.activo !== "boolean" ||
        typeof body.variante_activa !== "boolean"
    ) {
        throw errorUsuario("Estado inválido.");
    }

    return {
        nombre,
        descripcion,
        familia,
        imagen,
        marcaId: validarId(body.marca_id),
        generoId: validarId(body.genero_id),
        segmentoId: body.segmento_id
            ? validarId(body.segmento_id)
            : null,
        varianteId: body.variante_id == null
            ? null
            : validarId(body.variante_id),
        notas: body.notas.map(n => n.trim()).filter(Boolean),
        ml: validarDecimal(body.tamano_ml, 0.01, 9999.99, "Mililitros"),
        precio: validarDecimal(body.precio, 0, 9999999999.99, "Precio"),
        stock,
        activo: body.activo,
        varianteActiva: body.variante_activa
    };
}

// La misma función sirve para agregar y editar.
async function guardarProducto(req, res) {
    const productoId = req.params.id ? validarId(req.params.id) : null;
    const datos = validarDatos(req.body);
    const cliente = await pool.connect();

    try {
        await cliente.query("BEGIN");

        const marca = await cliente.query(
            "SELECT id FROM marcas WHERE id = $1",
            [datos.marcaId]
        );

        if (!marca.rowCount) {
            throw errorUsuario("La marca seleccionada no existe.");
        }

        const idsCategorias = [
            datos.generoId,
            datos.segmentoId
        ].filter(Boolean);

        const categorias = await cliente.query(
            "SELECT id, tipo FROM categorias WHERE id = ANY($1::int[])",
            [idsCategorias]
        );

        const generoValido = categorias.rows.some(
            c => c.id === datos.generoId && c.tipo === "genero"
        );

        const segmentoValido =
            datos.segmentoId === null ||
            categorias.rows.some(
                c => c.id === datos.segmentoId && c.tipo === "segmento"
            );

        if (!generoValido || !segmentoValido) {
            throw errorUsuario("El género o segmento no es válido.");
        }

        let id = productoId;

        const valores = [
            datos.nombre,
            datos.marcaId,
            datos.descripcion,
            datos.imagen,
            datos.familia,
            datos.notas,
            datos.activo
        ];

        if (productoId) {
            const resultado = await cliente.query(`
                UPDATE productos
                SET nombre = $1,
                    marca_id = $2,
                    descripcion = $3,
                    imagen = $4,
                    familia_olfativa = $5,
                    notas = $6,
                    activo = $7,
                    fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id = $8
                RETURNING id
            `, [...valores, productoId]);

            if (!resultado.rowCount) {
                throw errorUsuario("El producto ya no existe.", 404);
            }
        } else {
            const resultado = await cliente.query(`
                INSERT INTO productos (
                    nombre, marca_id, descripcion, imagen,
                    familia_olfativa, notas, activo
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `, valores);

            id = resultado.rows[0].id;
        }

        if (productoId && datos.varianteId) {
            const resultado = await cliente.query(`
                UPDATE variantes_producto
                SET tamano_ml = $1,
                    precio = $2,
                    stock = $3,
                    activo = $4
                WHERE id = $5 AND producto_id = $6
                RETURNING id
            `, [
                datos.ml,
                datos.precio,
                datos.stock,
                datos.varianteActiva,
                datos.varianteId,
                id
            ]);

            if (!resultado.rowCount) {
                throw errorUsuario("La presentación no pertenece al producto.");
            }
        } else {
            await cliente.query(`
                INSERT INTO variantes_producto (
                    producto_id, tamano_ml, precio, stock, activo
                )
                VALUES ($1, $2, $3, $4, $5)
            `, [
                id,
                datos.ml,
                datos.precio,
                datos.stock,
                datos.varianteActiva
            ]);
        }

        // Reemplazar género y segmento, conservando otras categorías.
        await cliente.query(`
            DELETE FROM producto_categoria pc
            USING categorias c
            WHERE pc.categoria_id = c.id
              AND pc.producto_id = $1
              AND c.tipo IN ('genero', 'segmento')
        `, [id]);

        await cliente.query(`
            INSERT INTO producto_categoria (producto_id, categoria_id)
            SELECT $1, unnest($2::int[])
        `, [id, idsCategorias]);

        await cliente.query("COMMIT");

        res.status(productoId ? 200 : 201).json({ id });
    } catch (error) {
        await cliente.query("ROLLBACK");
        throw error;
    } finally {
        cliente.release();
    }
}

router.post("/productos", guardarProducto);
router.put("/productos/:id", guardarProducto);

router.delete("/productos/:id", async (req, res) => {
    const id = validarId(req.params.id);

    const resultado = await pool.query(
        "DELETE FROM productos WHERE id = $1 RETURNING id",
        [id]
    );

    if (!resultado.rowCount) {
        return res.status(404).json({
            error: "El producto ya no existe."
        });
    }

    res.json({ ok: true });
});

// Responder los errores sin enviar detalles internos de PostgreSQL.
router.use((error, req, res, next) => {
    console.error("Error en administración:", error.message);

    if (error.code === "23505") {
        return res.status(409).json({
            error: "Ya existe una presentación con esos mililitros."
        });
    }

    res.status(error.status || 500).json({
        error: error.status
            ? error.message
            : "No se pudo completar la operación."
    });
});

module.exports = router;