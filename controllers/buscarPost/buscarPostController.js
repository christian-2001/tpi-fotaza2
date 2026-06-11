import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op } from "sequelize"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"

const ordenMap = {
    fecha_desc: [["fh_publicacion", "DESC"]],
    fecha_asc: [["fh_publicacion", "ASC"]],
    titulo_asc: [["titulo", "ASC"]],
    titulo_desc: [["titulo", "DESC"]],
    usuario_asc: [[Usuario, "nombre_usuario", "ASC"]],
}

export async function buscarPost(req, res) {

    let postTag = req.query.etiqueta ? req.query.etiqueta : ""
    let imgTag = req.query.img_etiqueta ? req.query.img_etiqueta : ""
    let postQuery = req.query.buscador ? req.query.buscador.trim() : ""

    const ordenSeleccionado = req.query.orden
        ? (Array.isArray(req.query.orden) ? req.query.orden : [req.query.orden])
        : []

    const orderClause = ordenSeleccionado
        .filter(o => ordenMap[o])
        .flatMap(o => ordenMap[o])

    try {
        if (imgTag) {
            const queryResult = await getImgTag(imgTag, orderClause)
            return res.render("index", { queryResult, query: `#${imgTag}`, orden: ordenSeleccionado, postTag: "", imgTag })
        }

        if (postTag) {
            const queryResult = await getPostTag(postTag, orderClause)
            return res.render("index", { queryResult, query: `#${postTag}`, orden: ordenSeleccionado, postTag, imgTag })
        }

        if (postQuery === "" && !postTag && !imgTag) {
            const queryResult = await Publicacion.findAll({
                include: [
                    { model: Usuario, required: true },
                    { model: Etiqueta, required: true },
                    { model: Imagen, required: true },
                ],
                order: orderClause
            })
            return res.render("index", { queryResult, query: "", orden: ordenSeleccionado, postTag: "", imgTag: "" })
        }

        if (postQuery.startsWith("#")) {
            postQuery = postQuery.split("#")[1]
            const queryResult = await getPostQuery(postQuery, orderClause)
            return res.render("index", { queryResult, query: `#${postQuery}`, orden: ordenSeleccionado, postTag: "", imgTag: "" })
        }

        const queryResult = await getPostQuery(postQuery, orderClause)
        return res.render("index", { queryResult, query: postQuery, orden: ordenSeleccionado, postTag: "", imgTag: "" })

    } catch (error) {
        res.status(400).send(`Ocurrió un error al mostrar las publicaciones: ${error}`)
    }
}

// Obtener publicaciones que coincidan con la etiqueta de una publicacion
async function getPostTag(tag, order) {
    return await Publicacion.findAll({
        where: {
            [Op.or]: [
                { '$Etiqueta.nom_etiqueta$': { [Op.iLike]: `%${tag}%` } },
                { '$Tags.nom_etiqueta$': { [Op.eq]: tag } }
            ]
        },
        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
            { model: Etiqueta, as: "Tags", required: true }
        ],
        order
    })
}

// Obtener publicaciones que coincidan con la etiqueta de imagen recibida
async function getImgTag(img_tag, order) {
    const tagsQuery = await Etiqueta.findAll({
        where: { '$Etiqueta.nom_etiqueta$': { [Op.eq]: img_tag } },
        include: [{ model: Imagen_Etiqueta }]
    })

    const imageIds = tagsQuery[0].Imagen_Etiqueta.map(img => img.id_img)

    const imagesQuery = await Imagen.findAll({
        where: { id_img: { [Op.in]: imageIds } },
        include: [{ model: Publicacion }]
    })

    const postIds = imagesQuery.map(post => post.Publicacion.id_post)

    return await Publicacion.findAll({
        where: { id_post: { [Op.in]: postIds } },
        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ],
        order
    })
}

// Filtrar publicaciones por valor de la barra de búsqueda
async function getPostQuery(query, order) {
    const tagsQuery = await Etiqueta.findAll({
        where: {
            [Op.or]: [
                { '$Etiqueta.nom_etiqueta$': { [Op.iLike]: `%${query}%` } },
                { '$Etiqueta.nom_etiqueta$': { [Op.startsWith]: `%${query}%` } }
            ]
        },
        include: [{ model: Imagen_Etiqueta }]
    })

    let imageIds = tagsQuery.flatMap(img => img.Imagen_Etiqueta.map(img2 => img2.id_img))

    const imagesQuery = await Imagen.findAll({
        where: { id_img: { [Op.in]: imageIds } },
        include: [{ model: Publicacion }]
    })

    const postIds = imagesQuery.map(post => post.Publicacion.id_post)

    return await Publicacion.findAll({
        where: {
            [Op.or]: [
                { '$Publicacion.titulo$': { [Op.iLike]: `%${query}%` } },
                { '$Publicacion.descripcion$': { [Op.iLike]: `%${query}%` } },
                { '$Usuario.nombre_usuario$': { [Op.iLike]: `%${query}%` } },
                { '$Etiqueta.nom_etiqueta$': { [Op.like]: `%${query}%` } },
                { id_post: { [Op.in]: postIds } }
            ]
        },
        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ],
        order
    })
}
