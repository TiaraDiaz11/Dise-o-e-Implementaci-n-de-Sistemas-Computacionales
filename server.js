const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Publicar solamente las carpetas del front.
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/Views", express.static(path.join(__dirname, "Views")));

app.get("/", (req, res) => {
    res.redirect("/Views/index.html");
});

// Obtener las presentaciones disponibles del catálogo.
app.get("/api/productos", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                v.id,
                p.id AS producto_id,
                p.nombre,
                m.nombre AS marca,
                p.descripcion,
                p.imagen,
                p.familia_olfativa,
                p.notas,
                v.tamano_ml,
                v.precio,
                v.stock,

                (
                    SELECT c.nombre
                    FROM producto_categoria pc
                    JOIN categorias c ON c.id = pc.categoria_id
                    WHERE pc.producto_id = p.id
                      AND c.tipo = 'genero'
                      AND c.activo = TRUE
                    ORDER BY c.id
                    LIMIT 1
                ) AS genero,

                (
                    SELECT c.nombre
                    FROM producto_categoria pc
                    JOIN categorias c ON c.id = pc.categoria_id
                    WHERE pc.producto_id = p.id
                      AND c.tipo = 'segmento'
                      AND c.activo = TRUE
                    ORDER BY c.id
                    LIMIT 1
                ) AS segmento

            FROM productos p
            JOIN marcas m ON m.id = p.marca_id
            JOIN variantes_producto v ON v.producto_id = p.id

            WHERE p.activo = TRUE
              AND m.activo = TRUE
              AND v.activo = TRUE

            ORDER BY p.id, v.tamano_ml
        `);

        const normalizar = valor =>
            (valor || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

        // Adaptar la respuesta al formato que ya usa script.js.
        const productos = resultado.rows.map(fila => ({
            id: fila.id,
            producto_id: fila.producto_id,
            nombre: fila.nombre,
            marca: fila.marca,
            descripcion: fila.descripcion || "",
            imagen: fila.imagen || "/assets/logo.jpg",
            familia_olfativa: fila.familia_olfativa || "",
            notas: fila.notas || [],
            cantidadml: `${Number(fila.tamano_ml)}ml`,
            precio: Number(fila.precio),
            stock: fila.stock,
            genero: normalizar(fila.genero),
            tipo: normalizar(fila.segmento)
        }));

        res.json(productos);
    } catch (error) {
        console.error("Error al consultar productos:", error.message);

        res.status(500).json({
            error: "No se pudieron obtener los productos"
        });
    }
});

async function iniciarServidor() {
    try {
        await pool.query("SELECT 1");

        console.log("Conexión con Neon correcta");

        app.listen(PORT, () => {
            console.log(`Servidor disponible en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo conectar con Neon:", error.message);
        await pool.end();
        process.exitCode = 1;
    }
}

iniciarServidor();