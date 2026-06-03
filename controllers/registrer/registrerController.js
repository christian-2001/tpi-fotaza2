import { validarFormRegistro } from "../../validations/registrerValidator/registerValidator.js"
import { validarFormRegistro2 } from "../../validations/registrerValidator/registerValidator2.js"

const options_dni = ["DNI", "Libreta Cívica(LC)", "Libreta de Enrolamiento (LE)", "Pasaporte", "Cédula de Identidad(CI)"]
const options_genre = ["Masculino", "Femenino", "No especificar"]

//Renderiza el formulario para ingresar datos personales del cliente
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

//Validacion de los datos obtenidos del formulario que contiene los datos personales del cliente
export function validarRegistro(req, res) {
    //url que contiene el formulario
    let url = req.originalUrl

    //Guardamos todos los datos del formulario 
    const { nombre, apellido, fecha_nacimiento, genero, mail, tipodni, dni } = req.body

    //Validamos cada dato
    const validate_result = validarFormRegistro({
        name: nombre,
        lastname: apellido,
        birthday: fecha_nacimiento,
        genre: genero,
        mail: mail,
        dni_type: tipodni,
        dni_number: dni
    })

    //Se construye un mensaje con una cadena de errores por cada dato no valido
    if (validate_result.success === false) {

        const arr_errores = []

        if (validate_result.errors.name) {
            arr_errores.push(validate_result.errors.name.toString())
        }

        if (validate_result.errors.lastname) {
            arr_errores.push(validate_result.errors.lastname.toString())
        }

        if (validate_result.errors.birthday) {
            arr_errores.push(validate_result.errors.birthday.toString())
        }

        if (validate_result.errors.genre) {
            arr_errores.push(validate_result.errors.genre.toString())
        }

        if (validate_result.errors.mail) {
            arr_errores.push(validate_result.errors.mail.toString())
        }

        if (validate_result.errors.dni_type) {
            arr_errores.push(validate_result.errors.dni_type.toString())
        }

        if (validate_result.errors.dni_number) {
            arr_errores.push(validate_result.errors.dni_number.toString())
        }

        //Vuelve a renderizar el formulario con el mensaje construido mostrandose debajo del formulario
        //Se envia un codigo 400
        res.status(400).render("./registrer/registrer", {
            options_dni: options_dni,
            options_genre: options_genre,
            error: arr_errores,
            form_name: nombre,
            form_last_name: apellido,
            form_birthday: fecha_nacimiento,
            form_genre: genero,
            form_mail: mail,
            form_typedni: tipodni,
            form_dni: dni,
            current_url: url
        })
        return

    }

    //Si todos los datos son validos, se procede a la creacion del usuario
    res.redirect("/registrarse/crearUsuario")
}

//Renderiza el formulario para crear un usuario
export function usuarioFormulario(req, res) {
    const url = req.originalUrl
    res.render("./registrer/registrer2", { current_url: url })
}

//Validacion de los datos obtenido del formulario para la creacion del usuario
export function validarRegistroUsuario(req, res) {
    const url = req.originalUrl
    const { nombre_usuario, contrasenia } = req.body

    const validate_result = validarFormRegistro2({
        username: nombre_usuario,
        password: contrasenia
    })

    if (validate_result.success === false) {

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
            form_user_name: nombre_usuario        
        })
        return
    }

    res.status(200).send(`<h1 class="text-center"> SALIO BIEN </h1>`)
}
//.login_content(class="bg-gray-200 flex flex-col justify-center items-center mx-155 mt-20")
//.login_content(class="bg-gray-200 flex flex-col justify-center items-center mx-155 mt-65")

