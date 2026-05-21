import express from "express"
import { loginIndex } from "../../controllers/login/loginController.js"

const router = express.Router()

router.get("/", loginIndex)

export default router