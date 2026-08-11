import { Usuario } from "../../models/Usuario.js"
import { Publicacion } from "../../models/Publicacion.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Favoritos } from "../../models/Favoritos.js"
import { Publicacion_Favoritos } from "../../models/Publicacion_Favoritos.js"
import { Op, Sequelize } from "sequelize"

export async function pagIndex(req, res) {
    let postsFavorito

    //Publicaciones con: Titulo, Descripcion, Nombre del usuario, Fecha y hora de publicacion, Etiquetas, Imagenes

    const posts = await Publicacion.findAll({
        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen, required: true },
        ],
        order: [['fh_publicacion', 'DESC']]
    })

    //Verificar en cada publicación si el usuario autenticado lo tiene guardado como favorito
    //Primero se verifica que el usuario esté logueado
    if (req.user) {
        postsFavorito = await Publicacion_Favoritos.findAll({
            where: {
                id_favoritos: req.user.id_usuario
            },

            order: [["id_post", "ASC"]]
        })
    }

    res.render("index", {
        posts,
        queryResult: null,
        orden: null,
        postTag: "",
        imgTag: "",
        query: "",
        postsFavorito
    })

}

//Guardar publicación en la seccion Favortios del usuario
export async function guardarPost_favoritos(req, res) {

    //Verifica si la publicación ya se enceuntra en la sección "Favoritos" del usuario
    let esFavorito = false

    //Guardar id de la publicación que quiero guardar
    let id_post = req.params.id_post

    try {
        //Hallar la publicación mediante id guardado
        const post = await Publicacion.findByPk(id_post)

        //Obtener id de la sección Favoritos del usuario en sesion
        const id_fav = await Favoritos.findByPk(req.user.id_usuario)

        //Verificar que exista la publicación en "Favoritos" del usuario
        esFavorito = await Publicacion_Favoritos.findOne({
            where: {
                id_post: post.id_post,
                id_favoritos: id_fav.id_favoritos
            }
        })

        //Guardar publicación en Favoritos 
        if (!esFavorito) {

            //Si no está en la sección lo guardamos
            await Publicacion_Favoritos.create({
                id_post: post.id_post,
                id_favoritos: id_fav.id_favoritos
            })
            console.log("PUBLICACION GUARDADA EN FAVORITOS!!!!")
        } else {
            //En caso contrario, indica al usuario de la publicación perviamente guardada
            console.log("YA GUARDASTE LA PUBLICACIÓN COMO FAVORITO")
        }

        res.status(200).send("PUBLICACION GUARDADA EN FAVORITOS!!!!")

    } catch (error) {
        res.status(400).send(`Error al guardar la publicación ${error}`)
    }
}

export async function quitarPost_favoritos(req, res) {

    //id de la publicación 
    let post_id = req.params.id_post

    
    //Quitar la publicación de "Favoritos"
    try {
   
        //Obtener id de la sección Favoritos del usuario en sesion
        const id_fav = await Favoritos.findByPk(req.user.id_usuario)
        
        console.log(id_fav)
        //Hallar la publicación guardada
        const postFavorito = await Publicacion_Favoritos.findOne({
            where: {
                id_post: post_id,
                id_favoritos: id_fav.id_favoritos
            }
        })

        //Quitar publicación de la base de datos
        postFavorito.destroy()

        res.status(200).send("PUBLICACIÓN ELIMINADA DE FAVORITOS")

    } catch (error) {
        res.status(400).send(`Error al quitar la publicación ${error}`)
    }
}