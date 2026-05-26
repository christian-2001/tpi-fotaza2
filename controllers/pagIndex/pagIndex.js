import { Usuario } from "../../models/Usuario.js"
import { Publicacion } from "../../models/Publicacion.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import {Op, Sequelize} from "sequelize"

export async function pagIndex(req, res){
    //Publicaciones con info del usuario()
    const posts = await Publicacion.findAll({ 
        include: [
            {
                model: Usuario,
                
            },
            {
                model: Etiqueta,
                
            },
            {
                model: Imagen,
                
            },
        ]
    })

    
    const img_posts = await Imagen.findAll({
        include: {
            model: Publicacion
        }
    })  

    res.render("index", {
        posts: posts 
        //img_posts: img_posts    
    })
}

export async function pagIndex2(req, res){
    console.log(req.query)
}
