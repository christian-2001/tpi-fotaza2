import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { DenunciaPublicacion } from "../../models/DenunciaPublicacion.js"
import { Op, Sequelize } from "sequelize"

const UMBRAL_DENUNCIAS = 3

export async function indexValidador(req, res) {

    const agrupadas = await getAll_DenunciasPublicaciones(UMBRAL_DENUNCIAS)

    const postsDenunciados = await getAll_PublicacionesDenunciadas(agrupadas)

    const posts = postsDenunciados.map(post => ({
        ...post.dataValues,
        cantDenuncias: getCantDenuncias(post, agrupadas)
    }))

    const ocultarBuscador = req.user.rol === "validador" ? true : false

    res.render("indexValidador", {
        posts,
        ocultarBuscador
    })
}

export async function vistaPublicaciónDenunciada(req, res) {
    const _idPost = req.params.id_post

    const agrupada = await getOne_DenunciasPublicaciones(_idPost, UMBRAL_DENUNCIAS)

    const postDenunciado = await getOne_PublicacionesDenunciadas(agrupada)

    const post = {
        ...postDenunciado[0].dataValues,
        cantDenuncias: agrupada.cantDenuncias
    }

    const ocultarBuscador = req.user.rol === "validador" ? true : false

    res.render("./publicaciónDenunciada/publicaciónDenunciada", {
        post,
        ocultarBuscador
    })
}

function getCantDenuncias(post, agrupadas) {
    const publicaciónHallada = agrupadas.find(i => i.id_post = post.id_post)

    return publicaciónHallada.cantDenuncias
}

async function getAll_DenunciasPublicaciones(UMBRAL_DENUNCIAS) {
    return await DenunciaPublicacion.findAll({
        attributes: [
            "id_post",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("id_denunciante"))), "cantDenuncias"],
        ],
        where: {
            estado: "pendiente"
        },
        group: ["id_post"],
        having: Sequelize.where(
            Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("id_denunciante"))),
            { [Op.gt]: UMBRAL_DENUNCIAS }
        ),
        raw: true,
    })
}

async function getOne_DenunciasPublicaciones(_idPost, UMBRAL_DENUNCIAS) {
    return await DenunciaPublicacion.findOne({
        attributes: [
            "id_post",
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("id_denunciante"))), "cantDenuncias"],
        ],
        where: {
            id_post: _idPost,
            estado: "pendiente"
        },
        group: ["id_post"],
        having: Sequelize.where(
            Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("id_denunciante"))),
            { [Op.gt]: UMBRAL_DENUNCIAS }
        ),
        raw: true,
    })
}

async function getAll_PublicacionesDenunciadas(agrupadas) {

    const mapIdsPosts = agrupadas.map(a => a.id_post)

    return await Publicacion.findAll({
        where: {
            id_post: {
                [Op.in]: mapIdsPosts
            }
        },

        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen, required: true },
        ],
        order: [['fh_publicacion', 'DESC']],
    })
}

async function getOne_PublicacionesDenunciadas(agrupada) {

    return await Publicacion.findAll({
        where: {
            id_post: agrupada.id_post
        },

        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen, required: true },
        ],
        order: [['fh_publicacion', 'DESC']],
    })
}