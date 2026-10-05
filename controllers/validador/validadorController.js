import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { DenunciaPublicacion } from "../../models/DenunciaPublicacion.js"
import { Op, Sequelize } from "sequelize"

export async function indexValidador(req, res) {

    const UMBRAL_DENUNCIAS = 3

    const agrupadas = await DenunciaPublicacion.findAll({
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

    const mapIdsPosts = agrupadas.map(a => a.id_post)

    const postsDenunciados = await Publicacion.findAll({
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

    const posts = postsDenunciados.map(post => ({
        ...post.dataValues,
        cantDenuncias: getCantDenuncias(post, agrupadas)
    }))

    let ocultarBuscador

    if (req.user.rol === "validador") {
        ocultarBuscador = true
    }

    res.render("indexValidador", {
        posts,
        ocultarBuscador
    })
}

export async function vistaPublicaciónDenunciada(req, res){

    res.render("./publicaciónDenunciada/publicaciónDenunciada")
}

function getCantDenuncias(post, agrupadas){
    const publicaciónHallada = agrupadas.find(i => i.id_post = post.id_post)

    return publicaciónHallada.cantDenuncias
}