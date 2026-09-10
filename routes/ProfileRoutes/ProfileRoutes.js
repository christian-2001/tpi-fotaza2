import express from "express"
import { mostrarPerfilUsuario } from "../../controllers/userProfile/userProfileController.js"
import { registrarFollow, eliminarFollow } from "../../controllers/userProfile/userProfileController.js"

const router = express.Router()

router.get("/:sección", mostrarPerfilUsuario)

router.get("/:id_usuario/:sección", mostrarPerfilUsuario)

router.post("/seguir/:idUsuarioSeguido/:sección", registrarFollow)

router.post("/dejar-de-seguir/:idUsuarioSeguido/:sección", eliminarFollow)

export default router