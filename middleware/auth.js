//MIDDLEWARE PARA AUTENTICACION DE USUARIOS 
import { Usuario } from "../models/Usuario.js"
//FUNCION QUE RENDERIZA SOLO CONTENIDO PARA USUARIO AUTENTICADO, SI NO LO ESTÁ EL CONTENIDO SERA OTRO

export async function authUserHome(req, res, next){
    const userId = Number(req.session.userId)

    if(userId){
        try {   

            const usuario = await Usuario.findByPk(userId, {
                attributes: ["id_usuario", "nombre_usuario"],
            })

            req.user = usuario
    
            if(usuario){
                res.locals.userSession = {
                    id: usuario.id_usuario,
                    user_name: usuario.nombre_usuario
                }             
            }

        } catch (error) {
            console.log(`Ocurrio un error inesperado en Home --> ${error}`)
        }
    }
    next()
}