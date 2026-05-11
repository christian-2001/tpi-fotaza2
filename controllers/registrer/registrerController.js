import { validarFormRegistro } from "../../validations/registrerValidator/registerValidator.js"

const options_dni = ["DNI", "Libreta Cívica(LC)", "Libreta de Enrolamiento (LE)", "Pasaporte", "Cédula de Identidad(CI)"]
const options_genre = ["Masculino", "Femenino", "No especificar"]

export function registroIndex(req, res) {
    res.render("./registrer/registrer", {
        options_dni: options_dni,
        options_genre: options_genre
    })
}

export function validarRegistro(req, res) {
    const {
        nombre,
        apellido,
        nombre_usuario,
        contrasenia,
        confirmar_contrasenia,
        fecha_nacimiento,
        genero,
        mail,
        tipodni,
        dni } = req.body


    const validate_result = validarFormRegistro({
        name: nombre,
        lastname: apellido,
        username: nombre_usuario,
        password_form: {
            password: contrasenia,
            confirm: confirmar_contrasenia
        },
        birthday: fecha_nacimiento,
        genre: genero,
        mail: mail,
        dni_type: tipodni,
        dni_number: dni
    })


    if (validate_result.success === false) {

        const arr_errores = []

        if (validate_result.errors.name) {
            arr_errores.push(validate_result.errors.name.toString())
        }
        if (validate_result.errors.lastname) {
            arr_errores.push(validate_result.errors.lastname.toString())
        }
        if (validate_result.errors.username) {
            arr_errores.push(validate_result.errors.username.toString())
        }
        if (validate_result.errors.password_form) {
            arr_errores.push(validate_result.errors.password_form.toString().substring(0, 117))
        }
        if (validate_result.errors.password_form) {
            arr_errores.push(validate_result.errors.password_form.toString().substring(118))
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

        res.status(400).render("./registrer/registrer", {
            options_dni: options_dni,
            options_genre: options_genre,
            error: arr_errores
        })
        return
    }

    res.status(200).render("./registrer/registrer", {
        options_dni: options_dni,
        options_genre: options_genre
    })
}