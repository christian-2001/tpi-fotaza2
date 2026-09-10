import { Publicacion } from "../../models/Publicacion.js"
import { Persona } from "../../models/Persona.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Seguidores } from "../../models/Seguidores.js"
import { Favoritos } from "../../models/Favoritos.js"
import { Publicacion_Favoritos } from "../../models/Publicacion_Favoritos.js"
import { Op } from "sequelize"
import { Publicacion_Colecciones } from "../../models/Publicacion_Colecciones.js"
import { Colección } from "../../models/Colección.js"


export async function mostrarPerfilUsuario(req, res) {

    const sección = req.params.sección
    const id_usuario = req.params.id_usuario
    const userColeccion = req.params.userColeccion
    const current_url = req.originalUrl
    let userColecciones
    let postsColecciones
    let postsFavorito
    let postsColeccion
    if (!req.user) {
        return res.redirect("/login");
    }

    try {

        let usuarioPerfil
        let esDueño = false

        if (id_usuario) {
            usuarioPerfil = await Usuario.findByPk(id_usuario);

            if (!usuarioPerfil) {
                return res.status(404).send("Usuario no encontrado");
            }

            esDueño = usuarioPerfil.id_usuario === req.user.id_usuario

        } else {

            usuarioPerfil = req.user
            esDueño = true

        }

        const perfilDescripción = await Usuario.findOne({
            where: {
                id_usuario: usuarioPerfil.id_usuario
            },

            include: [
                { model: Persona, required: true }
            ]
        })

        const publicaciones = await getPosts(usuarioPerfil);
        const seguidores = await getFollowers(usuarioPerfil);
        const seguidos = await getFollowing(usuarioPerfil);
        const favoritos = await getPostsFavoritos(usuarioPerfil)

        let yaEsSeguido = false;

        let misFollowing = [];

        if (req.user && !esDueño) {
            yaEsSeguido = seguidores.some(f => f.seguidor.id_usuario === req.user.id_usuario);

            const usuarioSesion = await Usuario.findByPk(req.user.id_usuario);
            misFollowing = await getFollowing(usuarioSesion);
        }

        postsFavorito = await Publicacion_Favoritos.findAll({
            where: {
                id_favoritos: req.user.id_usuario
            },

            order: [["id_post", "ASC"]]
        })

        misFollowing = await Seguidores.findAll({
            where: { id_seguidor: req.user.id_usuario },
            include: [{ model: Usuario, as: 'seguido' }],
        });

        if (req.user) {
            //Colecciones creadas por el usuario autenticado
            userColecciones = await Colección.findAll({
                where: {
                    id_usuario: req.user.id_usuario
                }
            })

            //Ids de las colecciones obtenidas de la consulta anterior
            const mapidsColecciones = userColecciones.map(colección => colección.id_colección)

            //Publicaciones guardadas en las colecciones creadas por el usuario autenticado
            postsColecciones = await Publicacion_Colecciones.findAll({
                where: {
                    id_colección: {
                        [Op.in]: mapidsColecciones
                    }
                }
            })

            if (sección === "colecciones" && userColeccion) {
                postsColeccion = await getPostsColección(userColeccion, req.user.id_usuario)

                console.log("==========================================================================================")
                console.log(postsColeccion.length)
                console.log("==========================================================================================")

            }
        }



        res.render("./userProfile/userProfile", {
            sección,
            usuario: usuarioPerfil,
            perfilDescripción: perfilDescripción.Persona,
            esDueño,
            posts: publicaciones,
            seguidores,
            seguidos,
            yaEsSeguido,
            misFollowing,
            favoritos,
            postsFavorito,
            current_url,
            userColecciones,
            userColeccion,
            postsColecciones,
            postsColeccion
        });
    } catch (error) {
        res.status(400).send(`Ocurrió un error ${error}`)
    }
}

export async function registrarFollow(req, res) {
    const id_usuarioSession = req.user.id_usuario
    const id_usuario = req.params.idUsuarioSeguido
    const sección = req.params.sección

    try {

        const nuevoSeguidor = await Seguidores.create({
            id_seguidor: id_usuarioSession,
            id_seguido: id_usuario
        })

        res.redirect(req.headers.referer || "/")
    } catch (error) {
        res.status(400).send(`Error al guardar seguidor ${error}`)
    }
}

export async function eliminarFollow(req, res) {
    const id_usuarioSession = req.user.id_usuario
    const id_usuario = req.params.idUsuarioSeguido
    const sección = req.params.sección

    try {
        const quitarSeguidor = await Seguidores.destroy({
            where: {
                id_seguidor: id_usuarioSession,
                id_seguido: id_usuario
            }
        })

        res.redirect(req.headers.referer || "/")
    } catch (error) {
        res.status(400).send(`Error al eliminar seguidor ${error}`)
    }
}

async function getPosts(usuario) {

    const publicaciones = await Publicacion.findAll({

        where: {
            '$Usuario.id_usuario$': usuario.id_usuario
        },

        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ]
    })

    return publicaciones
}

async function getFollowers(usuario) {

    const seguidores = await Seguidores.findAll({
        where: {
            id_seguido: usuario.id_usuario
        },

        include: [
            { model: Usuario, as: "seguidor" }
        ]
    })

    return seguidores
}


async function getFollowing(usuario) {

    const seguidos = await Seguidores.findAll({
        where: {
            id_seguidor: usuario.id_usuario
        },

        include: [
            { model: Usuario, as: "seguido" }
        ]
    })

    return seguidos
}

async function getPostsFavoritos(usuario) {

    const id_userFavoritos = await Favoritos.findByPk(usuario.id_usuario)

    const publicaciones = await Publicacion.findAll({

        where: {
            '$Publicacion_Favoritos.id_favoritos$': {
                [Op.eq]: id_userFavoritos.id_favoritos
            }
        },


        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
            { model: Publicacion_Favoritos, required: true },
        ],

    })

    //Ordenar de forma descendente las publicaciones favoritas según fecha y hora de guardado
    publicaciones.sort((a, b) => b.Publicacion_Favoritos[0].fh_guardado - a.Publicacion_Favoritos[0].fh_guardado)

    return publicaciones
}

async function getPostsColección(_nombre_colección, _id_usuario) {
    const _colección = await Colección.findOne({
        where: {
            nombre_colección: _nombre_colección,
            id_usuario: _id_usuario
        }
    })


    const _posts_coleccion = await Publicacion_Colecciones.findAll({
        where: {
            id_colección: _colección.id_colección
        },
    });

    const Ids_posts_coleccion = _posts_coleccion.map(pc => pc.id_post)

    const posts = await Publicacion.findAll({

        where: {
            id_post: {
                [Op.in]: Ids_posts_coleccion
            }
        },

        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ]
    })

    return posts
}