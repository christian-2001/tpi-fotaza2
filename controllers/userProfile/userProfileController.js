import { Publicacion } from "../../models/Publicacion.js"
import { Persona } from "../../models/Persona.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Comentario } from "../../models/Comentario.js"
import { Seguidores } from "../../models/Seguidores.js"
import { Favoritos } from "../../models/Favoritos.js"
import { Publicacion_Favoritos } from "../../models/Publicacion_Favoritos.js"
import { Op } from "sequelize"
import sequelize from "../../db/config.js"
import { Publicacion_Colecciones } from "../../models/Publicacion_Colecciones.js"
import { Colección } from "../../models/Colección.js"
import { DenunciaPublicacion } from "../../models/DenunciaPublicacion.js"
import { DenunciaComentario } from "../../models/DenunciaComentario.js"
import { Notificacion } from "../../models/Notificacion.js"
import { Interes } from "../../models/Interes.js"
import { Motivo } from "../../models/Motivo.js"


export async function mostrarPerfilUsuario(req, res) {

    const sección = req.params.sección
    const id_usuario = req.params.id_usuario
    const userColeccion = req.params.userColeccion
    const current_url = req.originalUrl
    let mapidsColecciones
    let userColecciones
    let userAuthColecciones
    let postsColecciones
    let postsUserAuthColecciones
    let postsFavorito
    let postsColeccion
    let idsComentariosVistos = new Set()
    let displayComentarios = []

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
        const postsFollowing = await getPostsFollowing(seguidos)
        const favoritos = await getPostsFavoritos(usuarioPerfil)
        const postsDenunciados = await getpostsDenunciados(usuarioPerfil)
        const cantPostsDadasDeBaja = await getcantPostsDadasDeBaja(usuarioPerfil)
        
        //Armar array con comentarios denunciados sin repetir
        const comentariosDenunciados = await getComentariosDenunciados(usuarioPerfil.id_usuario)
        comentariosDenunciados.forEach(d => {
            const id = d.Comentario.id_comentario

            if (!idsComentariosVistos.has(id)) {
                idsComentariosVistos.add(id)
                displayComentarios.push(d)
            }
        })

        const notificaciones = await getNotificaciones(usuarioPerfil.id_usuario)
        const interesados = await getInteresados(usuarioPerfil.id_usuario)

        //EXTRAER NOTIFICACIONES NUEVAS/NO LEIDAS DEL ARRAY GENERAL DE NOTIFICACIONES
        const notificacionesNuevas = notificaciones.filter(n => !n.notificacion_leida)

        //EXTRAER NOTIFICACIONES LEIDAS DEL ARRAY GENERAL DE NOTIFICACIONES
        const notificacionesLeidas = notificaciones.filter(n => n.notificacion_leida)
        
        //Ordenar array por id_comentario de forma ascendente
        displayComentarios.sort((a, b) => a.Comentario.id_comentario - b.Comentario.id_comentario)

        
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

        //Colecciones creadas por el usuario
        userColecciones = await Colección.findAll({
            where: {
                id_usuario: usuarioPerfil.id_usuario
            }
        })

        //Ids de las colecciones obtenidas de la consulta anterior
        mapidsColecciones = userColecciones.map(colección => colección.id_colección)

        //Publicaciones guardadas en las colecciones creadas por el usuario
        postsColecciones = await Publicacion_Colecciones.findAll({
            where: {
                id_colección: {
                    [Op.in]: mapidsColecciones
                }
            }
        })

        if (userColeccion) {
            postsColeccion = await getPostsColección(userColeccion, usuarioPerfil.id_usuario)
        }

        //Colecciones creadas por el usuario AUTENTICADO
        userAuthColecciones = await Colección.findAll({
            where: {
                id_usuario: req.user.id_usuario
            }
        })
        //Ids de las colecciones obtenidas de la consulta anterior
        mapidsColecciones = userAuthColecciones.map(colección => colección.id_colección)

        //Publicaciones guardadas en las colecciones creadas por el usuario AUTENTICADO
        postsUserAuthColecciones = await Publicacion_Colecciones.findAll({
            where: {
                id_colección: {
                    [Op.in]: mapidsColecciones
                }
            }
        })

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
            postsFollowing,
            userColecciones,
            userAuthColecciones,
            userColeccion,
            postsColecciones,
            postsUserAuthColecciones,
            postsColeccion,
            postsDenunciados,
            cantPostsDadasDeBaja,
            displayComentarios,
            comentariosDenunciados,
            interesados,
            notificaciones,
            notificacionesNuevas,
            notificacionesLeidas
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

export async function modificarColeccion(req, res) {

    let { id_usuario, sección, userColeccion } = req.params
    let { nombreViejo, nombreNuevo } = req.body.data

    let colección = await Colección.findOne({
        where: {
            nombre_colección: userColeccion
        }
    })

    if (colección) {
        await Colección.update(
            { nombre_colección: nombreNuevo },
            {
                where: {
                    nombre_colección: userColeccion,
                    id_usuario: id_usuario
                },
            },
        );

        res.status(200).json({ newURL: `/usuarioPerfil/${id_usuario}/colecciones/${encodeURIComponent(nombreNuevo)}` })
    }
}

export async function borrarColecciones(req, res) {
    let arrayColecciones = req.body.data

    try {
        await Colección.destroy({
            where: {
                nombre_colección: {
                    [Op.in]: arrayColecciones
                }
            }
        })

        res.status(200).send("COLECCÍON ELIMINADA EXITOSAMENTE!!!")
    } catch (error) {
        res.status(400).send(`Error al eliminar colecciones ${error}`)
    }
}

export async function denunciarPublicación(req, res) {
    const { motivo, descripción, publicación } = req.body.data
    let { id_usuario_publicación } = req.body.data
    id_usuario_publicación = parseInt(id_usuario_publicación)

    try {

        const _post = await Publicacion.findOne({
            where: {
                titulo: publicación,
                id_usuario: id_usuario_publicación
            },

            attributes: ["id_post"]
        })

        const _motivo = await Motivo.findOne({
            where: {
                nombre: motivo
            },

            attributes: ["id_motivo"]
        })

        const denuncia = await DenunciaPublicacion.create({
            id_post: _post.id_post,
            id_denunciante: req.user.id_usuario,
            id_motivo: _motivo.id_motivo,
            descripción: descripción
        })

        res.json({ msj_denunciaExitosa: "Se ha realizado la denuncia hacia la publicación exitosamente" })

    } catch (error) {
        res.status(400).send(`Error al denunciar publicación ${error}`)
    }
}

export async function verificarPublicacionDenunciada(req, res){
    const _idPost = parseInt(req.params.idPublicacion)
    const _idDenunciante = parseInt(req.user.id_usuario)

    const result = await DenunciaPublicacion.findOne({
        where: {
            id_post: _idPost,
            id_denunciante: _idDenunciante
        }
    })

    let msj_confirmacion
    
    if(!result){
        msj_confirmacion = "NO EXISTE DENUNCIA A LA PUBLICACION POR PARTE DEL USUARIO"
    } else {
        msj_confirmacion = "YA DENUNCIASTE ESTA PUBLICACION"
    }
    
    res.json({ msj_confirmacion })
}

export async function mostrarDenunciasComentario(req, res){

    const _id_comentario = parseInt(req.params.id_comentario)

    //Obtener todas las denuncias de todos los comentarios
    const comentariosDenunciados = await getComentariosDenunciados(req.user.id_usuario)

    const denunciasComentario = []

    //Obtener unicamente las denuncias de un comentario segun su id obtenido como parametro en la url
    comentariosDenunciados.forEach(d => {
        if(d.Comentario.id_comentario === _id_comentario){
            denunciasComentario.push(d)
        } 
    })

    res.render("./userProfile/denunciasComentario", {
        imgPath: denunciasComentario[0].Comentario.Imagen.img_path, 
        nombreImg: denunciasComentario[0].Comentario.Imagen.nombre_img,
        nombrePost: denunciasComentario[0].Comentario.Imagen.Publicacion.titulo,
        comentario: denunciasComentario[0].Comentario.texto,
        idComentario: denunciasComentario[0].Comentario.id_comentario,
        denunciasComentario 
    })
}

export async function desestimarDenunciasComentario(req, res){
    const _id_comentario = req.params.id_comentario

    try {
        await DenunciaComentario.update(
            { estado: "desestimada" },
            {
                where: {
                    [Op.and]: [{id_comentario: _id_comentario}, {estado: "pendiente"}]
                }
            }
        )

        res.redirect(`/usuarioPerfil/denuncias/comentario/mostrarDenuncias/resultado/desestimadas`)
    } catch (error) {
        console.error(error)
        res.status(500).send('No se pudo borrar el comentario')
    }
}

export async function borrarComentario(req, res){
    const _id_comentario = req.params.id_comentario

    try {
        const { comentarioBorrado, denunciasValidadas } = await sequelize.transaction(async t => {

            const comentarioBorrado = await Comentario.update(
                { estado: "inactivo" },
                {
                    where: {
                        id_comentario: _id_comentario
                    }
                },
                { transaction: t }
            )

            const denunciasValidadas = await DenunciaComentario.update(
                { estado: "aceptada" },
                {
                    where: {
                        [Op.and]: [{id_comentario: _id_comentario}, {estado: "pendiente"}]
                    }
                },
                { transaction: t }
            )

            return { comentarioBorrado, denunciasValidadas };
        });

        res.redirect(`/usuarioPerfil/denuncias/comentario/mostrarDenuncias/resultado/borrado`)

    } catch (error) {
        console.error(error)
        res.status(500).send('No se pudo borrar el comentario')
    }

}

export async function mostrarVistaResultadoDenuncia(req, res){
    const { accion } = req.params
    const _id_usuario = req.user.id_usuario

    res.render('./userProfile/accionExitosa', {
        titulo: accion === "desestimadas" ? 'Denuncias desestimadas' : 'Comentario borrado',
        mensaje: accion === "desestimadas" 
            ? 'Las denuncias del comentario se desestimaron correctamente.' 
            : 'El comentario se borró y sus denuncias quedaron resueltas.',
        
        urlVolver: `/usuarioPerfil/${_id_usuario}/comentariosDenunciados`
    })
}

async function getPosts(usuario) {
    const publicaciones = await Publicacion.findAll({

        where: {
            id_usuario: usuario.id_usuario,
            estado: "activa"
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

async function getPostsFollowing(seguidos) {

    const mapIdsSeguidos = seguidos.map(i => i.id_seguido)

    let result = await Publicacion.findAll({
        where: {
            id_usuario: {
                [Op.in]: mapIdsSeguidos
            }
        },

        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ]
    })

    return result
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

async function getpostsDenunciados(usuario) {

    let posts = await Publicacion.findAll({
        where: {
            id_usuario: usuario.id_usuario
        },

        include: [
            {
                model: DenunciaPublicacion,
                as: "DenunciaPublicación",
                required: true,
                order: [["fh_denuncia", "DESC"]]
            },
        ],
    })

    const postsDenunciados = await Promise.all(
        posts.map(async (p) => ({
            titulo: p.titulo,
            infoDenuncia: await getInfoDenuncia(p.DenunciaPublicación)
        }))
    )

    return postsDenunciados
}

async function getInfoDenuncia(DenunciaPublicación) {
    const info = [];

    for (let i = 0; i < DenunciaPublicación.length; i++) {
        info.push({
            motivo: await getMotivo(DenunciaPublicación[i]),
            descripcion: DenunciaPublicación[i].descripción || "No hay descripción"
        });
    }

    return info;
}

async function getMotivo(DenunciaPublicación){
    
    const motivo = await Motivo.findOne({
        where: {
            id_motivo: DenunciaPublicación.id_motivo
        }
    })
    
    return motivo.nombre
}

async function getcantPostsDadasDeBaja(usuario){
    const cant = await Publicacion.count({
        where: {
            id_usuario: usuario.id_usuario,
            estado: "inactiva"
        }
    })

    return cant
}

async function getComentariosDenunciados(_id_usuario){
    const result = await DenunciaComentario.findAll({
        where: {
            estado: "pendiente"
        },
        attributes: ["id", "descripcion", "fh_denuncia"],
        include: [
            { model: Motivo, attributes: ["id_motivo", "nombre"] },
            { model: Comentario, 
                attributes: ["id_comentario", "texto"], 
                required: true, 
                include: [
                    { model: Imagen,
                        attributes: ["id_img", "nombre_img", "img_path", "id_post"],
                        required: true,
                        include: [
                            { model: Publicacion, 
                                attributes: ["id_post", "titulo"],
                                where: { 
                                    id_usuario: _id_usuario
                                },
                                required: true
                            }
                        ]
                    }
                ]}
        ],
        order: [["fh_denuncia", "DESC"]],
    })

    return result
}

async function getNotificaciones(_idUsuario){
    const result = await Notificacion.findAll({
        where: {
            id_usuario_destinatario: _idUsuario
        },

        include: [
            { model: Usuario, required: true, as: "creador", attributes: ["id_usuario", "nombre_usuario"]},
            { model: Usuario, required: true, as: "destinatario", attributes: ["id_usuario", "nombre_usuario"]},
            { 
                model: Imagen,
                attributes: ["id_img", "img_path", "id_post"], 
                as: "notificaciones",
                include: [
                    { 
                        model: Publicacion,
                        attributes: ["id_post", "titulo"]
                    }
                ]
            },
        ],

        logging: console.log,
        
        order: [["fecha_notificacion", "DESC"]]
    })


    return result 
}

async function getInteresados(_idUsuario){
    const result = await Interes.findAll({

        where: {
            id_autor: _idUsuario
        },

        include: [
            { 
                model: Imagen, 
                required: true,
                attributes: ["id_img", "img_path", "nombre_img", "id_post", "nombre_img"],
                include: [
                    { 
                        model: Publicacion, 
                        required: true,
                        attributes: ["id_post", "titulo"]
                    }
                ]
            },
            { 
                model: Usuario, 
                as: "interesado", 
                attributes: ["id_usuario", "nombre_usuario", "cant_publicaciones", "cant_seguidores", "cant_seguidos"] 
            }
        ],

        order: [["id_interes", "ASC"]]
    })

    return result
}