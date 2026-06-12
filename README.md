# Fotaza 2 — Trabajo Práctico Integrador
### Programación Web II — Tecnicatura Universitaria en Desarrollo de Software

Aplicación web para almacenar, ordenar, buscar y compartir fotografías en línea. Permite la generación de una comunidad de usuarios que comparten fotografías creadas por ellos mismos.

---

## Tecnologías utilizadas

- **Backend:** Node.js v22.16.0, Express.js v5.2.1
- **Vistas:** Pug (server-side rendering) v3.0.4
- **ORM:** Sequelize v6.37.8
- **Base de datos:** PostgreSQL (Neon)
- **Almacenamiento de imágenes:** Cloudinary
- **Autenticación:** Sesiones con express-session v1.19.0
- **Encriptación:** bcrypt v6.0.0
- **Validación:** Zod 4 v4.4.3
- **CSS:** Tailwind CSS v4.3.0
- **Variables de entorno:** dotenv v17.4.2
---

## Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en [Neon](https://neon.tech) (base de datos PostgreSQL)
- Cuenta en [Cloudinary](https://cloudinary.com) (almacenamiento de imágenes)

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/christian-2001/tpi-fotaza2.git
cd tpi-fotaza2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo .env.example, renombralo a .env y completá los valores con tus credenciales.

Editá el `.env` con tus credenciales:

```env
PORT=3000
DB_HOST=tu_host_neon
DB_USER=tu_usuario_neon
DB_PASSWORD=tu_password_neon
DB_NAME=neondb
DB_PORT=5432
CLOUDINARY_URL=tu_cloudinary_url
SESSION_KEY=una_clave_secreta_cualquiera
```

### 4. Inicializar la base de datos y cargar datos de prueba

```bash
npm run db:init
```

Este comando crea las tablas necesarias y carga los datos de prueba.

### 5. Ejecutar la aplicación

```bash
npm start
```

La aplicación quedará disponible en: [http://localhost:3000](http://localhost:3000)

---

## Usuarios de prueba (Autenticarse con Mail y Contraseña)

| Mail | Contraseña | 
|---------|------------|
| `user00@test.com` | `user@1234` |
| `user01@test.com` | `user@4567` |
| `user02@test.com` | `user@8912` |
| `user03@test.com` | `user@3456` |

---

## Aplicación en producción

La aplicación está desplegada en Render y accesible en:

> **[https://tpi-fotaza2-zqxd.onrender.com/](https://tpi-fotaza2-zqxd.onrender.com/)**

---

## Funcionalidades implementadas

### 1. Sistema de autenticación
- Registro e inicio de sesión de usuarios
- Solo usuarios registrados pueden interactuar con la app
- Usuarios anónimos pueden ver contenido público

### 2. Gestor de contenidos (imágenes)
- Creación de publicaciones con título, descripción, imágenes y sus propias etiquetas
- Comentarios en imágenes con posibilidad de cerrarlos
- Valorización de imágenes (una vez por usuario, no el autor)
- Promedio de valorizaciones visible en cada imagen
- Cada imagen cuenta con sus propias etiquetas


### 3. Motor de búsqueda
- Búsqueda de publicaciones por coincidencias en título, descripción, etiquetas y nombre de usuario
- Filtros combinables

### 4. Seguimiento de usuarios (Followers)
- Seguir y dejar de seguir usuarios
- Secciones de seguidores y seguidos con contador incluido

---

## Problemas encontrados y soluciones

### 1 - Inserción dinámica de elementos SVG en el DOM
Al intentar insertar íconos SVG dinámicamente con `createElement`, los elementos no se 
renderizaban correctamente en el navegador. El problema era que SVG requiere su propio 
namespace para crearse correctamente. Se solucionó usando 
`document.createElementNS("http://www.w3.org/2000/svg", "svg")` en lugar de 
`createElement`.

### 2 - Estilos de Tailwind CSS no reflejados en la interfaz
Durante el desarrollo se observó que algunas clases de Tailwind CSS agregadas a las vistas no producían ningún cambio visual en la aplicación, a pesar de estar correctamente escritas.
Al utilizar Tailwind CSS instalado mediante npm, las clases deben ser procesadas por el compilador para incorporarse al archivo CSS generado. Cuando este proceso no se ejecutaba, las nuevas clases utilizadas en el proyecto no eran detectadas ni incluidas en los estilos finales.

Se ejecutó el comando de compilación de Tailwind `npm run tailwind` que contiene:

`"npx @tailwindcss/cli -i ./public/style/index.css -o ./public/style/output.css --watch",`

### 3 - Conexión a Neon requería SSL
La conexión a la base de datos en Neon fallaba sin configuración SSL. Se resolvió agregando `dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }` en la configuración de Sequelize.

### 4 - Try/Catch anidados (Callback Hell)

Al actualizar la cantidad y promedio de valorizaciones de una imagen, se encerró 
cada query de Sequelize en su propio `try/catch`, lo que generó un callback hell 
de bloques anidados difícil de leer y mantener:

Se solucionó unificando todas las queries dentro de un único `try/catch`, ya que si cualquiera 
de ellas falla, el `catch` lo captura igualmente:

### 5 - Error "Payload Too Large" al cargar imágenes
Al intentar cargar una imagen desde el equipo local, el navegador devolvía el siguiente error:
`PayloadTooLargeError: request entity too large`

Esto ocurría porque el middleware `express.json()` tiene un límite de tamaño por defecto (100kb), y las imágenes superaban ese umbral, provocando que Express rechazara la petición antes de procesarla.

Se añadió la opción `limit` al middleware para aumentar el tamaño máximo permitido en las peticiones:
`app.use(express.json({ limit: "15mb" }));`

Esto permite que el servidor acepte imágenes de hasta 15mb en el cuerpo de la solicitud.

### 6 - Seguimiento de sesión de usuario

Al intentar acceder a los datos del usuario autenticado desde un controlador, 
`res.locals.userSession` devolvía `undefined`.

`res.locals` está diseñado exclusivamente para pasar datos a las vistas (`.pug`, `.ejs`, etc.) 
durante el renderizado. No es accesible desde otros archivos como controladores o middlewares 
posteriores.

```javascript
// ✗ Esto funciona solo en archivos .pug
res.locals.userSession = {
    id: usuario.id_usuario,
    user_name: usuario.nombre_usuario
}
```

Como solución, la información del usuario es almacenada en `req.user`, que persiste y es accesible 
en cualquier controlador o middleware de la ruta que incluya el middleware de autenticación.

```javascript
// ✓ Accesible desde cualquier controlador
req.user = usuario

// Uso en un controlador
req.user.id_usuario
req.user.nombre_usuario
``` 

---

## Estructura del proyecto

```
tpi-fotaza2/
├── db/
│   └── config.js
├── middleware/
│   └── auth.js
├── models/
├── routes/
├── controllers/
├── views/
├── public/
├── seeders/
│   └── seed.js
├── validations/
├── app.js
├── .gitignore
├── .env.example
├── package-lock.json
├── package.json
└── README.md
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia la aplicación en producción |
| `npm run dev` | Inicia la aplicación en modo desarrollo |
| `npm run db:init` | Crea las tablas y carga datos de prueba |
