# 🌸 Unlock Fragancias
![Texto alternativo](assets/logo.jpg)

Tienda web de perfumes y fragancias desarrollada como proyecto de la materia **Diseño e Implementación de Sistemas Computacionales**. Permite explorar un catálogo de perfumes, filtrarlos por categoría, guardarlos en favoritos, armar un carrito y registrarse o iniciar sesión.

## 👥 Integrantes

| Nombre | GitHub |
|---|---|
| Tiara Díaz | [@TiaraDiaz11](https://github.com/TiaraDiaz11) |
| Tobias Fernández | [@tobfernandez12](https://github.com/tobfernandez12) |
| Alan Cortea | [@AlanCoding-Program](https://github.com/AlanCoding-Program) |

## ✨ Funcionalidades

- 🔍 Buscador de perfumes
- 🗂️ Categorías: marcas, hombre, mujer, unisex y todos
- 💵 Precio de contado 
- 🛒 Botón para agregar a la bolsa / carrito
- ❤️ Agregar a favoritos
- 📏 Selección de cantidad: 30 ml, 50 ml o 100 ml
- 🖼️ Imágenes de cada perfume (1 o 2)
- 📝 Descripción corta: tipo (diseñador / árabe), notas de salida, corazón y familia olfativa
- 🔐 Registro e inicio de sesión
- 📞 Contacto por WhatsApp e Instagram
- ⚙️ Backend con panel de administración

## 🛠️ Tecnologías

**Frontend:** HTML, CSS y JavaScript

**Backend:**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) 5
- [PostgreSQL](https://www.postgresql.org/) (`pg`)
- `express-session` + `connect-pg-simple` (sesiones guardadas en la base de datos)
- `bcryptjs` (encriptación de contraseñas)
- `express-rate-limit` (límite de peticiones)
- `dotenv` (variables de entorno)

## 📁 Estructura del proyecto

```
├── Gantt y Curva S/   # Documentación de planificación del proyecto
├── Views/             # Vistas / páginas de la tienda
├── assets/            # Imágenes y recursos estáticos
├── css/               # Estilos
├── js/                # Scripts del frontend
├── Admin.js           # Lógica del panel de administración
├── Auth.js            # Registro e inicio de sesión
├── db.js              # Conexión a la base de datos
├── server.js          # Servidor principal
└── package.json
```

## 🚀 Instalación y uso

### Requisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [PostgreSQL](https://www.postgresql.org/) instalado y corriendo

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TiaraDiaz11/Dise-o-e-Implementaci-n-de-Sistemas-Computacionales.git
   cd Dise-o-e-Implementaci-n-de-Sistemas-Computacionales
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las variables de entorno:
   ```env
       DATABASE_URL=postgresql://neondb_owner:npg_KL6e1xafrGPF@ep-frosty-mouse-b6cqc996-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
       PORT=3000
       ADMIN_DEV_MODE=true
       SESSION_SECRET=b6e14663b5d1e1f1651ece08df0f6a84c86f713392f4be39614ec547ccf5a5db
       APP_ORIGIN=http://localhost:3000
   ```

4. Iniciar el servidor:
   ```bash
   node server.js
   ```

5. Abrir el navegador en `http://localhost:3000`.

## 📅 Planificación

En la carpeta `Gantt y Curva S` se encuentra el cronograma del proyecto (diagrama de Gantt y Curva S).

## 📌 Estado del proyecto

Terminado. Los métodos de pago son por ahora solo visuales.

## 📄 Licencia

Proyecto académico sin licencia definida realizado por los alumnos de 7mo 5ta Grupo 1 Equipo 4.
