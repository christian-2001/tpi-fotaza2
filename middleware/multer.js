import multer from "multer";
    
const storage = multer.memoryStorage()

const img_upload = multer({ storage })

export { img_upload }