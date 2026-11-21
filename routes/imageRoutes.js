import express from "express"
import { marcarInteres } from "../controllers/imagenPostController.js"

const router = express.Router()

router.post("/:id_img/interes", marcarInteres)

export default router