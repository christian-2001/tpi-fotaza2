import * as z from "zod"

// Patrones para nombre y apellido
const name_regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{3,19}$/
const lastname_regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{3,19}$/

// Patrones por tipo de DNI
const dni_patterns = {
  "DNI": { regex: /^[0-9]{8}$/, error: "El DNI debe tener exactamente 8 dígitos numéricos" },
  "Libreta Cívica(CV)": { regex: /^[0-9]{6,7}$/, error: "La Libreta Cívica debe tener entre 6 y 7 dígitos numéricos" },
  "Libreta de Enrolamiento(LE)": { regex: /^[0-9]{6,7}$/, error: "La Libreta de Enrolamiento debe tener entre 6 y 7 dígitos numéricos" },
  "Pasaporte": { regex: /^[A-Z]{3}[0-9]{6}$/, error: "El Pasaporte debe tener el formato AAA000000 (3 letras mayúsculas + 6 dígitos)" },
  "Cédula de Identidad(CI)": { regex: /^[0-9]{7,8}$/, error: "La Cédula de Identidad debe tener entre 7 y 8 dígitos numéricos" },
}

const tipos_dni_validos = Object.keys(dni_patterns)

// Objeto que valida cada input del formulario recibido
const Registro = z.object({
  // Nombre
  name: z.string().regex(
    name_regex,
    "Nombre -> Solo admite una mayúscula como primer carácter, el resto en minúscula y entre 4 y 20 caracteres"
  ),

  // Apellido
  lastname: z.string().regex(
    lastname_regex,
    "Apellido -> Solo admite una mayúscula como primer carácter, el resto en minúscula y entre 4 y 20 caracteres"
  ),

  // Fecha de nacimiento
  birthday: z.iso.date("Fecha de Nacimiento -> Fecha vacía o inválida"),

  // Genero
  genre: z.enum(["Masculino", "Femenino", "No especificar"], {
    error: "Género -> No ha elegido el género"
  }),

  // Mail
  mail: z.email("Mail -> No válido o vacío"),

  // Tipo de DNI
  dni_type: z.enum(["DNI", "Libreta Cívica(CV)", "Libreta de Enrolamiento(LE)", "Pasaporte", "Cédula de Identidad(CI)"], {
    error: "Tipo DNI -> No ha elegido su tipo de DNI"
  }),

  // Numero de DNI (validacion base, la validacion cruzada con dni_type se hace abajo)
  dni_number: z.string().min(1, "Número de DNI -> No puede estar vacío"),

  // Validacion cruzada: dni_number segun dni_type
}).refine(
  ({ dni_type, dni_number }) => {
    const pattern = dni_patterns[dni_type]
    if (!pattern) return false
    return pattern.regex.test(dni_number)
  },
  ({ dni_type }) => ({
    message: dni_patterns[dni_type]?.error ?? "Número de DNI -> No válido",
    path: ["dni_number"],
  })
)

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