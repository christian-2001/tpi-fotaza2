import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { DenunciaPublicacion } from "../../models/DenunciaPublicacion.js"
import { Op, Sequelize } from "sequelize"
import sequelize from "../../db/config.js"
import { Motivo } from "../../models/Motivo.js"

const UMBRAL_DENUNCIAS = 3

export async function indexValidador(req, res) {

    const agrupadas = await getAll_DenunciasPublicaciones(UMBRAL_DENUNCIAS)

    const postsDenunciados = await getAll_PublicacionesDenunciadas(agrupadas)

    const posts = postsDenunciados.map(post => ({
        ...post.dataValues,
        cantDenuncias: getCantDenuncias(post, agrupadas)
    }))

    const ocultarBuscador = req.user.rol === "validador" ? true : false

    res.render("./validador/indexValidador", {
        posts,
        ocultarBuscador
    })
}

export async function vistaPublicaciónDenunciada(req, res) {
    const _idPost = Number(req.params.id_post)

    const agrupada = await getOne_DenunciasPublicaciones(_idPost, UMBRAL_DENUNCIAS)

    const infoDenuncias = await getDenunciasPublicacion(_idPost)

    const postDenunciado = await getOne_PublicacionesDenunciadas(agrupada)

    const post = {
        ...postDenunciado[0].dataValues,
        cantDenuncias: agrupada.cantDenuncias
    }

    const cantPublicacionesBajadas = await getCantPublicacionesBajadas(post.Usuario.id_usuario)

    const ocultarBuscador = req.user.rol === "validador" ? true : false

    res.render("./validador/publicaciónDenunciada/publicaciónDenunciada", {
        post,
        cantPublicacionesBajadas,
        infoDenuncias,
        ocultarBuscador
    })
}

export async function darDeBajaPublicación(req, res) {
    const _idPost = Number(req.params.id_post)

    try {
        const { cuentaInhabilitada } = await sequelize.transaction(async t => {
            let cuentaInhabilitada = false

            const post = await Publicacion.findOne({
                where: {
                    id_post: _idPost,
                    estado: "activa"
                },
                transaction: t
            })

            if (!post) {
                throw new Error("La publicación ya fue revisada o no existe")
            }

            // baja lógica de la publicación: solo se cambia el estado
            await Publicacion.update(
                { estado: "inactiva" },
                {
                    where: {
                        id_post: _idPost,
                        estado: "activa"
                    }
                },
                { transaction: t }
            )

            // las denuncias pendientes quedan confirmadas
            await DenunciaPublicacion.update(
                { estado: "aceptada" },
                {
                    where: {
                        id_post: _idPost,
                        estado: "pendiente"
                    }
                },
                { transaction: t }
            )

            // Verificar si el autor llegó a las 3 bajas

            //Cantidad de publicaciones del autor bajadas
            const cantBajas = await Publicacion.count({
                where: {
                    id_usuario: post.id_usuario,
                    estado: "inactiva"
                },
                transaction: t
            })

            //Dar de baja/inhabilitar la cuenta del autor en caso de alcanzar el umbral
            //Baja logica, solo se cambia el estado (igual que con la publicación)
            if (cantBajas >= 3) {
                await Usuario.update(
                    { estado: "inactiva" },
                    {
                        where: {
                            id_usuario: post.id_usuario,
                            estado: "activa"
                        }
                    },
                    { transaction: t }
                )
                return { cuentaInhabilitada: true }
            } else {
                return { cuentaInhabilitada: false }
            }
        })

        res.render("validador/resultado/resultado", {
            resultado: "ok",
            titulo: "Publicación dada de baja",
            detalle: cuentaInhabilitada
                ? "Además, la cuenta del autor fue inhabilitada por acumular 3 publicaciones dadas de baja."
                : "La publicación ya no es visible para los usuarios."
        })
    } catch (error) {
        console.log(error)

        res.render("validador/resultado/resultado", {
            resultado: "error",
            titulo: "No se pudo completar la operación",
            detalle: esperable ? error.message : "Ocurrió un error inesperado. Intentá nuevamente.",
        })
    }
}

export async function desestimarDenuncias(req, res) {
    const _idPost = Number(req.params.id_post)

    try {
        const result = await sequelize.transaction(async t => {
            let denunciasDesestimadas = false

            const post = await Publicacion.findByPk(_idPost, { transaction: t })

            const desestimadas = await DenunciaPublicacion.update(
                { estado: "desestimada" },
                {
                    where: {
                        id_post: _idPost,
                        estado: "pendiente"
                    }
                },
                { transaction: t }
            )

            if(!post || !desestimadas){
                throw new Error ("La publicación no existe o las denuncias ya han sido desestimadas")
            }

            return true
        })

        res.render("validador/resultado/resultado", {
            resultado: "ok",
            titulo: "Las denuncias fueron desestimadas",
            detalle: "La publicación sale de tu lista de trabajo y seguirá siendo visible para los usuarios."
        })

    } catch (error) {
        console.log(error)

        res.render("validador/resultado/resultado", {
            resultado: "error",
            titulo: "No se pudo completar la operación",
            detalle: esperable ? error.message : "Ocurrió un error inesperado. Intentá nuevamente.",
        })
    }
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
            },
            estado: "activa"
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
            id_post: agrupada.id_post,
            estado: "activa"
        },

        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen, required: true },
        ],
        order: [['fh_publicacion', 'DESC']],
    })
}

async function getCantPublicacionesBajadas(_idUsuario) {
    const cantBajadas = await Publicacion.count({
        where: {
            id_usuario: _idUsuario,
            estado: "inactiva"
        }
    })

    return cantBajadas
}

async function getDenunciasPublicacion(_idPost) {
    return await DenunciaPublicacion.findAll({
        where: {
            id_post: _idPost,
            estado: "pendiente",
        },

        include: [
            {
                model: Motivo,
                attributes: ["nombre"]
            }
        ],

        attributes: ["id_motivo", "descripción"],
        order: [["fh_denuncia", "ASC"]]
    })
}