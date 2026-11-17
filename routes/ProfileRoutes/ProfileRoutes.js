import express from "express"
import { mostrarPerfilUsuario } from "../../controllers/userProfile/userProfileController.js"
import { registrarFollow, eliminarFollow } from "../../controllers/userProfile/userProfileController.js"
import { modificarColeccion, borrarColecciones } from "../../controllers/userProfile/userProfileController.js"
import { denunciarPublicación, verificarPublicacionDenunciada } from "../../controllers/userProfile/userProfileController.js"
import { mostrarDenunciasComentario, desestimarDenunciasComentario, borrarComentario, mostrarVistaResultadoDenuncia } from "../../controllers/userProfile/userProfileController.js"
//import { userColección } from "../../controllers/userProfile/userProfileController.js"

const router = express.Router()

router.get("/:sección", mostrarPerfilUsuario)

router.get("/:id_usuario/:sección", mostrarPerfilUsuario)

router.get("/:id_usuario/:sección/:userColeccion", mostrarPerfilUsuario)

router.get("/denuncias/publicacion/:idPublicacion/verificarPublicacionDenunciada", verificarPublicacionDenunciada)

router.get("/denuncias/comentario/mostrarDenuncias/:id_comentario", mostrarDenunciasComentario)

router.get("/denuncias/comentario/mostrarDenuncias/resultado/:accion", mostrarVistaResultadoDenuncia)

router.post("/seguir/:idUsuarioSeguido/:sección", registrarFollow)

router.post("/dejar-de-seguir/:idUsuarioSeguido/:sección", eliminarFollow)

router.post("/:id_usuario/:sección", borrarColecciones)

router.post("/:id_usuario/:sección/:userColeccion", modificarColeccion)

router.post("/denuncias/publicacion/denunciarPublicacion", denunciarPublicación)

router.post("/denuncias/comentario/:id_comentario/desestimar", desestimarDenunciasComentario)

router.post("/denuncias/comentario/:id_comentario/borrar", borrarComentario)
export default router