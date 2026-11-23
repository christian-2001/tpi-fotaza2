import express from "express"
import { marcarNotificacionLeida } from "../controllers/notificacionesController.js" 

const router = express.Router()

router.post("/marcarLeida/:id_notificacion", marcarNotificacionLeida)

export default router