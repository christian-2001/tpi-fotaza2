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
    await sequelize.sync({ alter: true });

    // ─────────────────────────────────────────────
    // PERSONA  (4 personas)
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
    ]);

    // ─────────────────────────────────────────────
    // USUARIO  (4 usuarios)
    // Contraseñas en texto plano (para el README):
    //   user00    → User1234
    //   user01    → User1234
    //   user02    → User1234
    //   user03    → User1234
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
    // PUBLICACION  (5 posts)
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
    ]);

    // ─────────────────────────────────────────────
    // IMAGEN  (7 imágenes — Picsum Photos, libres)
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
        { id_img: imgs[2].id_img, id_usuario: users[0].id_usuario, puntaje: 4 },
        { id_img: imgs[2].id_img, id_usuario: users[2].id_usuario, puntaje: 3 },

        // imgs[3] — Flores  (post de users[2])
        { id_img: imgs[3].id_img, id_usuario: users[0].id_usuario, puntaje: 5 },
        { id_img: imgs[3].id_img, id_usuario: users[1].id_usuario, puntaje: 4 },

        // imgs[4] — Mar  (post de users[3])
        { id_img: imgs[4].id_img, id_usuario: users[0].id_usuario, puntaje: 5 },
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

    console.log("✅ Seed completado con datos de prueba.");
}

seed();
