
import { Seguidores } from "../../models/Seguidores.js"

export async function registrarFollow(req, res) {
    const id_usuarioSession = req.user.id_usuario
    const id_usuario = req.params.idUsuarioSeguido
    const sección = req.params.sección

    try {

        const nuevoSeguidor = await Seguidores.create({
            id_seguidor: id_usuarioSession,
            id_seguido: id_usuario
        })

        res.redirect(req.headers.referer || "/")
    } catch (error) {
        res.status(400).send(`Error al guardar seguidor ${error}`)
    }
}

export async function eliminarFollow(req, res) {
    const id_usuarioSession = req.user.id_usuario
    const id_usuario = req.params.idUsuarioSeguido
    const sección = req.params.sección

    try {
        const quitarSeguidor = await Seguidores.destroy({
            where: {
                id_seguidor: id_usuarioSession,
                id_seguido: id_usuario
            }
        })

        res.redirect(req.headers.referer || "/")
    } catch (error) {
        res.status(400).send(`Error al eliminar seguidor ${error}`)
    }
}