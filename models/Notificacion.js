import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Publicacion } from "./Publicacion.js";
import { Imagen } from "./Imagen.js";
import { Usuario } from "./Usuario.js";
import { Comentario } from "./Comentario.js";
import { Seguidores } from "./Seguidores.js";

export class Notificacion extends Model { }

Notificacion.init(
    {
        id_notificacion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        tipo_evento: {
            type: DataTypes.STRING,
            allowNull: false
        },

        id_usuario_creador: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: "id_usuario"
            }
        },

        id_usuario_destinatario: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: "id_usuario"
            }
        },

        id_img_evento: {
            type: DataTypes.INTEGER,
            references: {
                model: Imagen,
                key: "id_img"
            }
        },

        fecha_notificacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        notificacion_leida: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },

    {
        sequelize,
        modelName: "Notificacion",
        tableName: "notificacion",
    }
)