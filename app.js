import express from "express"
import 'dotenv/config';
import loginRoutes from "./routes/loginRoutes/loginRoutes.js"
import registrerRoutes from "./routes/registrer/registrer.js"
import postRoutes from "./routes/postRoutes/postRoutes.js"
import { db_conexion } from "./models/index.js";

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: "50mb"}))
app.use(express.static("public"))

app.set("view engine", "pug")
app.set("views", "./views")

app.get("/", (req, res) => {
    res.render("index")
})

app.use("/login", loginRoutes)

app.use("/registrer", registrerRoutes)

app.use("/subirPost", postRoutes)

/*

*/




/*
const byteArrayBuffer = fs.readFileSync('shirt.jpg');
new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
        if (error) {
            return reject(error);
        }
        return resolve(uploadResult);
    }).end(byteArrayBuffer);
}).then((uploadResult) => {
    console.log(`Buffer upload_stream wth promise success - ${uploadResult.public_id}`);
}).catch((error) => {
    console.error(error);
});
*/

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

