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
import { Favoritos } from "../models/Favoritos.js";
import { Publicacion_Favoritos } from "../models/Publicacion_Favoritos.js";
import { Publicacion_Colecciones } from "../models/Publicacion_Colecciones.js";
import { DenunciaPublicacion } from "../models/DenunciaPublicacion.js";
import { Motivo } from "../models/Motivo.js";

async function seed() {
    await sequelize.sync({ alter: true, force: true });

    // ─────────────────────────────────────────────
    // PERSONA  (8 personas)
    // ─────────────────────────────────────────────
    const personas = await Persona.bulkCreate([
        // personas[0] → user00
        { dni: "11111111", tipo_dni: "DNI", sexo: "Masculino", nombre: "User", apellido: "Zero", fecha_nacimiento: "1990-01-01", mail: "user00@test.com" },
        // personas[1] → user01
        { dni: "22222222", tipo_dni: "DNI", sexo: "Masculino", nombre: "User", apellido: "One", fecha_nacimiento: "1995-05-10", mail: "user01@test.com" },
        // personas[2] → user02
        { dni: "33333333", tipo_dni: "DNI", sexo: "Femenino", nombre: "User", apellido: "Two", fecha_nacimiento: "1998-08-20", mail: "user02@test.com" },
        // personas[3] → user03
        { dni: "44444444", tipo_dni: "DNI", sexo: "Masculino", nombre: "User", apellido: "Three", fecha_nacimiento: "2000-03-15", mail: "user03@test.com" },
        // personas[4] → user04
        { dni: "66666666", tipo_dni: "DNI", sexo: "Femenino", nombre: "User", apellido: "Four", fecha_nacimiento: "1993-07-12", mail: "user04@test.com" },
        // personas[5] → user05 (tiene 2 bajas: la próxima lo inactiva)
        { dni: "77777777", tipo_dni: "DNI", sexo: "Masculino", nombre: "User", apellido: "Five", fecha_nacimiento: "1996-02-28", mail: "user05@test.com" },
        // personas[6] → user06 (cuenta ya inactiva por 3 bajas)
        { dni: "88888888", tipo_dni: "DNI", sexo: "Femenino", nombre: "User", apellido: "Six", fecha_nacimiento: "1999-12-05", mail: "user06@test.com" },
        // personas[7] → validador
        { dni: "55555555", tipo_dni: "DNI", sexo: "Femenino", nombre: "Validador", apellido: "Contenidos", fecha_nacimiento: "1988-11-25", mail: "validador@test.com" },
    ]);

    // ─────────────────────────────────────────────
    // USUARIO  (8 usuarios)
    // Contraseñas en texto plano (para el README):
    //   user00    → User1234
    //   user01    → User1234
    //   user02    → User1234
    //   user03    → User1234
    //   user04    → user@4444
    //   user05    → user@5555  (2 publicaciones dadas de baja)
    //   user06    → user@6666  (cuenta inactiva, 3 bajas)
    //   validador → valid@1234  (rol: validador)
    // ─────────────────────────────────────────────
    const usuariosData = [
        // users[0] → user00
        { nombre_usuario: "user00", id_persona: personas[0].id_persona, contrasenia: "user@1234" },
        // users[1] → user01
        { nombre_usuario: "user01", id_persona: personas[1].id_persona, contrasenia: "user@4567" },
        // users[2] → user02
        { nombre_usuario: "user02", id_persona: personas[2].id_persona, contrasenia: "user@8912" },
        // users[3] → user03
        { nombre_usuario: "user03", id_persona: personas[3].id_persona, contrasenia: "user@3456" },
        // users[4] → user04
        { nombre_usuario: "user04", id_persona: personas[4].id_persona, contrasenia: "user@4444" },
        // users[5] → user05 (2 bajas: una más y su cuenta se inactiva)
        { nombre_usuario: "user05", id_persona: personas[5].id_persona, contrasenia: "user@5555" },
        // users[6] → user06 (3 bajas: cuenta inactiva, no debería poder iniciar sesión)
        { nombre_usuario: "user06", id_persona: personas[6].id_persona, contrasenia: "user@6666", activo: false },
        // users[7] → validador (rol: validador)
        { nombre_usuario: "validador", id_persona: personas[7].id_persona, contrasenia: "valid@1234", rol: "validador" },
    ];

    // Generar hash para cada contraseña
    const usuariosHasheados = await Promise.all(
        usuariosData.map(async (u) => ({
            ...u,
            contrasenia: await bcrypt.hash(u.contrasenia, 10),
        }))
    );

    const users = await Usuario.bulkCreate(usuariosHasheados);

    // ─────────────────────────────────────────────
    // FAVORITOS(7)  (el validador no tiene)
    // ─────────────────────────────────────────────

    const fav = await Favoritos.bulkCreate([
        // fav[0] → user00
        { id_usuario: users[0].id_usuario },
        // fav[1] → user01
        { id_usuario: users[1].id_usuario },
        // fav[2] → user02
        { id_usuario: users[2].id_usuario },
        // fav[3] → user03
        { id_usuario: users[3].id_usuario },
        // fav[4] → user04
        { id_usuario: users[4].id_usuario },
        // fav[5] → user05
        { id_usuario: users[5].id_usuario },
        // fav[6] → user06
        { id_usuario: users[6].id_usuario }
    ])


    // ─────────────────────────────────────────────
    // ETIQUETA  (6 tags)
    // ─────────────────────────────────────────────
    const tags = await Etiqueta.bulkCreate([
        // tags[0]
        { nom_etiqueta: "naturaleza" },
        // tags[1]
        { nom_etiqueta: "urbano" },
        // tags[2]
        { nom_etiqueta: "retrato" },
        // tags[3]
        { nom_etiqueta: "paisaje" },
        // tags[4]
        { nom_etiqueta: "minimalismo" },
        // tags[5]
        { nom_etiqueta: "arquitectura" },
    ]);

    // ─────────────────────────────────────────────
    // PUBLICACION  (13 posts)
    // ─────────────────────────────────────────────
    const posts = await Publicacion.bulkCreate([
        // posts[0] → user00
        { titulo: "Atardecer en la costa", descripcion: "Un atardecer que no se puede describir con palabras.", id_usuario: users[0].id_usuario },
        // posts[1] → user01
        { titulo: "Ciudad entre niebla", descripcion: "La ciudad nunca duerme, pero a veces se esconde.", id_usuario: users[1].id_usuario },
        // posts[2] → user02
        { titulo: "Flores de primavera", descripcion: "La naturaleza en su mejor versión.", id_usuario: users[2].id_usuario },
        // posts[3] → user03
        { titulo: "Mar de fondo", descripcion: "El sonido del mar siempre calma.", id_usuario: users[3].id_usuario },
        // posts[4] → user01
        { titulo: "Arquitectura moderna", descripcion: "Líneas, formas y mucha luz.", id_usuario: users[1].id_usuario },

        // ── Posts para probar el flujo del validador ──
        // posts[5] → user05 — YA dada de baja (baja 1 de 2)
        { titulo: "Calles de otoño", descripcion: "Hojas secas y luz tenue en la avenida.", id_usuario: users[5].id_usuario, estado: "inactiva" },
        // posts[6] → user05 — YA dada de baja (baja 2 de 2)
        { titulo: "Reflejos en el lago", descripcion: "El cielo duplicado sobre el agua.", id_usuario: users[5].id_usuario, estado: "inactiva" },
        // posts[7] → user05 — 4 denuncias pendientes: dar de baja = 3ª baja → inactiva la cuenta
        { titulo: "Puente al amanecer", descripcion: "Primeras luces sobre el puente viejo.", id_usuario: users[5].id_usuario },
        // posts[8] → user06 — dada de baja (baja 1 de 3)
        { titulo: "Sombras y luces", descripcion: "Juego de contrastes en el mediodía.", id_usuario: users[6].id_usuario, estado: "inactiva" },
        // posts[9] → user06 — dada de baja (baja 2 de 3)
        { titulo: "Retrato en blanco y negro", descripcion: "Una mirada que cuenta una historia.", id_usuario: users[6].id_usuario, estado: "inactiva" },
        // posts[10] → user06 — dada de baja (baja 3 de 3 → cuenta inactiva)
        { titulo: "Mercado al aire libre", descripcion: "Colores y gente un sábado a la mañana.", id_usuario: users[6].id_usuario, estado: "inactiva" },
        // posts[11] → user04 — 5 denuncias pendientes (en la lista del validador)
        { titulo: "Montañas nevadas", descripcion: "El silencio del invierno en la cordillera.", id_usuario: users[4].id_usuario },
        // posts[12] → user03 — 4 denuncias YA desestimadas (no debe aparecer en la lista)
        { titulo: "Jardín botánico", descripcion: "Un rincón verde en medio de la ciudad.", id_usuario: users[3].id_usuario },
    ]);

    // ─────────────────────────────────────────────
    // PUBLICACION_ETIQUETA  (7 relaciones)
    // ─────────────────────────────────────────────
    await Publicacion_Etiqueta.bulkCreate([
        { id_post: posts[0].id_post, id_etiqueta: tags[3].id_etiqueta },  // paisaje
        { id_post: posts[0].id_post, id_etiqueta: tags[0].id_etiqueta },  // naturaleza
        { id_post: posts[1].id_post, id_etiqueta: tags[1].id_etiqueta },  // urbano
        { id_post: posts[2].id_post, id_etiqueta: tags[0].id_etiqueta },  // naturaleza
        { id_post: posts[3].id_post, id_etiqueta: tags[3].id_etiqueta },  // paisaje
        { id_post: posts[4].id_post, id_etiqueta: tags[5].id_etiqueta },  // arquitectura
        { id_post: posts[4].id_post, id_etiqueta: tags[4].id_etiqueta },  // minimalismo
        { id_post: posts[7].id_post, id_etiqueta: tags[5].id_etiqueta },  // arquitectura
        { id_post: posts[11].id_post, id_etiqueta: tags[3].id_etiqueta }, // paisaje
        { id_post: posts[12].id_post, id_etiqueta: tags[0].id_etiqueta }, // naturaleza
    ]);

    // ─────────────────────────────────────────────
    // IMAGEN  (15 imágenes — Picsum Photos, libres)
    // ─────────────────────────────────────────────
    const imgs = await Imagen.bulkCreate([
        // imgs[0] → posts[0] — atardecer
        { nombre_img: "Atardecer costa 1", img_path: "https://picsum.photos/id/1039/800/600", extension: "jpg", id_post: posts[0].id_post, comentarios_cerrados: false },
        // imgs[1] → posts[0] — segunda imagen del mismo post
        { nombre_img: "Atardecer costa 2", img_path: "https://picsum.photos/id/1015/800/600", extension: "jpg", id_post: posts[0].id_post, comentarios_cerrados: false },
        // imgs[2] → posts[1] — ciudad
        { nombre_img: "Ciudad entre niebla", img_path: "https://picsum.photos/id/1053/800/600", extension: "jpg", id_post: posts[1].id_post, comentarios_cerrados: false },
        // imgs[3] → posts[2] — flores
        { nombre_img: "Flores de primavera", img_path: "https://picsum.photos/id/152/800/600", extension: "jpg", id_post: posts[2].id_post, comentarios_cerrados: false },
        // imgs[4] → posts[3] — mar
        { nombre_img: "Mar de fondo", img_path: "https://picsum.photos/id/1001/800/600", extension: "jpg", id_post: posts[3].id_post, comentarios_cerrados: false },
        // imgs[5] → posts[4] — arquitectura 1
        { nombre_img: "Edificio moderno", img_path: "https://picsum.photos/id/1040/800/600", extension: "jpg", id_post: posts[4].id_post, comentarios_cerrados: false },
        // imgs[6] → posts[4] — arquitectura 2
        { nombre_img: "Detalle fachada", img_path: "https://picsum.photos/id/1059/800/600", extension: "jpg", id_post: posts[4].id_post, comentarios_cerrados: false },
        // imgs[7] → posts[5] — calles de otoño
        { nombre_img: "Calles de otoño", img_path: "https://picsum.photos/id/1018/800/600", extension: "jpg", id_post: posts[5].id_post, comentarios_cerrados: false },
        // imgs[8] → posts[6] — reflejos en el lago
        { nombre_img: "Reflejos en el lago", img_path: "https://picsum.photos/id/1019/800/600", extension: "jpg", id_post: posts[6].id_post, comentarios_cerrados: false },
        // imgs[9] → posts[7] — puente al amanecer
        { nombre_img: "Puente al amanecer", img_path: "https://picsum.photos/id/1020/800/600", extension: "jpg", id_post: posts[7].id_post, comentarios_cerrados: false },
        // imgs[10] → posts[8] — sombras y luces
        { nombre_img: "Sombras y luces", img_path: "https://picsum.photos/id/1021/800/600", extension: "jpg", id_post: posts[8].id_post, comentarios_cerrados: false },
        // imgs[11] → posts[9] — retrato blanco y negro
        { nombre_img: "Retrato en blanco y negro", img_path: "https://picsum.photos/id/1024/800/600", extension: "jpg", id_post: posts[9].id_post, comentarios_cerrados: false },
        // imgs[12] → posts[10] — mercado
        { nombre_img: "Mercado al aire libre", img_path: "https://picsum.photos/id/1025/800/600", extension: "jpg", id_post: posts[10].id_post, comentarios_cerrados: false },
        // imgs[13] → posts[11] — montañas nevadas
        { nombre_img: "Montañas nevadas", img_path: "https://picsum.photos/id/1027/800/600", extension: "jpg", id_post: posts[11].id_post, comentarios_cerrados: false },
        // imgs[14] → posts[12] — jardín botánico
        { nombre_img: "Jardín botánico", img_path: "https://picsum.photos/id/1035/800/600", extension: "jpg", id_post: posts[12].id_post, comentarios_cerrados: false },
    ]);

    // ─────────────────────────────────────────────
    // IMAGEN_ETIQUETA  (7 relaciones)
    // ─────────────────────────────────────────────
    await Imagen_Etiqueta.bulkCreate([
        { id_img: imgs[0].id_img, id_etiqueta: tags[3].id_etiqueta },  // paisaje
        { id_img: imgs[1].id_img, id_etiqueta: tags[0].id_etiqueta },  // naturaleza
        { id_img: imgs[2].id_img, id_etiqueta: tags[1].id_etiqueta },  // urbano
        { id_img: imgs[3].id_img, id_etiqueta: tags[0].id_etiqueta },  // naturaleza
        { id_img: imgs[4].id_img, id_etiqueta: tags[3].id_etiqueta },  // paisaje
        { id_img: imgs[5].id_img, id_etiqueta: tags[5].id_etiqueta },  // arquitectura
        { id_img: imgs[6].id_img, id_etiqueta: tags[4].id_etiqueta },  // minimalismo
        { id_img: imgs[9].id_img, id_etiqueta: tags[5].id_etiqueta },  // arquitectura
        { id_img: imgs[13].id_img, id_etiqueta: tags[3].id_etiqueta }, // paisaje
        { id_img: imgs[14].id_img, id_etiqueta: tags[0].id_etiqueta }, // naturaleza
    ]);

    // ─────────────────────────────────────────────
    // COMENTARIO  (8 comentarios)
    // ─────────────────────────────────────────────
    await Comentario.bulkCreate([
        // Comentarios en imgs[0] — Atardecer
        { texto: "Esa foto quedó increíble, parece portada de revista.", estado_comentario: "activo", id_img: imgs[0].id_img, id_usuario: users[1].id_usuario },
        { texto: "La combinación de colores está brutal.", estado_comentario: "activo", id_img: imgs[0].id_img, id_usuario: users[2].id_usuario },

        // Comentarios en imgs[2] — Ciudad niebla
        { texto: "Esa niebla le da un toque misterioso que me encanta.", estado_comentario: "activo", id_img: imgs[2].id_img, id_usuario: users[0].id_usuario },
        { texto: "Parece una escena de película.", estado_comentario: "activo", id_img: imgs[2].id_img, id_usuario: users[3].id_usuario },

        // Comentarios en imgs[3] — Flores
        { texto: "El enfoque selectivo hace que las flores resalten mucho.", estado_comentario: "activo", id_img: imgs[3].id_img, id_usuario: users[0].id_usuario },
        { texto: "Bellísima foto, me encantó.", estado_comentario: "activo", id_img: imgs[3].id_img, id_usuario: users[1].id_usuario },

        // Comentarios en imgs[4] — Mar
        { texto: "El mar siempre calma el alma. Gran captura.", estado_comentario: "activo", id_img: imgs[4].id_img, id_usuario: users[2].id_usuario },

        // Comentarios en imgs[5] — Arquitectura
        { texto: "Me gustan mucho las líneas geométricas, muy limpio.", estado_comentario: "activo", id_img: imgs[5].id_img, id_usuario: users[2].id_usuario },
    ]);

    // ─────────────────────────────────────────────
    // VALORIZACION  (10 valoraciones)
    //  Regla: el autor de la imagen NO se valora a sí mismo
    //  imgs[0-1] → posts[0] → users[0]  ∴ valorizan users[1,2,3]
    //  imgs[2]   → posts[1] → users[1]  ∴ valorizan users[0,2,3]
    //  imgs[3]   → posts[2] → users[2]  ∴ valorizan users[0,1,3]
    //  imgs[4]   → posts[3] → users[3]  ∴ valorizan users[0,1,2]
    //  imgs[5-6] → posts[4] → users[1]  ∴ valorizan users[0,2,3]
    // ─────────────────────────────────────────────
    await Valorizacion.bulkCreate([
        // imgs[0] — Atardecer costa 1  (post de users[0])
        { id_img: imgs[0].id_img, id_usuario: users[1].id_usuario, puntaje: 5 },
        { id_img: imgs[0].id_img, id_usuario: users[2].id_usuario, puntaje: 4 },

        // imgs[1] — Atardecer costa 2  (post de users[0])
        { id_img: imgs[1].id_img, id_usuario: users[3].id_usuario, puntaje: 5 },

        // imgs[2] — Ciudad niebla  (post de users[1])
        { id_img: imgs[2].id_img, id_usuario: users[2].id_usuario, puntaje: 3 },

        // imgs[3] — Flores  (post de users[2])
        { id_img: imgs[3].id_img, id_usuario: users[1].id_usuario, puntaje: 4 },

        // imgs[4] — Mar  (post de users[3])
        { id_img: imgs[4].id_img, id_usuario: users[2].id_usuario, puntaje: 4 },

        // imgs[5] — Edificio moderno  (post de users[1])
        { id_img: imgs[5].id_img, id_usuario: users[3].id_usuario, puntaje: 3 },
    ]);

    // ─────────────────────────────────────────────
    // SEGUIDORES  (4 relaciones)
    // ─────────────────────────────────────────────
    await Seguidores.bulkCreate([
        // user01 sigue a user00
        { id_seguidor: users[1].id_usuario, id_seguido: users[0].id_usuario },
        // user02 sigue a user00
        { id_seguidor: users[2].id_usuario, id_seguido: users[0].id_usuario },
        // user00 sigue a user01
        { id_seguidor: users[0].id_usuario, id_seguido: users[1].id_usuario },
        // user03 sigue a user02
        { id_seguidor: users[3].id_usuario, id_seguido: users[2].id_usuario },
    ]);


    // ─────────────────────────────────────────────
    // MOTIVO  (9 motivos)
    // ─────────────────────────────────────────────
    const motivos = await Motivo.bulkCreate([
        // motivos[0]
        { nombre: "Contenido sexual explícito o desnudos" },
        // motivos[1]
        { nombre: "Violencia gráfica o contenido perturbador" },
        // motivos[2]
        { nombre: "Discurso de odio o discriminación" },
        // motivos[3]
        { nombre: "Acoso, bullying o amenazas" },
        // motivos[4]
        { nombre: "Violación de derechos de autor" },
        // motivos[5]
        { nombre: "Violación de privacidad (persona identificable fotografiada o publicada sin consentimiento)" },
        // motivos[6]
        { nombre: "Spam o publicidad no deseada" },
        // motivos[7]
        { nombre: "Información falsa o engañosa (foto manipulada presentada como real)" },
        // motivos[8]
        { nombre: "Otro motivo" },
    ]);

    // ─────────────────────────────────────────────
    // DENUNCIA_PUBLICACION
    //  Reglas:
    //   - El autor del post NO se denuncia a sí mismo
    //   - Un usuario denuncia un mismo post una sola vez (unique id_post + id_denunciante)
    //   - El validador no denuncia (no es un usuario común)
    //  Estados: "pendiente" | "aceptada" (baja confirmada) | "desestimada"
    //
    //  Autores: posts[0] → users[0] | posts[1] → users[1] | posts[2] → users[2]
    //           posts[3] → users[3] | posts[4] → users[1] | posts[5-7] → users[5]
    //           posts[8-10] → users[6] | posts[11] → users[4] | posts[12] → users[3]
    //
    //  Escenarios para probar:
    //   - posts[1]  → 4 denuncias pendientes  → APARECE en la lista del validador
    //   - posts[7]  → 4 denuncias pendientes  → APARECE; dar de baja inactiva a user05 (3ª baja)
    //   - posts[11] → 5 denuncias pendientes  → APARECE
    //   - posts[3]  → 3 denuncias pendientes  → NO aparece (hace falta MÁS de 3)
    //   - posts[2]  → 1 denuncia pendiente    → NO aparece
    //   - posts[12] → 4 denuncias desestimadas → NO aparece (ya resueltas)
    //   - posts[5,6,8,9,10] → bajas ya confirmadas (denuncias "aceptada")
    // ─────────────────────────────────────────────
    const ejemplosDenuncia = [
        { motivo: 4, texto: "Creo que esta imagen es de otro autor." },
        { motivo: 6, texto: "Parece una publicación para promocionar algo." },
        { motivo: 7, texto: "La foto parece manipulada digitalmente." },
        { motivo: 5, texto: "Se ve una persona identificable en la imagen." },
        { motivo: 8, texto: "No cumple con las normas de la comunidad." },
    ];

    // Genera una denuncia por cada denunciante, rotando motivos y descripciones
    const denunciar = (post, denunciantes, estado, notificada = false) =>
        denunciantes.map((u, i) => {
            const ej = ejemplosDenuncia[i % ejemplosDenuncia.length];
            return {
                id_post: post.id_post,
                id_denunciante: u.id_usuario,
                id_motivo: motivos[ej.motivo].id_motivo,
                descripción: ej.texto,
                estado,
                notificada,
            };
        });

    await DenunciaPublicacion.bulkCreate([
        // posts[1] — Ciudad entre niebla: 4 denuncias de usuarios distintos (aparece en la lista)
        { id_post: posts[1].id_post, id_denunciante: users[0].id_usuario, id_motivo: motivos[6].id_motivo, descripción: "Parece una publicación para promocionar algo.", estado: "pendiente", notificada: false },
        { id_post: posts[1].id_post, id_denunciante: users[2].id_usuario, id_motivo: motivos[7].id_motivo, descripción: "La foto parece manipulada digitalmente.", estado: "pendiente", notificada: false },
        { id_post: posts[1].id_post, id_denunciante: users[3].id_usuario, id_motivo: motivos[5].id_motivo, descripción: "Se ve una persona identificable en la imagen.", estado: "pendiente", notificada: false },
        { id_post: posts[1].id_post, id_denunciante: users[4].id_usuario, id_motivo: motivos[4].id_motivo, descripción: "La imagen parece tomada de un banco de fotos.", estado: "pendiente", notificada: false },

        // posts[2] — Flores de primavera: 1 denuncia (no alcanza)
        { id_post: posts[2].id_post, id_denunciante: users[3].id_usuario, id_motivo: motivos[4].id_motivo, descripción: "Creo que esta imagen es de otro autor.", estado: "pendiente", notificada: false },

        // posts[3] — Mar de fondo: exactamente 3 denuncias (NO supera el umbral)
        { id_post: posts[3].id_post, id_denunciante: users[1].id_usuario, id_motivo: motivos[8].id_motivo, descripción: "No cumple con las normas de la comunidad.", estado: "pendiente", notificada: false },
        { id_post: posts[3].id_post, id_denunciante: users[0].id_usuario, id_motivo: motivos[6].id_motivo, descripción: "", estado: "pendiente", notificada: false },
        { id_post: posts[3].id_post, id_denunciante: users[2].id_usuario, id_motivo: motivos[7].id_motivo, descripción: "Parece una imagen generada o retocada.", estado: "pendiente", notificada: false },

        // posts[4] — Arquitectura moderna (denuncia ya revisada)
        { id_post: posts[4].id_post, id_denunciante: users[3].id_usuario, id_motivo: motivos[4].id_motivo, descripción: "La fachada parece sacada de otra página.", estado: "aceptada", notificada: false },

        // posts[7] — Puente al amanecer (user05): 4 pendientes → la baja inactiva su cuenta
        ...denunciar(posts[7], [users[0], users[1], users[2], users[3]], "pendiente"),

        // posts[11] — Montañas nevadas (user04): 5 pendientes
        ...denunciar(posts[11], [users[0], users[1], users[2], users[3], users[5]], "pendiente"),

        // posts[12] — Jardín botánico (user03): 4 denuncias ya desestimadas
        ...denunciar(posts[12], [users[0], users[1], users[2], users[4]], "desestimada", true),

        // Bajas ya confirmadas (denuncias "aceptada", autor ya notificado)
        ...denunciar(posts[5], [users[0], users[1], users[2], users[3]], "aceptada", true),   // user05 — baja 1
        ...denunciar(posts[6], [users[0], users[1], users[2], users[3]], "aceptada", true),   // user05 — baja 2
        ...denunciar(posts[8], [users[0], users[1], users[2], users[3]], "aceptada", true),   // user06 — baja 1
        ...denunciar(posts[9], [users[0], users[1], users[2], users[3]], "aceptada", true),   // user06 — baja 2
        ...denunciar(posts[10], [users[0], users[1], users[2], users[3]], "aceptada", true),  // user06 — baja 3
    ]);

    console.log("✅ Seed completado con datos de prueba.");
}

seed();