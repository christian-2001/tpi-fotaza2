import { Publicacion } from "../models/Publicacion.js"
import { Usuario } from "../models/Usuario.js"
import { Etiqueta } from "../models/Etiqueta.js"
import { Imagen } from "../models/Imagen.js"
import { Publicacion_Etiqueta } from "../models/Publicacion_Etiqueta.js"
import { Op, Sequelize } from "sequelize"
import { Imagen_Etiqueta } from "../models/Imagen_Etiqueta.js"
import { Comentario } from "../models/Comentario.js"
import { Valorizacion } from "../models/Valorizacion.js"
import { Interes } from "../models/Interes.js"
import { getImagenUrl } from "../utils/cloudinaryHelper.js"
import { Motivo } from "../models/Motivo.js"
import { DenunciaComentario } from "../models/DenunciaComentario.js"

export async function marcarInteres(req, res){
    const _idImg  = parseInt(req.params.id_img)
    const _idUsuario = req.user.id_usuario
    let msj_confirmacion = ""

    try{ 

        const interesHallado = await Interes.findOne({
            where: {
                [Op.and]: [
                    { '$Imagen.id_img$': _idImg },
                    { '$Usuario.id_usuario$': _idUsuario }
                ]
            },

            include: [
                { model: Imagen, required: true, attributes: ["id_img"] },
                { model: Usuario, required: true, attributes: ["id_usuario"] }
            ]
        })

        if(!interesHallado){

            await Interes.create({
                id_img: _idImg,
                id_interesado: _idUsuario
            })

            msj_confirmacion = "Marcaste tu interes en la imagen, se lo notificaremos al autor" 
        
        } else {
            if(interesHallado.estado === "inactivo"){

                interesHallado.estado = "activo"
                await interesHallado.save()

                msj_confirmacion = "Marcaste tu interes en la imagen, se lo notificaremos al autor" 

            } else if (interesHallado.estado === "activo"){
                
                interesHallado.estado = "inactivo"
                await interesHallado.save()

                msj_confirmacion = "Retiraste tu interes en la imagen" 

            }
        }

        res.status(200).json({ msj_confirmacion })
    } catch (error) {
        res.status(400).send(`Error al marcar interes en la imagen ${error}`)
    }
    
}