import express from "express"
import { pagIndex } from "../../controllers/pagIndex/pagIndex.js"
import { buscarPost } from "../../controllers/buscarPost/buscarPostController.js"
import { mostrarPost } from "../../controllers/mostrarPost/mostrarPostController.js"

const router = express.Router()

router.get("/", pagIndex)

router.get("/buscar", buscarPost)

router.get("/post/:id_post/:img_index", mostrarPost)

export default router