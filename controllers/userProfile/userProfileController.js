import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Seguidores } from "../../models/Seguidores.js"
export async function mostrarPerfilUsuario(req, res) {

    const sección = req.params.sección

    if (!req.user) {
        res.redirect("/login")
        return
    } else if (req.user) {
        const usuario_sesion = req.user

        try {
            const publicaciones = await getPosts(usuario_sesion)
            const seguidores = await getFollowers(usuario_sesion)
            const seguidos = await getFollowing(usuario_sesion)

            res.render("./userProfile/userProfile", {
                sección: sección,
                posts: publicaciones,
                seguidores: seguidores,
                seguidos: seguidos,
            })

        } catch (error) {
            res.status(400).send(`Ocurrió un error ${error}`)
        }
    }
}

async function getPosts(usuario_sesion) {

    const publicaciones = await Publicacion.findAll({

        where: {
            '$Usuario.id_usuario$': usuario_sesion.id_usuario
        },

        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ]
    })

    return publicaciones
}


async function getFollowers(usuario_sesion) {

    const seguidores = await Seguidores.findAll({
        where: {
            id_seguido: usuario_sesion.id_usuario
        },

        include: [
            { model: Usuario, as: "seguidor" }
        ]
    })

    return seguidores
}


async function getFollowing(usuario_sesion) {

    const seguidos = await Seguidores.findAll({
        where: {
            id_seguidor: usuario_sesion.id_usuario
        },

        include: [
            { model: Usuario, as: "seguido" }
        ]
    })

    return seguidos
}