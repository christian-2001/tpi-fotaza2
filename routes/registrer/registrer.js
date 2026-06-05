import express from "express"
import { registroIndex, validarRegistroPerfil, usuarioFormulario, validarRegistroUsuario} from "../../controllers/registrer/registrerController.js"

const router = express.Router()

router.get("/crearPerfil", registroIndex)

router.post("/crearPerfil", validarRegistroPerfil)

router.get("/crearUsuario", usuarioFormulario)

router.post("/crearUsuario", validarRegistroUsuario)

export default router