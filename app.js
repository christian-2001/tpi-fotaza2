import express from "express"
import 'dotenv/config';
import loginRoutes from "./routes/login/login.js"
import registrerRoutes from "./routes/registrer/registrer.js"

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

app.listen(port, () => console.log(`El servidor se encuentra en el puerto ${port}`))