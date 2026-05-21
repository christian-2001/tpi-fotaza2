import express from "express"
import multer from 'multer';
import { img_upload } from "../../middleware/multer.js";

import { postIndex, subirPost } from "../../controllers/post/postControllers.js"

const router = express.Router() 

router.get("/", postIndex)

router.post("/", subirPost)

export default router 