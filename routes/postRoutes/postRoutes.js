import express from "express"

import { postIndex, subirPost } from "../../controllers/post/postControllers.js"

const router = express.Router() 

router.get("/", postIndex)

router.post("/", subirPost)

export default router 