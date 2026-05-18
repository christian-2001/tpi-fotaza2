import { v2 as cloudinary } from "cloudinary"

export function postIndex(req, res) {
    res.render("./post/postForm")
}

export async function subirPost(req, res) {
    const img_files = req.files

    try {

        for (let i of img_files) {

            const img_buffer = i.buffer

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, uploadResult) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(uploadResult);
                }).end(img_buffer);
            });
        }

        return res.status(200).send({
            msg: "Imagen/es enviada/s satisfactoriamente"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            msg: "subir imagen SALIO MAL",
            err: error
        })
    }

}