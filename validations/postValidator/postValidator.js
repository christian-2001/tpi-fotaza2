import * as z from "zod"

const title_regex = /^[A-Z]([\w\W\d\D]){0,100}$/

const tags_regex = /^[A-Za-záéíóúÁÉÍÓÚ]([A-Za-záéíóúÁÉÍÓÚ\d_]){0,30}$/


const Post = z.object({
    title: z.string("Se requiere ingresar un titulo a la publicacion").regex(title_regex),

    description: z.string()
    .refine((val) => val.length <= 4000, { error: "Maxima cantidad de caracteres superada" }),

    tags: z.string().regex(tags_regex, "Etiqueta/as no valida/s")
})