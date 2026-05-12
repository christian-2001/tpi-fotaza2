import express from "express"
import 'dotenv/config';
import loginRoutes from "./routes/login/login.js"
import registrerRoutes from "./routes/registrer/registrer.js"
import { db_conexion } from "./models/index.js";

const app = express()
const port = process.env.PORT

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug")
app.set("views", "./views")


app.get("/", (req, res) =>{
    res.render("index")
})

app.use("/login", loginRoutes)

app.use("/registrer", registrerRoutes)

db_conexion()
.then(() => {
    app.listen(port, (err) => {
        if(err){
            console.error("Inicio del servidor fallido:", err)
            return;
        }
        console.log(`El servidor se encuentra en el puerto ${port}`)
    })
})
.catch((err) => {
    console.error("Error al sinctonizar con la base de datos:", err)
})

