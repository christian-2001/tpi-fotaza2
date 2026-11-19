import express from "express"
import { pagIndex } from "../../controllers/pagIndex/pagIndex.js"
import { guardarPost_favoritos, quitarPost_favoritos } from "../../controllers/pagIndex/pagIndex.js"
import { crearColección, guardar_en_colección, quitar_de_colección } from "../../controllers/pagIndex/pagIndex.js"
import { denunciarPublicación, marcarLeidas, verificarPublicacionDenunciada } from "../../controllers/pagIndex/pagIndex.js"
import { buscarPost } from "../../controllers/buscarPost/buscarPostController.js"
import { cerrarSesion } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", pagIndex)

router.post("/favoritos/:id_post", guardarPost_favoritos)

router.post("/quitar-de-favoritos/:id_post", quitarPost_favoritos)

router.post("/crearColeccion", crearColección)

router.post("/guardar-en-coleccion", guardar_en_colección)

router.post("/quitar-de-coleccion", quitar_de_colección)

router.get("/buscar", buscarPost)

router.post("/denuncias/publicacion/denunciarPublicacion", denunciarPublicación)

router.post("/denuncias/publicacion/marcarLeidas", marcarLeidas)

router.get("/denuncias/publicacion/:idPublicacion/verificarPublicacionDenunciada", verificarPublicacionDenunciada)

router.post("/cerrarSesion", cerrarSesion)

export default router