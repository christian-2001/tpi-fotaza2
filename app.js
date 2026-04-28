import express from "express"
import 'dotenv/config';

const app = express()
const port = process.env.PORT

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug")
app.set("views", "./views")


app.get("/", (req, res) =>{
    res.send("Hola, este es el inicio del proyecto")
})

app.listen(port, () => console.log(`El servidor se encuentra en el puerto ${port}`))