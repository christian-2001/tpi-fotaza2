import express from "express"
import { indexValidador } from "../../controllers/validador/validadorController.js"

const router = express.Router()

router.get("/", indexValidador)

export default router