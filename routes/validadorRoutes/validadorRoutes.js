import express from "express"
import { indexValidador, vistaPublicaciónDenunciada } from "../../controllers/validador/validadorController.js"
import { darDeBajaPublicación, desestimarDenuncias } from "../../controllers/validador/validadorController.js"
const router = express.Router()

router.get("/", indexValidador)

router.get("/publicacion/:id_post", vistaPublicaciónDenunciada)

router.post("/publicacion/darDeBajaPublicacion/:id_post", darDeBajaPublicación)

router.post("/publicacion/desestimarDenuncias/:id_post", desestimarDenuncias)

export default router