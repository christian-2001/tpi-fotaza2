import * as z from "zod"

//Patrones para nombre y apellido(solo caracteres, si o si el primer caracter con mayuscula y un rango entre 4 y 20 caracteres, no se permiten numeros y tampoco espacios entre caracteres o al final de la palabra)
const name_regex = /^[A-Z]([a-z]){4,20}$/
const lastname_regex = /^[A-Z]([a-z]){4,20}$/

//Patron para nombre de usuario(se permiten caracteres, numeros, guion bajo, puntos y que tenga entre 4 y 20 caracteres) 
const username_regex = /^[A-Za-z]([A-Za-z0-9_.]){4,20}$/

// variable con patron para la contraseña (debe tener minimamente minuscula, mayuscula, numeros y que tenga entre 7 y 30 caracteres, los caracteres especiales son opcionales)
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w\d\s]).{7,30}$/

//Variable con patron para el numero de DNI (Solo admite numeros y debe tener exactamente 8 digitos)
const dni_regex = /([0-9]){8}/


//Objeto que valida cada input del formulario recibido
const Registro = z.object({
  //Nombre
  name: z.string().regex(name_regex, "Nombre -> Solo admite una mayuscula como primer caracter, el resto del nombre unicamente en minuscula y entre 4 y 20 caracteres"),

  //Apellido
  lastname: z.string().regex(lastname_regex, "Apellido -> Solo admite una mayuscula como primer caracter, el resto del apellido unicamente en minuscula y entre 4 y 20 caracteres"),

  //Nombre de usuario
  username: z.string().regex(username_regex, "Nombre de usuario -> Solo admite una letra como primer caracter, caracteres, numeros, puntos, guiones bajos y entre 4 y 20 caracteres"),

  //Contraseña y otra validacion para confirmar contraseña
  password_form: z.object({
    password: z.string()
      .regex(password_regex, "Contraseña -> Debe tener al menos una minuscula, mayuscula, un numero, un caracter especial y entre 7 y 30 caracteres"),
    confirm: z.string()
  }).refine((p) => p.password === p.confirm, { error: "Confirmar contraseña -> Ambas contraseñas no coinciden" }),

  //Fecha de nacimiento
  birthday: z.iso.date("Fecha de Nacimiento -> Fecha vacia"),

  //Genero
  genre: z.refine((val_genre) => val_genre !== undefined, { error: "Genero -> No ha elegido el genero" }),

  //Mail
  mail: z.email("Mail -> No valido o vacio"),

  //Tipo de DNI
  dni_type: z.refine((val_tipo) => val_tipo !== undefined, { error: "Tipo DNI -> No ha elegido su tipo de DNI" }),

  //Numero de DNI
  dni_number: z.string()
    .refine((dni_val) => dni_regex.test(parseInt(dni_val)) && dni_val.length === 8, { error: "Numero de DNI -> No valido" })
})

export function validarFormRegistro(registro) {
  const resultado = Registro.safeParse(registro)
  if (resultado.success === false) {
    return {
      success: false,
      errors: z.flattenError(resultado.error).fieldErrors
    }
  }

  return { success: true }
}