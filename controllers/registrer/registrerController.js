import { validarFormRegistro } from "../../validations/registrerValidator/registerValidator.js"
import { validarFormRegistro2 } from "../../validations/registrerValidator/registerValidator2.js"
import { Persona } from "../../models/Persona.js"
import { Usuario } from "../../models/Usuario.js"

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
export async function validarRegistroPerfil(req, res) {
    //url que contiene el formulario
    let url = req.originalUrl

    //Guardamos todos los datos del formulario 
    const { form_nombre, form_apellido, form_fecha_nacimiento, form_genero, form_mail, form_tipodni, form_dni } = req.body

    //Validamos cada dato
    const validate_result = validarFormRegistro({
        name: form_nombre,
        lastname: form_apellido,
        birthday: form_fecha_nacimiento,
        genre: form_genero,
        mail: form_mail,
        dni_type: form_tipodni,
        dni_number: form_dni
    })

    const arr_errores = []

    //Se construye un mensaje con una cadena de errores por cada dato no valido
    if (validate_result.success === false) {

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
            form_name: form_nombre,
            form_last_name: form_apellido,
            form_birthday: form_fecha_nacimiento,
            form_genre: form_genero,
            form_mail: form_mail,
            form_typedni: form_tipodni,
            form_dni: form_dni,
            current_url: url
        })
        return

    }

    //Comprobamos si ya existe una persona con el mismo dni
    const query_dni = await Persona.findOne({ 
        where: { 
            '$Persona.dni$': form_dni 
        } 
    })
 
    if(query_dni){
        if(form_dni === query_dni.dni){
        
            arr_errores.push({person_msg: `Ya existe la persona con el dni ${form_dni}`})
            
            res.status(400).render("./registrer/registrer", {
                options_dni: options_dni,
                options_genre: options_genre,
                error: arr_errores,
                form_name: form_nombre,
                form_last_name: form_apellido,
                form_birthday: form_fecha_nacimiento,
                form_genre: form_genero,
                form_mail: form_mail,
                form_typedni: form_tipodni,
                form_dni: form_dni,
                current_url: url
            })
    
            return
        }
    }

    try {
        const profile = await Persona.create({
            dni: form_dni,
            tipo_dni: form_tipodni,
            sexo: form_genero,
            nombre: form_nombre,
            apellido: form_apellido,
            fecha_nacimiento: form_fecha_nacimiento,
            mail: form_mail
        })
        res.status(200).render("./registrer/profileConfirm", { msg: `Perfil de ${profile.nombre} creado/a y guardado/a exitosamente`})
    } catch (error) {
        res.send(`Ocurrio un error al crear la persona -> ${error}`)
    }
    //Si todos los datos son validos, se muestra un mensaje confirmando la creacion de los datos de la persona
    
    //res.redirect("/registrarse/crearUsuario")
}

//Renderiza el formulario para crear un usuario
export function usuarioFormulario(req, res) {
    const url = req.originalUrl
    res.render("./registrer/registrer2", { current_url: url })
}

//Validacion de los datos obtenido del formulario para la creacion del usuario
export function validarRegistroUsuario(req, res) {
    const url = req.originalUrl
    const { form_nombre_usuario, form_contrasenia, form_mail } = req.body

    console.log(req.body)


    const validate_result = validarFormRegistro2({
        username: form_nombre_usuario,
        password: form_contrasenia,
        mail: form_mail
    })

    if (validate_result.success === false) {

        const arr_errores = []

        if (validate_result.errors.username) {
            arr_errores.push(validate_result.errors.username.toString())
        }
        if (validate_result.errors.password) {
            arr_errores.push(validate_result.errors.password.toString())
        }
        if (validate_result.errors.mail) {
            arr_errores.push(validate_result.errors.mail.toString())
        }

        res.status(400).render("./registrer/registrer2", {
            error: arr_errores,
            current_url: url,
            titulo: "Registrarse",
            form_user_name: form_nombre_usuario,
            form_user_mail: form_mail
        })
        return
    }

    //LOGICA PARA CREAR EL USUARIO
    res.status(200).send(`<h1 class="text-center"> SALIO BIEN </h1>`)
}

export function personaMsg(req, res){
    res.render("./registrer/profileConfirm")
}