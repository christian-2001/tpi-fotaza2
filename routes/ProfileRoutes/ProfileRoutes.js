import express from "express"
import { mostrarPerfilUsuario } from "../../controllers/userProfile/userProfileController.js"
import { registrarFollow, eliminarFollow } from "../../controllers/userProfile/userProfileController.js"
import { modificarColeccion, borrarColecciones } from "../../controllers/userProfile/userProfileController.js"
//import { userColección } from "../../controllers/userProfile/userProfileController.js"

const router = express.Router()

router.get("/:sección", mostrarPerfilUsuario)

router.get("/:id_usuario/:sección", mostrarPerfilUsuario)

router.post("/seguir/:idUsuarioSeguido/:sección", registrarFollow)

router.post("/dejar-de-seguir/:idUsuarioSeguido/:sección", eliminarFollow)

router.get("/:id_usuario/:sección/:userColeccion", mostrarPerfilUsuario)

router.post("/:id_usuario/:sección", borrarColecciones)

router.post("/:id_usuario/:sección/:userColeccion", modificarColeccion)


export default router