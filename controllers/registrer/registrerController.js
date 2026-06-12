import { validarFormRegistro } from "../../validations/registrerValidator/registerValidator.js"
import { validarFormRegistro2 } from "../../validations/registrerValidator/registerValidator2.js"
import { Persona } from "../../models/Persona.js"
import { Usuario } from "../../models/Usuario.js"

const options_dni = ["DNI", "Libreta Cívica(LC)", "Libreta de Enrolamiento(LE)", "Pasaporte", "Cédula de Identidad(CI)"]
const options_genre = ["Masculino", "Femenino", "No especificar"]

//Renderiza el formulario para ingresar datos personales del cliente y crear su perfil
export function registroIndex(req, res) {
    //url que contiene el formulario
    const url = req.originalUrl

    //renderiza el formulario que contiene campos para ingresar datos personales del cliente
    res.render("./registrer/registrer", {
        options_dni: options_dni,
        options_genre: options_genre,
        current_url: url
    })
}

//Validacion de los datos obtenidos del formulario de creacion del perfil
export async function validarRegistroPerfil(req, res) {
    const url = req.originalUrl

    const { form_nombre, form_apellido, form_fecha_nacimiento, form_genero, form_mail, form_tipodni, form_dni } = req.body

    //Datos comunes para re-renderizar el formulario en caso de error
    const form_data = {
        options_dni: options_dni,
        options_genre: options_genre,
        form_name: form_nombre,
        form_last_name: form_apellido,
        form_birthday: form_fecha_nacimiento,
        form_genre: form_genero,
        form_mail: form_mail,
        form_typedni: form_tipodni,
        form_dni: form_dni,
        current_url: url
    }

    //Validación con Zod
    /*const validate_result = validarFormRegistro({
        name: form_nombre?.trim(),
        lastname: form_apellido?.trim(),
        birthday: form_fecha_nacimiento?.trim(),
        genre: form_genero,
        mail: form_mail?.trim(),
        dni_type: form_tipodni,
        dni_number: form_dni?.trim()
    })*/

    /*if (validate_result.success === false) {
        //flattenError ya devuelve arrays por campo, los juntamos en uno solo
        const arr_errores = Object.values(validate_result.errors).flat()

        console.log(form_data)

        return res.status(400).render("./registrer/registrer", {
            ...form_data,
            error: arr_errores
        })
    }*/

    //Verificar DNI duplicado en BD
    try {
        /*
        const persona_existente = await Persona.findOne({
            where: { dni: form_dni.trim() }
        })
*/

        /*
        if (persona_existente) {
            return res.status(400).render("./registrer/registrer", {
                ...form_data,
                error: [`Ya existe una persona registrada con el DNI ${form_dni}`]
            })
        }
*/
        //Crear persona
        const profile = await Persona.create({
            dni: form_dni.trim(),
            tipo_dni: form_tipodni,
            sexo: form_genero,
            nombre: form_nombre.trim(),
            apellido: form_apellido.trim(),
            fecha_nacimiento: form_fecha_nacimiento.trim(),
            mail: form_mail.trim()
        })

        req.session.idPersonaCreada = profile.id_persona

        return res.status(200).render("./registrer/profileConfirm", {
            msg: `Perfil de ${profile.nombre} creado/a y guardado/a exitosamente`
        })

    } catch (error) {
        console.error("Error al registrar persona:", error)
        return res.status(500).render("./registrer/registrer", {
            ...form_data,
            error: ["Ocurrió un error interno al guardar el perfil. Intentá de nuevo más tarde."]
        })
    }
}

//==========================================================================CREACION DE USUARIOS===============================================================================================

//Renderiza el formulario para crear un usuario
export function usuarioFormulario(req, res) {
    const url = req.originalUrl
    res.render("./registrer/registrer2", { current_url: url })
}

//Validacion de los datos obtenido del formulario para la creacion del usuario
export async function validarRegistroUsuario(req, res) {
    const url = req.originalUrl
    let { form_nombre_usuario, form_contrasenia } = req.body

    form_nombre_usuario = form_nombre_usuario.trim()
    form_contrasenia = form_contrasenia.trim()
/*
    const validate_result = validarFormRegistro2({
        username: form_nombre_usuario,
        password: form_contrasenia
    })
*/
    //Creacion del mensaje con cadena de errores por cada dato no válido
    /*if (validate_result.success === false) {

        const arr_errores = []

        if (validate_result.errors.username) {
            arr_errores.push(validate_result.errors.username.toString())
        }
        if (validate_result.errors.password) {
            arr_errores.push(validate_result.errors.password.toString())
        }

        res.status(400).render("./registrer/registrer2", {
            error: arr_errores,
            current_url: url,
            titulo: "Registrarse",
            form_user_name: form_nombre_usuario,
        })
        return
    }*/

    //Creacion del usuario
    try {
        const user = await Usuario.create({
            nombre_usuario: form_nombre_usuario,
            contrasenia: form_contrasenia,
            id_persona: req.session.idPersonaCreada
        })

        res.status(200).render(`./registrer/userConfirm`, { msg: `El/la usuario/a ${user.nombre_usuario} ha sido creado/a exitosamente!!` })
        delete req.session.idPersonaCreada
    } catch (error) {
        res.send(`Ocurrio un error al crear el usuario/cuenta de la persona -> ${error}`)
    }
}