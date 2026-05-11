import express from "express"
import { registroIndex, validarRegistro } from "../../controllers/registrer/registrerController.js"

const router = express.Router()

router.get("/", registroIndex)

router.post("/", validarRegistro)
export default router