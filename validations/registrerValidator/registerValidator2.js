import * as z from "zod"

//Patron para nombre de usuario(se permiten caracteres, numeros, guion bajo, puntos y que tenga entre 4 y 20 caracteres) 
const username_regex = /^[A-Za-z]([A-Za-z0-9_.]){4,20}$/
// variable con patron para la contraseña (debe tener minimamente minuscula, mayuscula, numeros y que tenga entre 7 y 30 caracteres, los caracteres especiales son opcionales)
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^\w\d\s]).{7,30}$/

//Objeto que valida cada input del formulario recibido
const Registro2 = z.object({
    //Nombre de usuario
    username: z.string().regex(username_regex, "Nombre de usuario -> Solo admite una letra como primer caracter, caracteres, numeros, puntos, guiones bajos y entre 4 y 20 caracteres"),

    //Contraseña
    password: z.string().regex(password_regex, "Contraseña -> Debe tener al menos una minuscula, mayuscula, un numero, un caracter especial y entre 7 y 30 caracteres")
})

export function validarFormRegistro2(registro2) {
  const resultado = Registro2.safeParse(registro2)
  if (resultado.success === false) {
    return {
      success: false,
      errors: z.flattenError(resultado.error).fieldErrors
    }
  }

  return { success: true }
}