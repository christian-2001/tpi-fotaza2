import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op } from "sequelize"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"
import { Comentario } from "../../models/Comentario.js"
import { Valorizacion } from "../../models/Valorizacion.js"

export async function mostrarPost(req, res) {
    const id = req.params.id_post
    let img = Number(req.params.img_index)

    const current_url = req.originalUrl
    console.log(req.originalUrl)
    const imgs = await Imagen.findAll({
        include: [
            { model: Publicacion, required: true, where: { id_post: id } },
            { model: Valorizacion}
        ]
    })

    const img_coments = await Comentario.findAll({
        include: [
            { model: Imagen, required: true, where: { id_img: imgs[img].id_img } },
            { model: Usuario, required: true }
        ]
    })

    let prom_valorizacion = 0
    let cant = 0

    imgs[img].Valorizacions.forEach(i => {
        prom_valorizacion += i.puntaje
        cant++
    })

    prom_valorizacion = parseInt(prom_valorizacion / cant)

    if (img > 0 && img < (imgs.length - 1)) {
        const img_prev = img - 1
        const img_next = img + 1

        res.render("./post/postView", {
            postImages: imgs,
            post_id: id,
            prev: img_prev,
            next: img_next,
            imgIndex: img,
            cant_valorizaciones: cant,
            prom_valorizacion: prom_valorizacion,
            comments: img_coments,
            current_url: current_url
        })
    } else {
        res.render("./post/postView", {
            postImages: imgs,
            post_id: id,
            imgIndex: img,
            cant_valorizaciones: cant,
            prom_valorizacion: prom_valorizacion,
            comments: img_coments,
            current_url: current_url
        })
    }
    
}