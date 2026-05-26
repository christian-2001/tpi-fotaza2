import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op } from "sequelize"

export async function buscarPost(req, res) {

    let postQuery = (req.query.buscador) ? req.query.buscador : ""
    let postTag = (req.query.etiqueta) ? req.query.etiqueta : ""
    let queryResult = ""

    //Comprobamos si lo que vino desde el frontend es via barra de busqueda o el valor obtenido al clickear una etiqueta

    //Si el usuario no ha ingresado nada, la pagina lo redirige al "home"
    if (postQuery == "") {

        res.redirect("/")
    
        //Si el valor recibido, desde la barra de busqueda empieza con almohadilla o hash(#), 
        // o proviene del click a una etiqueta recibiendo su nombre
    } else if ((postQuery && postQuery.startsWith("#")) || postTag) {

        //Si la etiqueta proviene de la barra de busqueda
        if (!postTag) {
            postQuery = postQuery.split("#")[1]
            //Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
            getPostTag(postQuery)
                .then((data) => {
                    console.log(data)
                    queryResult = data
                    res.status(200).render("index", { queryResult: queryResult, query: `#${postQuery}` })
                })
                .catch((error) => res.status(200).send("Ocurrio un error al mostrar las publicaciones"))
        } else {
            //Si la etiqueta se obtuvo al hacerle click recibiendo su nombre
            //Filtrar las publicaciones que contenga la etiqueta recibida
            getPostTag(postTag)
                .then((data) => {
                    queryResult = data
                    res.status(200).render("index", { queryResult: queryResult, query: `#${postTag}` })
                })
                .catch((error) => res.status(200).send("Ocurrio un error al mostrar las publicaciones"))
        }

        //Si el valor recibido proviene de la barra de busqueda y no empieza con almohadilla o hash(#)
    } else if (postQuery) {

        //Funcion que obtiene el resultado de la consulta usando el valor obtenido de la barra de busqueda
        getPostQuery(postQuery)
            .then((data) => {
                queryResult = data
                res.status(200).render("index", { queryResult: queryResult, query: postQuery })
            })

    }
}

//Filtrar las publicaciones que contenga la etiqueta recibida
async function getPostTag(tag) {

    const queryResult = await Publicacion.findAll({
        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen },
            { model: Etiqueta, as: "Tags", where: { nom_etiqueta: tag }, required: true }
        ],
    })

    return queryResult
}

//Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
async function getPostQuery(query) {
    //Esta consulta trae todas las publicaciones solo si el "query" coincide con el titulo de la publicacion,
    //nombre del usuario quien lo subio, o por el nombre de la etiqueta, o coincide con todo lo anterior
    const queryResult = await Publicacion.findAll({

        where: {
            [Op.or]: [
                {
                    '$Publicacion.titulo$': {
                        [Op.like]: `%${query}%`
                    }
                },

                {
                    '$Publicacion.descripcion$': {
                        [Op.like]: `%${query}%`
                    }
                },

                {
                    '$Usuario.nombre_usuario$': {
                        [Op.like]: `%${query}%`
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
    return queryResult
}
