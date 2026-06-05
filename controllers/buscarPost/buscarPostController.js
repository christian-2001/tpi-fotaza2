import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op } from "sequelize"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"

export async function buscarPost(req, res) {

    let postQuery = (req.query.buscador) ? req.query.buscador.trim() : ""
    let postTag = (req.query.etiqueta) ? req.query.etiqueta : ""

    //Comprobamos si lo que vino desde el frontend es via barra de busqueda o el valor obtenido al clickear una etiqueta

    //Si el usuario no ha ingresado nada en la barra de busqueda, la pagina lo redirige al "home"
    if (postTag) {
        //Si la etiqueta se obtuvo al hacerle click recibiendo su nombre

        //Filtrar las publicaciones que contenga la etiqueta recibida
        try {
            const queryResult = await getPostTag(postTag)
            res.status(400).render("index", { queryResult: queryResult, query: `#${postTag}` })
        } catch (error) {
            res.status(400).send("Ocurrio un error al mostrar las publicaciones")
        }

        //Si el valor recibido desde la barra de busqueda es vacio o no tiene nada,
        //me devuelve al home
    } else if (postQuery == "") {

        res.redirect("/")

        //Si el valor recibido, desde la barra de busqueda empieza con almohadilla o hash(#), 
        // o proviene del click a una etiqueta recibiendo su nombre
    } else if ((postQuery && postQuery.startsWith("#"))) {

        //Si la etiqueta proviene de la barra de busqueda
        postQuery = postQuery.split("#")[1]

        //Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
        try {
            const queryResult = await getPostTag(postQuery)
            res.status(400).render("index", { queryResult: queryResult, query: `#${postQuery}` })
        } catch (error) {
            res.status(400).send("Ocurrio un error al mostrar las publicaciones")
        }

        //Si el valor recibido proviene de la barra de busqueda y no empieza con almohadilla o hash(#)
    } else if (postQuery) {

        //Funcion que obtiene el resultado de la consulta usando el valor obtenido de la barra de busqueda
        try {
            const queryResult = await getPostQuery(postQuery)
            res.status(400).render("index", { queryResult: queryResult, query: postQuery })
        } catch (error) {
            res.status(400).send("Ocurrio un error al mostrar las publicaciones")
        }
    }
}

//Filtrar las publicaciones que contenga la etiqueta recibida
async function getPostTag(tag) {

    const result = await Publicacion.findAll({

        where: {
            [Op.or]: [
                {
                    '$Etiqueta.nom_etiqueta$': {
                        [Op.iLike]: `%${tag}%`
                    }
                },
                {
                    '$Tags.nom_etiqueta$': {
                        [Op.eq]: tag
                    }
                }
            ]
        },

        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
            { model: Etiqueta, as: "Tags", required: true }
        ],
    })

    return result
}

//Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
async function getPostQuery(query) {
    //Esta consulta trae todas las publicaciones solo si el "query" coincide con el titulo de la publicacion,
    //nombre del usuario quien lo subio, o por el nombre de la etiqueta, o coincide con todo lo anterior
    const result = await Publicacion.findAll({

        where: {
            [Op.or]: [
                {
                    '$Publicacion.titulo$': {
                        [Op.iLike]: `%${query}%`
                    }
                },

                {
                    '$Publicacion.descripcion$': {
                        [Op.iLike]: `%${query}%`
                    }
                },

                {
                    '$Usuario.nombre_usuario$': {
                        [Op.iLike]: `%${query}%`
                    }
                },
                {
                    '$Etiqueta.nom_etiqueta$': {
                        [Op.like]: `%${query}%`
                    }
                },
            ]
        },
        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ],
    })
    return result
}
