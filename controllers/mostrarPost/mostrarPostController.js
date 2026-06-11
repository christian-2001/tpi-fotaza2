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

    try {
        const imgs = await Imagen.findAll({

            order: [['id_img', 'ASC']],

            include: [
                { model: Publicacion, required: true, where: { id_post: id } },
                { model: Valorizacion }
            ]
        })

        const post_user = await Publicacion.findOne({
            where: {
                id_post: id
            },

            attributes: ["id_usuario"],

            include: [
                { model: Usuario, required: true, attributes: ["id_usuario"] }
            ]
        })

        const img_coments = await Comentario.findAll({

            order: [["fh_comentario", "ASC"]],

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

        let miValorizacion

        if (req.user) {
            miValorizacion = await Valorizacion.findOne({
                where: {
                    id_img: imgs[img].id_img,
                    id_usuario: req.user.id_usuario
                }
            })

            console.log(miValorizacion)
        }

        if (img > 0 && img < (imgs.length - 1)) {
            const img_prev = img - 1
            const img_next = img + 1

            res.render("./post/postView", {
                postImages: imgs,
                post_id: id,
                id_post_user: post_user.id_usuario,
                prev: img_prev,
                next: img_next,
                imgIndex: img,
                img_index_aux: img,
                cant_valorizaciones: cant,
                prom_valorizacion,
                miValorizacion,
                img_tags,
                comments: img_coments,
                current_url
            })
        } else {
            res.render("./post/postView", {
                postImages: imgs,
                post_id: id,
                id_post_user: post_user.id_usuario,
                imgIndex: img,
                img_index_aux: img,
                cant_valorizaciones: cant,
                prom_valorizacion,
                miValorizacion,
                img_tags,
                comments: img_coments,
                current_url
            })
        }
    } catch (error) {
        res.status(400).send(`Ocurrió un error ${error}`)
    }
}


export async function actualizarImgPost(req, res) {

    const id = req.params.id_post
    let img = Number(req.params.img_index)
    const id_usuario = req.user.id_usuario

    if (Object.hasOwn(req.body, "valorizacion")) {

        try {
            const imgs = await Imagen.findAll({
                include: [
                    { model: Publicacion, required: true, where: { id_post: id } },
                    { model: Valorizacion }
                ]
            })

            const valorizacionQuery = await Valorizacion.findOne({
                where: {
                    id_img: req.body.valorizacion.id_img,
                    id_usuario: id_usuario,
                }
            })

            if (!valorizacionQuery) {

                await Valorizacion.create({
                    id_img: req.body.valorizacion.id_img,
                    id_usuario: id_usuario,
                    puntaje: req.body.valorizacion.puntaje
                })

            } else if (valorizacionQuery) {

                const updateValorizacion = await Valorizacion.update(
                    { puntaje: req.body.valorizacion.puntaje },
                    {
                        where: {
                            id_img: req.body.valorizacion.id_img,
                            id_usuario: id_usuario
                        }
                    }
                )

            }

            const cant = await Valorizacion.count({
                where: { id_img: req.body.valorizacion.id_img }
            })

            const prom = await Valorizacion.findAll({
                where: { id_img: req.body.valorizacion.id_img },
                attributes: [
                    [Sequelize.fn("AVG", Sequelize.col("puntaje")), "promedio"]
                ]
            })

            const prom_aux = Number(prom[0].dataValues.promedio)

            res.json({ cantValorizaciones: cant, prom_valorizacion: prom_aux })

        } catch (error) {
            res.status(400).send(`Error en valorizacion ${error}`)
        }

        //Si lo que viene en el cuerpo del request es un comentario, 
    } else if (Object.hasOwn(req.body, "comentario")) {

        //Guardado del nuevo comentario proveniente del fetch en frontend y nombre del usuario en sesion

        const comentario_fetch = req.body.comentario.texto
        const nombreUsuario_session = req.user.nombre_usuario

        //Creacion y almacenamiento del nuevo comentario en la bd
        try {
            const nuevo_comentario = await Comentario.create({
                texto: comentario_fetch,
                id_img: req.body.comentario.id_img,
                id_usuario: id_usuario
            })
            //Envio de datos con res.json que contiene el nuevo comentario y el nombre del usuario en sesion quien lo comentó
            res.json({ comment_text: nuevo_comentario.texto, nombre_usuario: nombreUsuario_session })
        } catch (error) {
            res.status(400).send(`Error al crear comentario ${error}`)
        }
    }
}

export async function cerrarComentarios(req, res) {

    try {
        const id_post = req.params.id_post
        const id_imgPost = Number(req.params.id_img)

        const imgPost = await Imagen.findAll({
            where: { id_post: id_post },
            order: [['id_img', 'ASC']]
        })

        try {
            const imgPost_comentarios = await Imagen.update(
                { comentarios_cerrados: true },
                {
                    where: {
                        id_img: imgPost[id_imgPost].id_img
                    }
                }
            )

            res.redirect(`/post/${id_post}/${id_imgPost}`)
        } catch (error) {
            res.status(400).send(`Error al cerrar comentarios ${error}`)
        }
    } catch (error) {
        res.status(400).send(`Error al obtener imagen ${error}`)
    }
}

/*else { //ESTO NO SE TENDRÁ EN CUENTA PARA LA ENTREGA DEL TPI
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