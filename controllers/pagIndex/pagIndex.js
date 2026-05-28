import { Usuario } from "../../models/Usuario.js"
import { Publicacion } from "../../models/Publicacion.js"
import { Publicacion_Etiqueta } from "../../models/Publicacion_Etiqueta.js"
import { Imagen } from "../../models/Imagen.js"
import { Imagen_Etiqueta } from "../../models/Imagen_Etiqueta.js"
import { Etiqueta } from "../../models/Etiqueta.js"
import { Op, Sequelize } from "sequelize"

export async function pagIndex(req, res) {
    //Publicaciones con :
    //Titulo
    //Descripcion
    //Nombre del usuario
    //Fecha y hora de publicacion
    //Etiquetas
    //Imagenes
    const posts = await Publicacion.findAll({
        include: [
            { model: Usuario },
            { model: Etiqueta },
            { model: Imagen, required: true },
        ]
    })
/*
    const img_posts = await Imagen_Etiqueta.findAll({
        include: [
            { model: Imagen },
            { model: Etiqueta },
        ]
    })

    console.log(img_posts[0].Etiquetum)
*/
    res.render("index", { posts: posts })
    

//res.render("index", { posts: posts, img_posts: img_posts })

    /*
        .post_imagenes(class="grid grid-cols-2 gap-3 bg-blue-500 mt-2")
                        each post_img in val.Imagens
                            img(src=`${post_img.img_path}`, alt="")
    */ 

    /*
        const prueba = posts[0].Imagens[0]
        const base64 = prueba.img_path.toString("base64")
    
        const dataUrl = `data:image/${prueba.extension};base64,${base64}`
        console.log(dataUrl)
    */

    /*
    const img_posts = await Imagen.findAll({
        include:
        { model: Publicacion }
    })
    */

    //let prueba = posts[0].Imagens[0].img_path

    //const img_src = `data:image/jpg;base64,${base64}`

    //res.send(`<img src="${prueba}" width=100></img>`)
    /*
    const base64 = imagen.img_buffer.toString("base64");
    
    const dataUrl = `data:image/jpg;base64,${base64}`;
    */
}