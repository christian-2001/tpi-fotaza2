import { validarFormLogin } from "../../validations/loginValidator/loginValidator.js"
import { Usuario } from "../../models/Usuario.js"
import { Persona } from "../../models/Persona.js"

export function loginIndex(req, res) {
    res.render("./login/login")
}

export async function authLogin(req, res) {
    let { mail, contrasenia } = req.body

    mail = mail.trim()
    contrasenia = contrasenia.trim()

    try {
        const perfil = await Persona.findOne({
            where: {
                mail: mail
            }
        })

        const user = await Usuario.findOne(({
            where: {
                id_persona: perfil.id_persona
            }
        }))

        if (!user) {
            res.status(400).render("./login/login", {
                error: "Mail o contraseña incorrectos",
                formValues: req.body
            })
            return
        }

        const pass_valido = await user.validarContraseña(contrasenia)

        if (!pass_valido) {
            res.status(400).render("./login/login", {
                error: "Mail o contraseña incorrectos",
                formValues: req.body
            })
            return
        }

        req.session.userId = user.id_usuario

        if (user.rol === "validador") {
            return res.redirect("/validador")
        }

        return res.redirect("/")

    } catch (error) {
        console.log(`Error al loguearse --> ${error}`)

        res.status(500).render("./login/login", {
            error: "Ocurrio un error al iniciar sesion",
            formValues: req.body
        })
        return
    }


}

