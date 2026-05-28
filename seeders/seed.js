import sequelize from "../db/config.js";
import { Etiqueta } from "../models/Etiqueta.js";
import { Imagen_Etiqueta } from "../models/Imagen_Etiqueta.js";
import { Imagen } from "../models/Imagen.js";
import { Persona } from "../models/Persona.js";
import { Publicacion_Etiqueta } from "../models/Publicacion_Etiqueta.js";
import { Publicacion } from "../models/Publicacion.js";
import { Usuario } from "../models/Usuario.js";
import { Valorizacion } from "../models/Valorizacion.js";

async function seed() {
    await sequelize.sync({ alter: true, force: true})

    //Persona
    const clients = await Persona.bulkCreate([
        //clients[0]
        {
            dni: "43423744",
            tipo_dni: "DNI",
            sexo: "Masculino",
            nombre: "Chris",
            apellido: "Villegas",
            fecha_nacimiento: "2001-01-14"
        },

        //clients[1]
        {
            dni: "12345678",
            tipo_dni: "DNI",
            sexo: "Masculino",
            nombre: "Nicky",
            apellido: "Bastidas",
            fecha_nacimiento: "2001-12-20"
        },

        //clients[2]
        {
            dni: "87654321",
            tipo_dni: "DNI",
            sexo: "Masculino",
            nombre: "Tomi",
            apellido: "Villegas",
            fecha_nacimiento: "2002-08-10"
        },
    ])

    //Usuario
    const users = await Usuario.bulkCreate([
        //users[0]
        { nombre_usuario: "chrisgreen", email: "villegas4000@gmail.com", id_persona: clients[0].id_persona, },
        
        //users[1]
        { nombre_usuario: "flojocosmico", email: "flojito123@gmail.com", id_persona: clients[1].id_persona, },
        
        //users[2]
        { nombre_usuario: "nozye500", email: "marisaosu@gmail.com", id_persona: clients[2].id_persona, },
    ])

    //Publicacion

    const posts = await Publicacion.bulkCreate([
        //⁡⁢⁢⁢posts[0]⁡
        {
            titulo: "Publicacion de chrisgreen",
            descripcion: "No se me ocurre ninguna xdxdxdxd",
            id_usuario: users[0].id_usuario
        },

        //⁡⁢⁢⁣posts[1]⁡
        {
            titulo: "Publicacion de flojocosmico",
            descripcion: "Esta es la descripcion n°123",
            id_usuario: users[1].id_usuario
        },

        //⁡⁣⁣⁡⁣⁢⁣posts[2]⁡
        {
            titulo: "Publicacion de nozye500",
            descripcion: "Hermosa mañana verdad?",
            id_usuario: users[2].id_usuario
        },

        //⁡⁢⁢⁢posts[3]⁡
        {
            titulo: "Otra publicacion de chrisgreen",
            descripcion: "mi segunda publicacion",
            id_usuario: users[0].id_usuario
        },
    ])

    //Etiqueta
    const tags = await Etiqueta.bulkCreate([
        //tags[0]
        { nom_etiqueta: "postGreen" },

        //tags[1]
        { nom_etiqueta: "aguantefotaza" },

        //tags[2]
        { nom_etiqueta: "imgGreen" },

        //tags[3]
        { nom_etiqueta: "postFlojo" },

        //tags[4]        
        { nom_etiqueta: "imgFlojo" },

        //tags[5]        
        { nom_etiqueta: "postNozye" },

        //tags[6]        
        { nom_etiqueta: "imgNozye" },

        //tags[7]
        { nom_etiqueta: "postGreen" },

        //tags[8]
        { nom_etiqueta: "imgGreen2" },

        //tags[9]
        { nom_etiqueta: "imgGreen1Extra" },

        //tags[10]
        { nom_etiqueta: "imgGreen1Extra2" },

        //tags[11]
        { nom_etiqueta: "imgGreen1Extra3" },

        //tags[12]
        { nom_etiqueta: "imgGreen1Extra4" },
    ])

    //Publicacion_Etiqueta
    const postTags = await Publicacion_Etiqueta.bulkCreate([
        //postTags[0]
        { id_post: posts[0].id_post, id_etiqueta: tags[0].id_etiqueta },

        //postTags[1]
        { id_post: posts[0].id_post, id_etiqueta: tags[1].id_etiqueta },

        //postTags[2] 
        { id_post: posts[1].id_post, id_etiqueta: tags[3].id_etiqueta },

        //postTags[3]
        { id_post: posts[2].id_post, id_etiqueta: tags[5].id_etiqueta },

        //psotTags[4]
        { id_post: posts[3].id_post, id_etiqueta: tags[7].id_etiqueta }
    ])

    //Imagen
    const imagesPost = await Imagen.bulkCreate([
        //imagesPost[0]
        {
            nombre_img: "Imagen de chrisgreen",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563529/cld-sample-3.jpg",
            extension: "jpg",
            id_post: posts[0].id_post,
        },

        //imagesPost[1]
        {
            nombre_img: "Imagen de flojocosmico",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563529/cld-sample-4.jpg",
            extension: "png",
            id_post: posts[1].id_post
        },

        //imagesPost[2]
        {
            nombre_img: "Imagen de nozye500",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563529/cld-sample-4.jpg",
            extension: "jpg",
            id_post: posts[2].id_post
        },

        //imagesPost[3]
        {
            nombre_img: "otra imagen de chrisgreen",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563529/cld-sample-4.jpg",
            extension: "jpg",
            id_post: posts[3].id_post
        },
             
        //imagesPost[4]
        {
            nombre_img: "Imagen de chrisgreen EXTRA",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563525/samples/cup-on-a-table.jpg",
            extension: "jpg",
            id_post: posts[0].id_post,
        },

        //imagesPost[5]
        {
            nombre_img: "Imagen de chrisgreen EXTRA 2",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563529/cld-sample-5.jpg",
            extension: "jpg",
            id_post: posts[0].id_post,
        },

         //imagesPost[6]
        {
            nombre_img: "Imagen de chrisgreen EXTRA 3",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563528/cld-sample-2.jpg",
            extension: "jpg",
            id_post: posts[0].id_post,
        },

         //imagesPost[7]
        {
            nombre_img: "Imagen de chrisgreen EXTRA 4",
            img_path: "https://res.cloudinary.com/fotaza2/image/upload/v1778563528/cld-sample-2.jpg",
            extension: "jpg",
            id_post: posts[0].id_post,
        },
    ])

    //Imagen_Etiqueta
    const imagesTags = await Imagen_Etiqueta.bulkCreate([
        //Imagen de chrisgreen
        {
            id_img: imagesPost[0].id_img,
            id_etiqueta: tags[2].id_etiqueta,
        },

        //Imagen de flojocosmico
        {
            id_img: imagesPost[1].id_img,
            id_etiqueta: tags[4].id_etiqueta,
        },

        //Imagen de nozye500
        {
            id_img: imagesPost[2].id_img,
            id_etiqueta: tags[6].id_etiqueta,
        },

        //otra imagen de chrisgreen
        {
            id_img: imagesPost[3].id_img,
            id_etiqueta: tags[8].id_etiqueta,
        },

        //Imagen de chrisgreen EXTRA
        {
            id_img: imagesPost[4].id_img,
            id_etiqueta: tags[9].id_etiqueta,
        },

        //Imagen de chrisgreen EXTRA 2
        {
            id_img: imagesPost[5].id_img,
            id_etiqueta: tags[10].id_etiqueta,
        },

        //Imagen de chrisgreen EXTRA 3
        {
            id_img: imagesPost[6].id_img,
            id_etiqueta: tags[11].id_etiqueta,
        },

        //Imagen de chrisgreen EXTRA 4
        {
            id_img: imagesPost[7].id_img,
            id_etiqueta: tags[12].id_etiqueta,
        },
    ])
}

/*
================================================== URLS para imagenes sueltas en internet(Solo prueba) ================================
imagen de chrisgreen: https://imgs.search.brave.com/JBt6oypOocehhaoOvety6Qm5HgA6qD8PivBYJeX4Mw8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS4yNjAw/OTc3NzcxLjI5Mjcv/cHAsNTA0eDQ5OC1w/YWQsNjAweDYwMCxm/OGY4ZjguanBn
imagen de flojocosmico: https://imgs.search.brave.com/oyPjYBn3Nn3vU6UEb3bPhjQ62s-8jffRePgNUDMcV5o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzVhLzIy/L2E1LzVhMjJhNWY1/NDIyMzVjMTIyN2Fl/OWYxYjNmZTZlNmM1/LmpwZw
imagen de nozye500: https://imgs.search.brave.com/HPf_AXvwLF14C6eteDXChM4AvG-gBLigIrY7PIy8MVE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMubWVtZS1hcnNl/bmFsLmNvbS85MDM4/MDU1ZmRjNzEwOWU0/MWZiZDg5MjU5NjVk/Yzc4NS5qcGc
================================================== URLS para imagenes sueltas en internet(Solo prueba) ================================
*/

seed()