import express from "express"
import { pagIndex } from "../../controllers/pagIndex/pagIndex.js"
import { buscarPost } from "../../controllers/buscarPost/buscarPostController.js"
import { mostrarPost, actualizarImgPost, cerrarComentarios } from "../../controllers/mostrarPost/mostrarPostController.js"
import { mostrarPerfilUsuario } from "../../controllers/userProfile/userProfileController.js"
import { registrarFollow, eliminarFollow } from "../../controllers/follower/followerController.js"
import { cerrarSesion } from "../../middleware/auth.js"
const router = express.Router()

router.get("/", pagIndex)

router.get("/buscar", buscarPost)

router.get("/post/:id_post/:img_index", mostrarPost)

router.post("/post/:id_post/:img_index", actualizarImgPost)

router.post("/post/:id_post/imagen/:id_img/cerrarComentarios", cerrarComentarios)

router.get("/usuarioPerfil/:sección", mostrarPerfilUsuario)

router.get("/usuarioPerfil/:id_usuario/:sección", mostrarPerfilUsuario)

router.post("/seguir/:idUsuarioSeguido/:sección", registrarFollow)

router.post("/dejar-de-seguir/:idUsuarioSeguido/:sección", eliminarFollow)

router.post("/cerrarSesion", cerrarSesion)

export default router