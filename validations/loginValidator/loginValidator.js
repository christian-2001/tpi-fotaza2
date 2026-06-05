import * as z from "zod"

const Login = z.object({
    //Mail
    mail: z.email()
})

export function validarFormLogin(login) {
    const resultado = Login.safeParse(login)
    if (resultado.success === false) {
        return {
            success: false,
            errors: z.flattenError(resultado.error).fieldErrors
        }
    }

    return { success: true }
}