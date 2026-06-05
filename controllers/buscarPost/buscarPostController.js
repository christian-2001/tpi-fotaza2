import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Op } from "sequelize"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"

export async function buscarPost(req, res) {

    let postTag = (req.query.etiqueta) ? req.query.etiqueta : ""
    let imgTag = (req.query.img_etiqueta) ? req.query.img_etiqueta : ""
    let postQuery = (req.query.buscador) ? req.query.buscador.trim() : ""

    //Comprobamos si lo que vino desde el frontend es via barra de busqueda o el valor obtenido al clickear una etiqueta

    //Obtener publicaciones que coincidan con una etiqueta de imagen haciendo click en ella
    if (imgTag) {
        console.log(imgTag)
        try {
            //Filtrar las publicaciones que contenga la etiqueta recibida
            const queryResult = await getImgTag(imgTag)
            res.status(400).render("index", { queryResult: queryResult, query: `#${imgTag}` })
        } catch (error) {
            res.status(400).send(`Ocurrio un error al mostrar las publicaciones ${error}`)
        }
    } 
    //Obtener publicaciones que coincidan con una etiqueta dentro de una publicacion haciendo click en ella
    else if (postTag) {

        //Filtrar las publicaciones que coincidan con la etiqueta recibida
        try {
            const queryResult = await getPostTag(postTag)
            res.status(400).render("index", { queryResult: queryResult, query: `#${postTag}` })
        } catch (error) {
            res.status(400).send(`Ocurrio un error al mostrar las publicaciones ${error}`)
        }

        //Si el valor recibido desde la barra de busqueda es vacio o no tiene nada,
        //sera redirigido a home
    } else if (postQuery == "") {

        res.redirect("/")
        
        /*
            Obtiene publicaciones mediante la barra de busqueda 
            El resultado se obtiene mediante matches o coincidencias con:
            Publicacion -> titulo, descripcion, nombre del usuario quien lo subio, etiquetas dentro de la publicacion
            Imagenes: Etiquetas dentro de una imagen de una publicacion
        */
        //con almohadilla o hash(#),
    } else if ((postQuery && postQuery.startsWith("#"))) {

        //Si la etiqueta proviene de la barra de busqueda
        postQuery = postQuery.split("#")[1]

        //Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
        try {
            const queryResult = await getPostQuery(postQuery)
            res.status(400).render("index", { queryResult: queryResult, query: `#${postQuery}` })
        } catch (error) {
            res.status(400).send(`Ocurrio un error al mostrar las publicaciones ${error}`)
        }

        //Sin almohadilla o hash(#)
    } else if (postQuery) {

        //Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
        try {
            const queryResult = await getPostQuery(postQuery)
            res.status(400).render("index", { queryResult: queryResult, query: postQuery })
        } catch (error) {
            res.status(400).send(`Ocurrio un error al mostrar las publicaciones ${error}`)
        }
    }
}

//Obtener publicaciones que coincidan con la etiqueta de una publicacion recibida
async function getPostTag(tag) {

    let result = await Publicacion.findAll({

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

//Obtener publicaciones que coincidan con la etiqueta de imagen recibida
async function getImgTag(img_tag) {

    //Trae etiqueta que contenga la etiqueta de imagen
    const tagsQuery = await Etiqueta.findAll({
        where: {
            '$Etiqueta.nom_etiqueta$': {
                [Op.eq]: img_tag
            }
        },

        include: [
            { model: Imagen_Etiqueta }
        ]
    })

    //Extrae ids de imagenes de la query resultante
    const imageIds = tagsQuery[0].Imagen_Etiqueta.map(img => img.id_img)

    //Trae imagenes, junto con las publicaciones contenidas, que tengan los ids obtenidos
    const imagesQuery = await Imagen.findAll({

        where: {
            id_img: {
                [Op.in]: imageIds
            }
        },

        include: [
            { model: Publicacion }
        ]
    })

    //Extrae ids de publicaciones de la query anterior
    const postIds = imagesQuery.map(post => post.Publicacion.id_post)

    //Obtiene las publicaciones mediante los ids de publicaciones extraidos anteriormente
    const result = await Publicacion.findAll({

        where: {
            id_post: {
                [Op.in]: postIds
            }
        },

        include: [
            { model: Usuario, required: true },
            { model: Etiqueta, required: true },
            { model: Imagen, required: true },
        ],
    })

    return result
}


//Filtrar las publicaciones que coincidan con el valor obtenido en la barra de busqueda
async function getPostQuery(query) {
    //Obtiene todas las publicaciones solo si el "query" coincide con el titulo de la publicacion, su descripcion,
    //nombre del usuario quien lo subio, etiqueta de una publicacion, o etiqueta de una imagen
    console.log(query)

    //Trae etiquetas segun el valor del parametro
    const tagsQuery = await Etiqueta.findAll({
        where: {
            [Op.or]: [
                {
                    '$Etiqueta.nom_etiqueta$': {
                        [Op.iLike]: `%${query}%`
                    }
                },
                {
                    '$Etiqueta.nom_etiqueta$': {
                        [Op.startsWith]: `%${query}%`
                    }     
                }
            ]
        },

        include: [
            { model: Imagen_Etiqueta }
        ]
    })
   
    //Extrae ids de imagenes de la query resultante
    let imageIds = tagsQuery.map(img => {
        return img.Imagen_Etiqueta.map(img2 => img2.id_img)
    })

    //Guarda en otro array, el array original de los ids de imagenes pero mejorado
    let arr_imageIds = []

    imageIds.map(i => { 
        arr_imageIds.push(...i)    
    })

    //Trae las imagenes junto con las publicaciones contenidas mediante el array de ids de imagenes
    const imagesQuery = await Imagen.findAll({

        where: {
            id_img: {
                [Op.in]: arr_imageIds
            }
        },

        include: [
            { model: Publicacion }
        ]
    })

    //Extrae los ids de publicaciones de la query anterior
    const postIds = imagesQuery.map(post => post.Publicacion.id_post)

    //Obtiene las publicaciones mediante los ids de publicaciones extraidos anteriormente
    let result = await Publicacion.findAll({

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
                {
                    id_post: {
                        [Op.in]: postIds
                    }
                }
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