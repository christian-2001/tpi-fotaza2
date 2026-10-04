//MIDDLEWARE PARA AUTENTICACION DE USUARIOS 
import { Usuario } from "../models/Usuario.js"
//FUNCION QUE RENDERIZA SOLO CONTENIDO PARA USUARIO AUTENTICADO, SI NO LO ESTÁ EL CONTENIDO SERA OTRO

export async function authUserHome(req, res, next){
    const userId = Number(req.session.userId)

    if(userId){
        try {   

            const usuario = await Usuario.findByPk(userId, {
                attributes: ["id_usuario", "nombre_usuario", "rol"],
            })

            req.user = usuario
    
            if(usuario){
                res.locals.userSession = {
                    id: usuario.id_usuario,
                    user_name: usuario.nombre_usuario,
                    rol: usuario.rol
                }             
            }

        } catch (error) {
            console.log(`Ocurrio un error inesperado en Home --> ${error}`)
        }
    }
    next()
}

export function esValidador(req, res, next) {
    console.log(req.user)
    if (req.user && req.user.rol === "validador") {
        return next()
    }
    return res.status(403).render("error", { mensaje: "Acceso denegado" })
}

export async function cerrarSesion(req, res){
    if(req.session){
        await req.session.destroy()
        res.clearCookie("connect.sid")
        res.redirect("/login")
        return
    }
}