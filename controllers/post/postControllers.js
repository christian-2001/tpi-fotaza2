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


    await Publicacion.create({
        titulo: f_titulo,
        descripcion: f_descripcion,
    })

    for (const postTag of f_post_etiquetas) {
        await Etiqueta.create({
            nom_etiqueta: postTag
        })

        await Publicacion_Etiqueta.create({
            id_post: await Publicacion.count(),
            id_etiqueta: await Etiqueta.count(),
        })
    }

    for (let img of f_imagenes) {
        const textBase64 = img.img_src
        const arregloBase64 = textBase64.split(",")
        const imgBuffer = Buffer.from(arregloBase64[1], "base64")

        try {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        public_id: img.img_name
                    }, (error, uploadResult) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(uploadResult)
                    }).end(imgBuffer);
            });
        } catch (error) {
            return res.status(500).send({
                msg: "subir imagen SALIO MAL",
                err: error
            })
        }


        try {
            const result = await cloudinary.api.resource(img.img_name);
            await Imagen.create({
                nombre_img: result.public_id,
                img_path: result.secure_url,
                extension: result.format,
                id_post: await Publicacion.count()
            })

            for (const imgTags of img.img_tags) {
                await Etiqueta.create({
                    nom_etiqueta: imgTags
                })

                await Imagen_Etiqueta.create({
                    id_img: await Imagen.count(),
                    id_etiqueta: await Etiqueta.count()
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
/*
    const f_titulo = req.body.formTitle
    const f_descripcion = req.body.formDescription
    const f_imagenes = req.body.formImages
    const f_post_etiquetas = req.body.formPostTags
  */  
     
    return res.status(200).redirect("/")
}