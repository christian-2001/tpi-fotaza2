import { v2 as cloudinary } from "cloudinary"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion } from "../../models/Publicacion.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"

export function postIndex(req, res) {
    res.render("./post/postForm")
}

export async function subirPost(req, res) {
    const f_titulo = req.body.formTitle
    const f_descripcion = req.body.formDescription
    const f_imagenes = req.body.formImages
    const f_post_etiquetas = req.body.formPostTags

    try {
        //Crear publicacion
        const nuevaPublicacion = await Publicacion.create({
            titulo: f_titulo,
            descripcion: f_descripcion,
            id_usuario: req.user.id_usuario
        })

        //Etiquetas del post
        for (const postTag of f_post_etiquetas) {
            const nuevaEtiqueta = await Etiqueta.create({ nom_etiqueta: postTag })

            await Publicacion_Etiqueta.create({
                id_post: nuevaPublicacion.id_post,       
                id_etiqueta: nuevaEtiqueta.id_etiqueta   
            })
        }

        //Imagenes
        for (const img of f_imagenes) {
            const textBase64 = img.img_src
            const imgBuffer = Buffer.from(textBase64.split(",")[1], "base64")

            // Subir a Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { public_id: img.img_name },
                    (error, result) => error ? reject(error) : resolve(result)
                ).end(imgBuffer)
            })

            // Crear imagen en BD
            const nuevaImagen = await Imagen.create({
                nombre_img: uploadResult.public_id,
                img_path: uploadResult.secure_url,
                extension: uploadResult.format,
                id_post: nuevaPublicacion.id_post   
            })

            // Etiquetas de la imagen
            for (const imgTag of img.img_tags) {
                const nuevaEtiqueta = await Etiqueta.create({ nom_etiqueta: imgTag })

                await Imagen_Etiqueta.create({
                    id_img: nuevaImagen.id_img,          
                    id_etiqueta: nuevaEtiqueta.id_etiqueta
                })
            }
        }

        // Redirigir a Home
        return res.redirect("/")

    } catch (error) {
        console.error("Error al subir post:", error)
        return res.status(500).send({ msg: "Error al subir el post", err: error })
    }
}