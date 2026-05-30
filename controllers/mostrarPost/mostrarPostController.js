import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op } from "sequelize"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"
import { Comentario } from "../../models/Comentario.js"

export async function mostrarPost(req, res) {
    const id = req.params.id_post
    let img = Number(req.params.img_index)

    console.log(`id_post -> ${id}`)
    console.log(`array_imagen_index -> ${img}`)

    //const post = await Publicacion.findByPk(id)

    const imgs = await Imagen.findAll({
        include: [
            { model: Publicacion, required: true, where: { id_post: id } },
            //{ model: Comentario, required: true}
        ]
    })

    const img_coments = await Comentario.findAll({
        include: [
            { model: Imagen, required: true, where: { id_img: imgs[img].id_img } },
            { model: Usuario, required: true }
        ]
    })

    //console.log(img_coments)

    //console.log(img_coments[0].Usuario.nombre_usuario)

    if (img > 0 && img < (imgs.length - 1)) {
        const img_prev = img - 1
        const img_next = img + 1

        res.render("./post/postView", {
            postImages: imgs,
            post_id: id,
            prev: img_prev,
            next: img_next,
            imgIndex: img,
            comments: img_coments
        })
    } else {
        res.render("./post/postView", {
            postImages: imgs,
            post_id: id,
            imgIndex: img,
            comments: img_coments
        })
    }
    
}