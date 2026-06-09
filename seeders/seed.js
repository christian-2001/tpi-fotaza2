import sequelize from "../db/config.js";
import bcrypt from "bcrypt"
import { Etiqueta } from "../models/Etiqueta.js";
import { Imagen_Etiqueta } from "../models/Imagen_Etiqueta.js";
import { Imagen } from "../models/Imagen.js";
import { Persona } from "../models/Persona.js";
import { Publicacion_Etiqueta } from "../models/Publicacion_Etiqueta.js";
import { Publicacion } from "../models/Publicacion.js";
import { Usuario } from "../models/Usuario.js";
import { Valorizacion } from "../models/Valorizacion.js";
import { Comentario } from "../models/Comentario.js";
import { Seguidores } from "../models/Seguidores.js";

async function seed() {
    await sequelize.sync({ alter: true, force: true});

    // ─────────────────────────────────────────────
    // PERSONA  (8 personas)
    // ─────────────────────────────────────────────
    const personas = await Persona.bulkCreate([
        // personas[0]
        { dni: "43423744", tipo_dni: "DNI", sexo: "Masculino", nombre: "Chris", apellido: "Villegas", fecha_nacimiento: "2001-01-14", mail: "villegas4000@gmail.com" },
        // personas[1]
        { dni: "12345678", tipo_dni: "DNI", sexo: "Masculino", nombre: "Nicky", apellido: "Bastidas", fecha_nacimiento: "2001-12-20", mail: "flojito123@gmail.com" },
        // personas[2]
        { dni: "87654321", tipo_dni: "DNI", sexo: "Masculino", nombre: "Tomi", apellido: "Villegas", fecha_nacimiento: "2002-08-10", mail: "marisaosu@gmail.com" },
        // personas[3]
        { dni: "11223344", tipo_dni: "DNI", sexo: "Femenino", nombre: "Valentina", apellido: "Sosa", fecha_nacimiento: "2000-03-25", mail: "valentinasosa@gmail.com" },
        // personas[4]
        { dni: "55667788", tipo_dni: "DNI", sexo: "Femenino", nombre: "Luciana", apellido: "Moreno", fecha_nacimiento: "1999-07-08", mail: "lucimoreno@gmail.com" },
        // personas[5]
        { dni: "99887766", tipo_dni: "DNI", sexo: "Masculino", nombre: "Mateo", apellido: "Ríos", fecha_nacimiento: "2003-11-30", mail: "mateoriosphotos@gmail.com" },
        // personas[6]
        { dni: "33221100", tipo_dni: "DNI", sexo: "Femenino", nombre: "Camila", apellido: "Ferreira", fecha_nacimiento: "1998-05-17", mail: "camilaferreira@gmail.com" },
        // personas[7]
        { dni: "44556677", tipo_dni: "DNI", sexo: "Masculino", nombre: "Joaquín", apellido: "Mendoza", fecha_nacimiento: "2004-02-03", mail: "joaquinmendoza@gmail.com" },
    ]);

    // ─────────────────────────────────────────────
    // USUARIO  (8 usuarios)
    // ─────────────────────────────────────────────

    const usuariosData = [
        // users[0]  → Chris
        { nombre_usuario: 'chrisgreen', id_persona: personas[0].id_persona, contrasenia: 'chris@123' },
        // users[1]  → Nicky
        { nombre_usuario: 'flojocosmico', id_persona: personas[1].id_persona, contrasenia: 'flojo@123' },
        // users[2]  → Tomi
        { nombre_usuario: "nozye500", id_persona: personas[2].id_persona, contrasenia: "tomi@222" },
        // users[3]  → Valentina
        { nombre_usuario: "vale.snap", id_persona: personas[3].id_persona, contrasenia: "vale@999"},
        // users[4]  → Luciana
        { nombre_usuario: "luci_frames", id_persona: personas[4].id_persona, contrasenia: "luciframes@111" },
        // users[5]  → Mateo
        { nombre_usuario: "mateo.lens", id_persona: personas[5].id_persona, contrasenia: "mateolens@250" },
        // users[6]  → Camila
        { nombre_usuario: "cami_vis", id_persona: personas[6].id_persona, contrasenia: "camivis@687" },
        // users[7]  → Joaquín
        { nombre_usuario: "joaco_raw", id_persona: personas[7].id_persona, contrasenia: "joacoraw@333" },
    ];

    //Generar hash para cada contraseña
    const usuariosHasheados = await Promise.all(
        usuariosData.map(async (u) => ({
            ...u,
            contrasenia: await bcrypt.hash(u.contrasenia, 10),
        }))
    );

    //Generar datos de prueba de "Usuario" con contraseñas hasheadas
    const users = await Usuario.bulkCreate(usuariosHasheados);

    // ─────────────────────────────────────────────
    // ETIQUETA  (18 tags)
    // ─────────────────────────────────────────────
    const tags = await Etiqueta.bulkCreate([
        // tags[0]
        { nom_etiqueta: "postGreen" },
        // tags[1]
        { nom_etiqueta: "aguantefotaza" },
        // tags[2]
        { nom_etiqueta: "imgGreen" },
        // tags[3]
        { nom_etiqueta: "postFlojo" },
        // tags[4]
        { nom_etiqueta: "imgFlojo" },
        // tags[5]
        { nom_etiqueta: "postNozye" },
        // tags[6]
        { nom_etiqueta: "imgNozye" },
        // tags[7]
        { nom_etiqueta: "naturaleza" },
        // tags[8]
        { nom_etiqueta: "urbano" },
        // tags[9]
        { nom_etiqueta: "retrato" },
        // tags[10]
        { nom_etiqueta: "paisaje" },
        // tags[11]
        { nom_etiqueta: "minimalismo" },
        // tags[12]
        { nom_etiqueta: "arquitectura" },
        // tags[13]
        { nom_etiqueta: "postVale" },
        // tags[14]
        { nom_etiqueta: "imgVale" },
        // tags[15]
        { nom_etiqueta: "postLuci" },
        // tags[16]
        { nom_etiqueta: "postMateo" },
        // tags[17]
        { nom_etiqueta: "blanco_y_negro" },
    ]);

    // ─────────────────────────────────────────────
    // PUBLICACION  (12 posts)
    // ─────────────────────────────────────────────
    const posts = await Publicacion.bulkCreate([
        // posts[0]  → chrisgreen
        { titulo: "Atardecer en la costa", descripcion: "Un atardecer que no se puede describir con palabras.", id_usuario: users[0].id_usuario },
        // posts[1]  → chrisgreen
        { titulo: "Café de la mañana", descripcion: "Nada mejor que empezar el día con un buen café.", id_usuario: users[0].id_usuario },
        // posts[2]  → flojocosmico
        { titulo: "Ciudad entre niebla", descripcion: "La ciudad nunca duerme, pero a veces se esconde.", id_usuario: users[1].id_usuario },
        // posts[3]  → flojocosmico
        { titulo: "Reflejos en el charco", descripcion: "La lluvia convierte las calles en espejos.", id_usuario: users[1].id_usuario },
        // posts[4]  → nozye500
        { titulo: "Montañas al amanecer", descripcion: "Hermosa mañana verdad?", id_usuario: users[2].id_usuario },
        // posts[5]  → nozye500
        { titulo: "Bosque encantado", descripcion: "Me perdí entre los árboles y no me arrepentí.", id_usuario: users[2].id_usuario },
        // posts[6]  → vale.snap
        { titulo: "Flores de primavera", descripcion: "La naturaleza en su mejor versión.", id_usuario: users[3].id_usuario },
        // posts[7]  → vale.snap
        { titulo: "Tarde en el parque", descripcion: "Desconectarse a veces es lo mejor.", id_usuario: users[3].id_usuario },
        // posts[8]  → luci_frames
        { titulo: "Texturas urbanas", descripcion: "La ciudad tiene más detalles de los que creemos.", id_usuario: users[4].id_usuario },
        // posts[9]  → mateo.lens
        { titulo: "Mar de fondo", descripcion: "El sonido del mar siempre calma.", id_usuario: users[5].id_usuario },
        // posts[10] → cami_vis
        { titulo: "Retrato en blanco y negro", descripcion: "A veces el color distrae de lo que importa.", id_usuario: users[6].id_usuario },
        // posts[11] → joaco_raw
        { titulo: "Arquitectura moderna", descripcion: "Líneas, formas y mucha luz.", id_usuario: users[7].id_usuario },
    ]);

    // ─────────────────────────────────────────────
    // PUBLICACION_ETIQUETA  (20 relaciones)
    // ─────────────────────────────────────────────
    await Publicacion_Etiqueta.bulkCreate([
        { id_post: posts[0].id_post, id_etiqueta: tags[0].id_etiqueta },  // postGreen
        { id_post: posts[0].id_post, id_etiqueta: tags[1].id_etiqueta },  // aguantefotaza
        { id_post: posts[0].id_post, id_etiqueta: tags[10].id_etiqueta },  // paisaje
        { id_post: posts[1].id_post, id_etiqueta: tags[11].id_etiqueta },  // minimalismo
        { id_post: posts[2].id_post, id_etiqueta: tags[3].id_etiqueta },  // postFlojo
        { id_post: posts[2].id_post, id_etiqueta: tags[8].id_etiqueta },  // urbano
        { id_post: posts[3].id_post, id_etiqueta: tags[3].id_etiqueta },  // postFlojo
        { id_post: posts[4].id_post, id_etiqueta: tags[5].id_etiqueta },  // postNozye
        { id_post: posts[4].id_post, id_etiqueta: tags[7].id_etiqueta },  // naturaleza
        { id_post: posts[5].id_post, id_etiqueta: tags[5].id_etiqueta },  // postNozye
        { id_post: posts[6].id_post, id_etiqueta: tags[13].id_etiqueta },  // postVale
        { id_post: posts[6].id_post, id_etiqueta: tags[7].id_etiqueta },  // naturaleza
        { id_post: posts[7].id_post, id_etiqueta: tags[13].id_etiqueta },  // postVale
        { id_post: posts[8].id_post, id_etiqueta: tags[15].id_etiqueta },  // postLuci
        { id_post: posts[8].id_post, id_etiqueta: tags[8].id_etiqueta },  // urbano
        { id_post: posts[9].id_post, id_etiqueta: tags[16].id_etiqueta },  // postMateo
        { id_post: posts[9].id_post, id_etiqueta: tags[10].id_etiqueta },  // paisaje
        { id_post: posts[10].id_post, id_etiqueta: tags[17].id_etiqueta },  // blanco_y_negro
        { id_post: posts[10].id_post, id_etiqueta: tags[9].id_etiqueta },  // retrato
        { id_post: posts[11].id_post, id_etiqueta: tags[12].id_etiqueta },  // arquitectura
    ]);

    // ─────────────────────────────────────────────
    // IMAGEN  (20 imágenes — Picsum Photos, libres)
    //
    //  URL base: https://picsum.photos/id/{N}/800/600
    //  Galería:  https://picsum.photos/images
    //  Licencia: CC0 / libre de uso
    // ─────────────────────────────────────────────
    const imgs = await Imagen.bulkCreate([
        // imgs[0] → posts[0] — atardecer
        { nombre_img: "Atardecer costa 1", img_path: "https://picsum.photos/id/1039/800/600", extension: "jpg", id_post: posts[0].id_post, comentarios_cerrados: false },
        // imgs[1] → posts[0] — segunda imagen del mismo post
        { nombre_img: "Atardecer costa 2", img_path: "https://picsum.photos/id/1015/800/600", extension: "jpg", id_post: posts[0].id_post, comentarios_cerrados: false },
        // imgs[2] → posts[1] — café
        { nombre_img: "Café mañanero", img_path: "https://picsum.photos/id/431/800/600", extension: "jpg", id_post: posts[1].id_post, comentarios_cerrados: false },
        // imgs[3] → posts[2] — ciudad
        { nombre_img: "Ciudad entre niebla", img_path: "https://picsum.photos/id/1053/800/600", extension: "jpg", id_post: posts[2].id_post, comentarios_cerrados: false },
        // imgs[4] → posts[3] — lluvia/charco
        { nombre_img: "Reflejos en charco", img_path: "https://picsum.photos/id/103/800/600", extension: "jpg", id_post: posts[3].id_post, comentarios_cerrados: false },
        // imgs[5] → posts[4] — montañas
        { nombre_img: "Montañas amanecer", img_path: "https://picsum.photos/id/1018/800/600", extension: "jpg", id_post: posts[4].id_post, comentarios_cerrados: false },
        // imgs[6] → posts[4] — segunda imagen montañas
        { nombre_img: "Cima nevada", img_path: "https://picsum.photos/id/1045/800/600", extension: "jpg", id_post: posts[4].id_post, comentarios_cerrados: false },
        // imgs[7] → posts[5] — bosque
        { nombre_img: "Bosque encantado", img_path: "https://picsum.photos/id/1043/800/600", extension: "jpg", id_post: posts[5].id_post, comentarios_cerrados: false },
        // imgs[8] → posts[6] — flores
        { nombre_img: "Flores de primavera", img_path: "https://picsum.photos/id/152/800/600", extension: "jpg", id_post: posts[6].id_post, comentarios_cerrados: false },
        // imgs[9] → posts[6] — otra foto flores
        { nombre_img: "Campo florido", img_path: "https://picsum.photos/id/823/800/600", extension: "jpg", id_post: posts[6].id_post, comentarios_cerrados: false },
        // imgs[10] → posts[7] — parque
        { nombre_img: "Tarde en el parque", img_path: "https://picsum.photos/id/1060/800/600", extension: "jpg", id_post: posts[7].id_post, comentarios_cerrados: false },
        // imgs[11] → posts[8] — texturas urbanas
        { nombre_img: "Textura ladrillo", img_path: "https://picsum.photos/id/1082/800/600", extension: "jpg", id_post: posts[8].id_post, comentarios_cerrados: false },
        // imgs[12] → posts[8] — segunda textura
        { nombre_img: "Textura vidrio", img_path: "https://picsum.photos/id/1029/800/600", extension: "jpg", id_post: posts[8].id_post, comentarios_cerrados: false },
        // imgs[13] → posts[9] — mar
        { nombre_img: "Mar de fondo", img_path: "https://picsum.photos/id/1001/800/600", extension: "jpg", id_post: posts[9].id_post, comentarios_cerrados: false },
        // imgs[14] → posts[9] — olas
        { nombre_img: "Olas en la orilla", img_path: "https://picsum.photos/id/1003/800/600", extension: "jpg", id_post: posts[9].id_post, comentarios_cerrados: false },
        // imgs[15] → posts[10] — retrato b&n
        { nombre_img: "Retrato femenino bn", img_path: "https://picsum.photos/id/1005/800/600", extension: "jpg", id_post: posts[10].id_post, comentarios_cerrados: false },
        // imgs[16] → posts[10] — retrato 2
        { nombre_img: "Retrato masculino bn", img_path: "https://picsum.photos/id/1012/800/600", extension: "jpg", id_post: posts[10].id_post, comentarios_cerrados: false },
        // imgs[17] → posts[11] — arquitectura
        { nombre_img: "Edificio moderno", img_path: "https://picsum.photos/id/1040/800/600", extension: "jpg", id_post: posts[11].id_post, comentarios_cerrados: false },
        // imgs[18] → posts[11] — detalle arquitectura
        { nombre_img: "Detalle fachada", img_path: "https://picsum.photos/id/1059/800/600", extension: "jpg", id_post: posts[11].id_post, comentarios_cerrados: false },
        // imgs[19] → posts[11] — interior
        { nombre_img: "Interior luminoso", img_path: "https://picsum.photos/id/1047/800/600", extension: "jpg", id_post: posts[11].id_post, comentarios_cerrados: false },
    ]);

    // ─────────────────────────────────────────────
    // IMAGEN_ETIQUETA  (20 relaciones)
    // ─────────────────────────────────────────────
    await Imagen_Etiqueta.bulkCreate([
        { id_img: imgs[0].id_img, id_etiqueta: tags[2].id_etiqueta },   // imgGreen
        { id_img: imgs[1].id_img, id_etiqueta: tags[10].id_etiqueta },   // paisaje
        { id_img: imgs[2].id_img, id_etiqueta: tags[11].id_etiqueta },   // minimalismo
        { id_img: imgs[3].id_img, id_etiqueta: tags[4].id_etiqueta },   // imgFlojo
        { id_img: imgs[4].id_img, id_etiqueta: tags[8].id_etiqueta },   // urbano
        { id_img: imgs[5].id_img, id_etiqueta: tags[6].id_etiqueta },   // imgNozye
        { id_img: imgs[6].id_img, id_etiqueta: tags[7].id_etiqueta },   // naturaleza
        { id_img: imgs[7].id_img, id_etiqueta: tags[7].id_etiqueta },   // naturaleza
        { id_img: imgs[8].id_img, id_etiqueta: tags[14].id_etiqueta },   // imgVale
        { id_img: imgs[9].id_img, id_etiqueta: tags[7].id_etiqueta },   // naturaleza
        { id_img: imgs[10].id_img, id_etiqueta: tags[14].id_etiqueta },   // imgVale
        { id_img: imgs[11].id_img, id_etiqueta: tags[8].id_etiqueta },   // urbano
        { id_img: imgs[12].id_img, id_etiqueta: tags[12].id_etiqueta },   // arquitectura
        { id_img: imgs[13].id_img, id_etiqueta: tags[10].id_etiqueta },   // paisaje
        { id_img: imgs[14].id_img, id_etiqueta: tags[10].id_etiqueta },   // paisaje
        { id_img: imgs[15].id_img, id_etiqueta: tags[17].id_etiqueta },   // blanco_y_negro
        { id_img: imgs[16].id_img, id_etiqueta: tags[9].id_etiqueta },   // retrato
        { id_img: imgs[17].id_img, id_etiqueta: tags[12].id_etiqueta },   // arquitectura
        { id_img: imgs[18].id_img, id_etiqueta: tags[12].id_etiqueta },   // arquitectura
        { id_img: imgs[19].id_img, id_etiqueta: tags[11].id_etiqueta },   // minimalismo
    ]);

    // ─────────────────────────────────────────────
    // COMENTARIO  (20 comentarios)
    // ─────────────────────────────────────────────
    await Comentario.bulkCreate([
        // Comentarios en imgs[0] — Atardecer costa 1
        { texto: "Esa foto quedó increíble, parece portada de revista.", estado_comentario: "activo", id_img: imgs[0].id_img, id_usuario: users[1].id_usuario },
        { texto: "La combinación de colores está brutal.", estado_comentario: "activo", id_img: imgs[0].id_img, id_usuario: users[2].id_usuario },
        { texto: "¿Qué lente usaste? Los detalles son una locura.", estado_comentario: "activo", id_img: imgs[0].id_img, id_usuario: users[3].id_usuario },

        // Comentarios en imgs[2] — Café
        { texto: "Me dieron ganas de prepararme un café ahora mismo.", estado_comentario: "activo", id_img: imgs[2].id_img, id_usuario: users[4].id_usuario },
        { texto: "El encuadre es perfecto, simple y limpio.", estado_comentario: "activo", id_img: imgs[2].id_img, id_usuario: users[5].id_usuario },

        // Comentarios en imgs[3] — Ciudad niebla
        { texto: "Esa niebla le da un toque misterioso que me encanta.", estado_comentario: "activo", id_img: imgs[3].id_img, id_usuario: users[0].id_usuario },
        { texto: "Parece una escena de película.", estado_comentario: "activo", id_img: imgs[3].id_img, id_usuario: users[6].id_usuario },

        // Comentarios en imgs[5] — Montañas
        { texto: "Qué paz transmite esta foto, necesito ir ahí ya.", estado_comentario: "activo", id_img: imgs[5].id_img, id_usuario: users[7].id_usuario },
        { texto: "La luz del amanecer en las cimas es algo único.", estado_comentario: "activo", id_img: imgs[5].id_img, id_usuario: users[1].id_usuario },
        { texto: "Foto de concurso sin dudas.", estado_comentario: "activo", id_img: imgs[5].id_img, id_usuario: users[3].id_usuario },

        // Comentarios en imgs[7] — Bosque
        { texto: "Me recuerda a los paseos de domingo en el campo.", estado_comentario: "activo", id_img: imgs[7].id_img, id_usuario: users[2].id_usuario },
        { texto: "Los tonos verdes quedaron perfectos.", estado_comentario: "activo", id_img: imgs[7].id_img, id_usuario: users[4].id_usuario },

        // Comentarios en imgs[8] — Flores
        { texto: "Esto es una obra de arte, en serio.", estado_comentario: "activo", id_img: imgs[8].id_img, id_usuario: users[5].id_usuario },
        { texto: "El enfoque selectivo hace que las flores resalten mucho.", estado_comentario: "activo", id_img: imgs[8].id_img, id_usuario: users[0].id_usuario },

        // Comentarios en imgs[13] — Mar
        { texto: "El mar siempre calma el alma. Gran captura.", estado_comentario: "activo", id_img: imgs[13].id_img, id_usuario: users[6].id_usuario },
        { texto: "Se siente el sonido de las olas solo con verla.", estado_comentario: "activo", id_img: imgs[13].id_img, id_usuario: users[7].id_usuario },

        // Comentarios en imgs[15] — Retrato b&n
        { texto: "El blanco y negro le da una profundidad increíble.", estado_comentario: "activo", id_img: imgs[15].id_img, id_usuario: users[1].id_usuario },
        { texto: "La expresión es todo en este retrato. Genial.", estado_comentario: "activo", id_img: imgs[15].id_img, id_usuario: users[2].id_usuario },

        // Comentarios en imgs[17] — Arquitectura
        { texto: "Me gustan mucho las líneas geométricas, muy limpio.", estado_comentario: "activo", id_img: imgs[17].id_img, id_usuario: users[3].id_usuario },
        { texto: "La perspectiva elegida realza la verticalidad del edificio.", estado_comentario: "activo", id_img: imgs[17].id_img, id_usuario: users[4].id_usuario },
    ]);

    // ─────────────────────────────────────────────
    // VALORIZACION  (36 valoraciones — todas las imágenes valoradas al menos una vez)
    //  Regla: el autor de la imagen NO se valora a sí mismo
    //  imgs[0-1]  → posts[0] → users[0]   ∴ valorizan users[1..7]
    //  imgs[2]    → posts[1] → users[0]   ∴ valorizan users[1..7]
    //  imgs[3]    → posts[2] → users[1]   ∴ valorizan users[0,2..7]
    //  imgs[4]    → posts[3] → users[1]   ∴ valorizan users[0,2..7]
    //  imgs[5-6]  → posts[4] → users[2]   ∴ valorizan users[0,1,3..7]
    //  imgs[7]    → posts[5] → users[2]   ∴ valorizan users[0,1,3..7]
    //  imgs[8-9]  → posts[6] → users[3]   ∴ valorizan users[0..2,4..7]
    //  imgs[10]   → posts[7] → users[3]   ∴ valorizan users[0..2,4..7]
    //  imgs[11-12]→ posts[8] → users[4]   ∴ valorizan users[0..3,5..7]
    //  imgs[13-14]→ posts[9] → users[5]   ∴ valorizan users[0..4,6,7]
    //  imgs[15-16]→ posts[10]→ users[6]   ∴ valorizan users[0..5,7]
    //  imgs[17-19]→ posts[11]→ users[7]   ∴ valorizan users[0..6]
    // ─────────────────────────────────────────────
    await Valorizacion.bulkCreate([
        // imgs[0] — Atardecer costa 1  (post de users[0])
        { id_img: imgs[0].id_img, id_usuario: users[1].id_usuario, puntaje: 4 },
        { id_img: imgs[0].id_img, id_usuario: users[2].id_usuario, puntaje: 5 },
        { id_img: imgs[0].id_img, id_usuario: users[3].id_usuario, puntaje: 3 },

        // imgs[1] — Atardecer costa 2  (post de users[0])
        { id_img: imgs[1].id_img, id_usuario: users[4].id_usuario, puntaje: 5 },
        { id_img: imgs[1].id_img, id_usuario: users[5].id_usuario, puntaje: 4 },

        // imgs[2] — Café mañanero  (post de users[0])
        { id_img: imgs[2].id_img, id_usuario: users[4].id_usuario, puntaje: 2 },
        { id_img: imgs[2].id_img, id_usuario: users[5].id_usuario, puntaje: 3 },

        // imgs[3] — Ciudad entre niebla  (post de users[1])
        { id_img: imgs[3].id_img, id_usuario: users[0].id_usuario, puntaje: 5 },
        { id_img: imgs[3].id_img, id_usuario: users[6].id_usuario, puntaje: 4 },

        // imgs[4] — Reflejos en charco  (post de users[1])
        { id_img: imgs[4].id_img, id_usuario: users[2].id_usuario, puntaje: 3 },
        { id_img: imgs[4].id_img, id_usuario: users[7].id_usuario, puntaje: 4 },

        // imgs[5] — Montañas amanecer  (post de users[2])
        { id_img: imgs[5].id_img, id_usuario: users[7].id_usuario, puntaje: 1 },
        { id_img: imgs[5].id_img, id_usuario: users[1].id_usuario, puntaje: 4 },

        // imgs[6] — Cima nevada  (post de users[2])
        { id_img: imgs[6].id_img, id_usuario: users[0].id_usuario, puntaje: 5 },
        { id_img: imgs[6].id_img, id_usuario: users[3].id_usuario, puntaje: 4 },

        // imgs[7] — Bosque encantado  (post de users[2])
        { id_img: imgs[7].id_img, id_usuario: users[1].id_usuario, puntaje: 5 },
        { id_img: imgs[7].id_img, id_usuario: users[4].id_usuario, puntaje: 3 },

        // imgs[8] — Flores de primavera  (post de users[3])
        { id_img: imgs[8].id_img, id_usuario: users[5].id_usuario, puntaje: 3 },
        { id_img: imgs[8].id_img, id_usuario: users[6].id_usuario, puntaje: 3 },

        // imgs[9] — Campo florido  (post de users[3])
        { id_img: imgs[9].id_img, id_usuario: users[0].id_usuario, puntaje: 4 },
        { id_img: imgs[9].id_img, id_usuario: users[2].id_usuario, puntaje: 5 },

        // imgs[10] — Tarde en el parque  (post de users[3])
        { id_img: imgs[10].id_img, id_usuario: users[1].id_usuario, puntaje: 2 },
        { id_img: imgs[10].id_img, id_usuario: users[7].id_usuario, puntaje: 4 },

        // imgs[11] — Textura ladrillo  (post de users[4])
        { id_img: imgs[11].id_img, id_usuario: users[0].id_usuario, puntaje: 3 },
        { id_img: imgs[11].id_img, id_usuario: users[3].id_usuario, puntaje: 2 },

        // imgs[12] — Textura vidrio  (post de users[4])
        { id_img: imgs[12].id_img, id_usuario: users[6].id_usuario, puntaje: 4 },
        { id_img: imgs[12].id_img, id_usuario: users[7].id_usuario, puntaje: 5 },

        // imgs[13] — Mar de fondo  (post de users[5])
        { id_img: imgs[13].id_img, id_usuario: users[6].id_usuario, puntaje: 5 },
        { id_img: imgs[13].id_img, id_usuario: users[7].id_usuario, puntaje: 3 },

        // imgs[14] — Olas en la orilla  (post de users[5])
        { id_img: imgs[14].id_img, id_usuario: users[0].id_usuario, puntaje: 4 },
        { id_img: imgs[14].id_img, id_usuario: users[4].id_usuario, puntaje: 5 },

        // imgs[15] — Retrato femenino bn  (post de users[6])
        { id_img: imgs[15].id_img, id_usuario: users[1].id_usuario, puntaje: 3 },
        { id_img: imgs[15].id_img, id_usuario: users[5].id_usuario, puntaje: 4 },

        // imgs[16] — Retrato masculino bn  (post de users[6])
        { id_img: imgs[16].id_img, id_usuario: users[2].id_usuario, puntaje: 5 },
        { id_img: imgs[16].id_img, id_usuario: users[3].id_usuario, puntaje: 4 },

        // imgs[17] — Edificio moderno  (post de users[7])
        { id_img: imgs[17].id_img, id_usuario: users[3].id_usuario, puntaje: 1 },
        { id_img: imgs[17].id_img, id_usuario: users[4].id_usuario, puntaje: 3 },

        // imgs[18] — Detalle fachada  (post de users[7])
        { id_img: imgs[18].id_img, id_usuario: users[0].id_usuario, puntaje: 4 },
        { id_img: imgs[18].id_img, id_usuario: users[5].id_usuario, puntaje: 3 },

        // imgs[19] — Interior luminoso  (post de users[7])
        { id_img: imgs[19].id_img, id_usuario: users[1].id_usuario, puntaje: 5 },
        { id_img: imgs[19].id_img, id_usuario: users[6].id_usuario, puntaje: 4 },
    ]);

    // ─────────────────────────────────────────────
    // SEGUIDORES  (8 relaciones de seguimiento)
    // ─────────────────────────────────────────────
    await Seguidores.bulkCreate([
        // users[1] sigue a users[0]
        { id_seguidor: users[1].id_usuario, id_seguido: users[0].id_usuario, id_usuario: users[1].id_usuario },
        // users[2] sigue a users[0]
        { id_seguidor: users[2].id_usuario, id_seguido: users[0].id_usuario, id_usuario: users[2].id_usuario },
        // users[0] sigue a users[1]
        { id_seguidor: users[0].id_usuario, id_seguido: users[1].id_usuario, id_usuario: users[0].id_usuario },
        // users[3] sigue a users[0]
        { id_seguidor: users[3].id_usuario, id_seguido: users[0].id_usuario, id_usuario: users[3].id_usuario },
        // users[4] sigue a users[2]
        { id_seguidor: users[4].id_usuario, id_seguido: users[2].id_usuario, id_usuario: users[4].id_usuario },
        // users[5] sigue a users[3]
        { id_seguidor: users[5].id_usuario, id_seguido: users[3].id_usuario, id_usuario: users[5].id_usuario },
        // users[6] sigue a users[4]
        { id_seguidor: users[6].id_usuario, id_seguido: users[4].id_usuario, id_usuario: users[6].id_usuario },
        // users[7] sigue a users[5]
        { id_seguidor: users[7].id_usuario, id_seguido: users[5].id_usuario, id_usuario: users[7].id_usuario },
    ]);

}

seed();
