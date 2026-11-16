import express from "express"
import { verificarComentarioDenunciado } from "../../controllers/userPost/UserPostController.js"

const router = express.Router()

router.get("/denuncias/comentario/:id_comentario/verificarComentarioDenunciado", verificarComentarioDenunciado)

export default router