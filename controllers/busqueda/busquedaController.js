import { Publicacion } from "../../models/Publicacion.js"
import { Usuario } from "../../models/Usuario.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"

export async function buscarPost(req, res) {
    //Variable que contendrá la etiqueta
    let postTag

    //Comprobamos si la etiqueta ingresada viene de la barra de busqueda o al hacer click en ella en una publicacion
    if(req.query.buscador){
        postTag = req.query.buscador.split("#")[1]
    } else {
        postTag = req.query.etiqueta
    }
    const postsQuery = await Publicacion.findAll({
        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen },
            { model: Etiqueta, as: "Tags", where: { nom_etiqueta: postTag }, required: true}
        ],
    })
        
    res.status(200).render("index", { queryTags: postsQuery, postTag: postTag })
    
}