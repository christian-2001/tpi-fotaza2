import express from "express"
import { registrerIndex } from "../../controllers/registrer/registrerController.js"

const router = express.Router()

router.get("/", registrerIndex)

export default router