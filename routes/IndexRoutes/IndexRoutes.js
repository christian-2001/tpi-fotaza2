import express from "express"
import { pagIndex } from "../../controllers/pagIndex/pagIndex.js"
import { buscarPost } from "../../controllers/buscarPost/buscarPostController.js"
import { mostrarPost, actualizarImgPost, cerrarComentarios } from "../../controllers/mostrarPost/mostrarPostController.js"

const router = express.Router()

router.get("/", pagIndex)

router.get("/buscar", buscarPost)

router.get("/post/:id_post/:img_index", mostrarPost)

router.post("/post/:id_post/:img_index", actualizarImgPost)

router.post("/post/:id_post/imagen/:id_img/cerrarComentarios", cerrarComentarios)

export default router