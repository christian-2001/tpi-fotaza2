import express from "express"
import session from "express-session";
import 'dotenv/config';
import IndexRoutes from "./routes/IndexRoutes/IndexRoutes.js"
import loginRoutes from "./routes/loginRoutes/loginRoutes.js"
import registrerRoutes from "./routes/registrer/registrer.js"
import postRoutes from "./routes/postRoutes/postRoutes.js"
import { db_conexion } from "./models/index.js";

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "50mb" }))

app.use(express.static("public"))

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        httpOnly: true,
        sameSite: "lax",
    }
}))

app.set("view engine", "pug")
app.set("views", "./views")

app.use("/login", loginRoutes)

app.use("/registrarse", registrerRoutes)

app.use("/", IndexRoutes)

app.use("/subirPost", postRoutes)





db_conexion()
    .then(() => {
        app.listen(port, (err) => {
            if (err) {
                console.error("Inicio del servidor fallido:", err)
                return;
            }
            console.log(`El servidor se encuentra en el puerto ${port}`)
        })
    })
    .catch((err) => {
        console.error("Error al sincronizar con la base de datos:", err)
    })

/*
try {
    app.listen(port, (err) => {
        if (err) {
            console.error("Inicio del servidor fallido:", err)
            return;
        }
        console.log(`El servidor se encuentra en el puerto ${port}`)
    })
} catch (error) {
    console.error("Error al sincronizar con la base de datos:", err)
}
*/