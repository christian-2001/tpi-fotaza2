import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op, Sequelize } from "sequelize"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"
import { Comentario } from "../../models/Comentario.js"
import { Valorizacion } from "../../models/Valorizacion.js"

export async function mostrarPost(req, res) {
    const id = req.params.id_post
    let img = Number(req.params.img_index)

    const current_url = req.originalUrl

    const imgs = await Imagen.findAll({
        include: [
            { model: Publicacion, required: true, where: { id_post: id } },
            { model: Valorizacion }
        ]
    })

    const img_coments = await Comentario.findAll({
        include: [
            { model: Imagen, required: true, where: { id_img: imgs[img].id_img } },
            { model: Usuario, required: true }
        ]
    })

    const tags = await Imagen_Etiqueta.findAll({
        where: {
            '$Imagen_Etiqueta.id_img$': {
                [Op.eq]: imgs[img].id_img
            }
        }
    })

    const img_tags = await Etiqueta.findAll({
        where: {
            '$Etiqueta.id_etiqueta$': {
                [Op.eq]: tags[0].id_etiqueta
            }
        },
        attributes: ["nom_etiqueta"]
    })

    const cant = await Valorizacion.count({
        where: {
            id_img: imgs[img].id_img
        }
    })

    let prom = await Valorizacion.findAll({

        where: {
            id_img: imgs[img].id_img
        },

        attributes: [
            [Sequelize.fn("AVG", Sequelize.col("puntaje")), "promedio"]
        ]
    })

    const prom_valorizacion = Number(prom[0].dataValues.promedio)
/*
    let prom_valorizacion = 0
    let cant = 0

    imgs[img].Valorizacions.forEach(i => {
        prom_valorizacion += i.puntaje
        cant++
    })

    prom_valorizacion = Math.round(parseInt(prom_valorizacion / cant))
*/
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
            img_tags: img_tags,
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
            img_tags: img_tags,
            comments: img_coments,
            current_url: current_url
        })
    }
}


export async function actualizarImgPost(req, res) {

    const id = req.params.id_post
    let img = Number(req.params.img_index)

    if (Object.hasOwn(req.body, "valorizacion")) {
        const id_usuario = req.user.id_usuario

        //let prom_valorizacion = 0
        //let cant = 0

        try {
            const imgs = await Imagen.findAll({
                include: [
                    { model: Publicacion, required: true, where: { id_post: id } },
                    { model: Valorizacion }
                ]
            })

            try {
                const valorizacionQuery = await Valorizacion.findOne({
                    where: {
                        id_img: req.body.valorizacion.id_img,
                        id_usuario: id_usuario,
                        puntaje: req.body.valorizacion.puntaje
                    }
                })

                if (!valorizacionQuery) {
                    try {
                        const nueva_valorizacion = await Valorizacion.create({
                            id_img: req.body.valorizacion.id_img,
                            id_usuario: id_usuario,
                            puntaje: req.body.valorizacion.puntaje
                        })

                        try {
                            const cant = await Valorizacion.count({
                                where: {
                                    id_img: req.body.valorizacion.id_img
                                }
                            })

                            try {
                                let prom = await Valorizacion.findAll({

                                    where: {
                                        id_img: req.body.valorizacion.id_img
                                    },

                                    attributes: [
                                        [Sequelize.fn("AVG", Sequelize.col("puntaje")), "promedio"]
                                    ]
                                })

                                const prom_aux = Number(prom[0].dataValues.promedio)

                                res.json({ cantValorizaciones: cant, prom_valorizacion: prom_aux })
                            } catch (error) {
                                res.status(400).send(`Error en promedio de valorizaciones ${error}`)
                            }
                        } catch (error) {
                            res.status(400).send(`Error en cantidad de valorizaciones ${error}`)
                        }

                    } catch (error) {
                        res.status(400).send(`Error en guardado de valorizacion ${error}`)
                    }
                } /*else { //ESTO NO SE TENDRÁ EN CUENTA PARA LA ENTREGA DEL TPI
                    try {
                        await Valorizacion.update(
                            { puntaje: req.body.valorizacion.puntaje },

                            {
                                where: {
                                    [Op.and]: [
                                        {
                                            id_img: valorizacionQuery.id_img
                                        },
                                        {
                                            id_usuario: valorizacionQuery.id_usuario
                                        }
                                    ]
                                }
                            }
                        )

                        imgs[img].Valorizacions.forEach(i => {
                            prom_valorizacion += i.puntaje
                            cant++
                        })

                        prom_valorizacion = parseInt(prom_valorizacion / cant)

                        res.json({ prom_valorizacion: prom_valorizacion })
                    } catch (error) {
                        res.status(400).send(`Error en actualizar la valorizacion ${error}`)
                    }
                }*/
            } catch (error) {
                res.status(400).send(`Error en encontrar la valorizacion ${error}`)
            }
        } catch (error) {
            res.status(400).send(`Error al buscar imagenes ${error}`)
        }

    }

    else if (Object.hasOwn(req.body, "comment_text")) {
        //res.json({ comment_text: req.body.comment_text, nombre_usuario: "tito2001" })
    }
}