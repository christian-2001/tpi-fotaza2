import express from "express"
import { verificarComentarioDenunciado } from "../../controllers/userPost/UserPostController.js"
import { mostrarPost, actualizarImgPost} from "../../controllers/userPost/UserPostController.js"
import { denunciarComentario, verificarComentarioDenunciado, cerrarComentarios } from "../../controllers/userPost/UserPostController.js"
import { cerrarComentarios } from "../../controllers/userPost/UserPostController.js"

const router = express.Router()

router.get(":id_post/:img_index", mostrarPost)

router.post(":id_post/:img_index", actualizarImgPost)

router.post(":id_post/imagen/:id_img/cerrarComentarios", cerrarComentarios)

router.get(":id_post/:img_index/:id_comentario/verificarComentarioDenunciado", verificarComentarioDenunciado)

router.post("/denuncias/comentario/denunciarComentario", denunciarComentario)

export default router