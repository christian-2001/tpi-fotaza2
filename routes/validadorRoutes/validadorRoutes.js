import express from "express"
import { indexValidador, vistaPublicaciónDenunciada } from "../../controllers/validador/validadorController.js"

const router = express.Router()

router.get("/", indexValidador)

router.get("/publicacion/:idPost", vistaPublicaciónDenunciada)

export default router