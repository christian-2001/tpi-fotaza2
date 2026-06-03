import express from "express"
import { registroIndex, validarRegistro, usuarioFormulario, validarRegistroUsuario} from "../../controllers/registrer/registrerController.js"

const router = express.Router()

router.get("/", registroIndex)

router.post("/", validarRegistro)

router.get("/crearUsuario", usuarioFormulario)

router.post("/crearUsuario", validarRegistroUsuario)
export default router