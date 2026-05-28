import express from "express"
import { pagIndex } from "../../controllers/pagIndex/pagIndex.js"
import { buscarPost } from "../../controllers/busqueda/busquedaController.js"

const router = express.Router()

router.get("/", pagIndex)

router.get("/buscar", buscarPost)

export default router