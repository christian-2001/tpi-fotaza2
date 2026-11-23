import { Op, Sequelize } from "sequelize"
import { Notificacion } from "../models/Notificacion.js"

export async function marcarNotificacionLeida(req, res){
    const _idNotificacion = parseInt(req.params.id_notificacion)
    console.log(_idNotificacion)

    try{
    
        const result = await Notificacion.update(
            { notificacion_leida: true },
            {
                where: {
                    id_notificacion: _idNotificacion
                }
            }
        )

        if(!result) return res.status(404).json({ msj: "No existe la notificacion"})

        res.status(204).json({ msj: "Notificacion marcada como LEIDA" })

    } catch (error) {
        res.status(400).send(`Error al marcar la notificacion como leida ${error}`)
    }
}