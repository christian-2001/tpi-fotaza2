import express from "express"
import { loginIndex, authLogin } from "../../controllers/login/loginController.js"

const router = express.Router()

router.get("/", loginIndex)

router.post("/auth", authLogin)

export default router