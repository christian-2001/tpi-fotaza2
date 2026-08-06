import sequelize from "../db/config.js";
import { Comentario } from "./Comentario.js";
import { Etiqueta } from "./Etiqueta.js";
import { Imagen } from "./Imagen.js";
import { Persona } from "./Persona.js";
import { Publicacion } from "./Publicacion.js";
import { Publicacion_Etiqueta } from "./Publicacion_Etiqueta.js";
import { Usuario } from "./Usuario.js";
import { Valorizacion } from "./Valorizacion.js";
import { Seguidores } from "./Seguidores.js";
import { Imagen_Etiqueta } from "./Imagen_Etiqueta.js";
import { Colección } from "./Colección.js";
import { Favoritos } from "./Favoritos.js";
import { Publicacion_Favoritos } from "./Publicacion_Favoritos.js";
/*
⁡⁢⁢⁢Relacion 1 a 1 con:
    HasOne -> un modelo tiene un elemento de otro modelo
    BelongsTo  -> un modelo le pertenece a otro modelo⁡
*/

/*
⁡⁣⁢⁣Relacion 1 a N con:
    HasMany -> un modelo tiene muchos elementos de otros modelos
    BelongsTo  -> un modelo le pertenece a otro modelo⁡
*/

/*
⁡⁢⁣⁣Relacion N a N con:
    HasMany -> un modelo tiene muchos elementos de otro modelo
    BelongsToMany -> un modelo pertenece a muchos elementos de otro modelo⁡
*/


//-------------------------------------------------------------------------------------
//⁡⁢⁢⁢𝗥𝗲𝗹𝗮𝗰𝗶𝗼𝗻𝗲𝘀 𝟭 𝗮 𝟭⁡


//Usuario.hasOne(Favoritos, { foreignKey: "id_usuario"})
//Favoritos.BelongsTo(Usuario, { foreignKey: "id_usuario"})

Usuario.hasOne(Favoritos)
Favoritos.belongsTo(Usuario)

//⁡⁣⁢⁣𝗥𝗲𝗹𝗮𝗰𝗶𝗼𝗻𝗲𝘀 𝟭 𝗮 𝗡⁡

Usuario.hasMany(Publicacion, { foreignKey: "id_usuario" })
Publicacion.belongsTo(Usuario, { foreignKey: "id_usuario" })

Usuario.hasMany(Colección, { foreignKey: "id_usuario"})
Colección.belongsTo(Usuario, { foreignKey: "id_usuario"})

Persona.hasMany(Usuario, { foreignKey: "id_persona" })
Usuario.belongsTo(Persona, { foreignKey: "id_persona" })

Publicacion.hasMany(Imagen, { foreignKey: "id_post" })
Imagen.belongsTo(Publicacion, { foreignKey: "id_post" })

Imagen.hasMany(Comentario, { foreignKey: "id_img" })
Comentario.belongsTo(Imagen, { foreignKey: "id_img" })

Usuario.hasMany(Comentario, { foreignKey: "id_usuario" })
Comentario.belongsTo(Usuario, { foreignKey: "id_usuario" })

Imagen.hasMany(Valorizacion, { foreignKey: "id_img" })
Valorizacion.belongsTo(Imagen, { foreignKey: "id_img"})

Usuario.hasMany(Valorizacion, { foreignKey: "id_usuario"})
Valorizacion.belongsTo(Usuario, { foreignKey: "id_usuario"})

//⁡⁢⁣⁣𝗥𝗲𝗹𝗮𝗰𝗶𝗼𝗻𝗲𝘀 𝗡 𝗮 𝗡⁡

Publicacion.belongsToMany(Etiqueta, { through: Publicacion_Etiqueta, foreignKey: "id_post", otherKey: "id_etiqueta" })

Publicacion.belongsToMany(Etiqueta, { through: Publicacion_Etiqueta, foreignKey: "id_post", otherKey: "id_etiqueta", as: "Tags" })

Etiqueta.belongsToMany(Publicacion, { through: Publicacion_Etiqueta, foreignKey: 'id_etiqueta', otherKey: 'id_post'})

Publicacion.hasMany(Publicacion_Etiqueta, { foreignKey: "id_post"})
Publicacion_Etiqueta.belongsTo(Publicacion, { foreignKey: "id_post"})

Etiqueta.hasMany(Publicacion_Etiqueta, { foreignKey: "id_etiqueta"})
Publicacion_Etiqueta.belongsTo(Etiqueta, { foreignKey: "id_etiqueta"})

Imagen.belongsToMany(Etiqueta, { through: Imagen_Etiqueta, foreignKey: "id_img", otherKey: "id_etiqueta" })

Etiqueta.belongsToMany(Imagen, { through: Imagen_Etiqueta, foreignKey: "id_etiqueta", otherKey: "id_img" })

Imagen.hasMany(Imagen_Etiqueta, { foreignKey: "id_img"})
Imagen_Etiqueta.belongsTo(Imagen, { foreignKey: "id_img"})

Etiqueta.hasMany(Imagen_Etiqueta, { foreignKey: "id_etiqueta"})
Imagen_Etiqueta.belongsTo(Etiqueta, { foreignKey: "id_etiqueta"})

Seguidores.belongsTo(Usuario, { foreignKey: "id_seguidor", as: "seguidor" })
Seguidores.belongsTo(Usuario, { foreignKey: "id_seguido", as: "seguido" })

Publicacion.belongsToMany(Favoritos, { through: Publicacion_Favoritos, foreignKey: "id_post", otherKey: "id_favoritos" })
Favoritos.belongsToMany(Publicacion, { through: Publicacion_Favoritos, foreignKey: "id_favoritos", otherKey: "id_post" })

Publicacion.hasMany(Publicacion_Favoritos, { foreignKey: "id_post"})
Publicacion_Favoritos.belongsTo(Publicacion, { foreignKey: "id_post"})

Favoritos.hasMany(Publicacion_Favoritos, { foreignKey: "id_favoritos"})
Publicacion_Favoritos.belongsTo(Favoritos, { foreignKey: "id_favoritos"})

/*
Usuario.hasMany(Seguidores, { foreignKey: "id_usuario" })
Seguidores.belongsTo(Usuario, { foreignKey: "id_usuario" })
*/


//-------------------------------------------------------------------------------------


export async function db_conexion() {
    try {
        await sequelize.authenticate()
        console.log("Se conectó a la bd")

        await sequelize.sync({ alter: true })
        console.log("Sincronizacion de los modelos...")
    } catch (error) {
        console.error("Error en la conexion a la base de datos", error)
        throw error
    }
}