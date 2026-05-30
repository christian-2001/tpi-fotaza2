import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";
import { Imagen } from "./Imagen.js";
import { Usuario } from "./Usuario.js";

export class Comentario extends Model { }

Comentario.init(
    {
        id_comentario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: "ComentarioUnico"
        },

        fh_comentario: {
            type: DataTypes.DATE,
            unique: "ComentarioUnico"
        },

        cant_likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        texto: {
            type: DataTypes.TEXT
        },

        id_img: {
            type: DataTypes.INTEGER,
            references: {
                model: Imagen,
                key: "id_img"
            }
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: "id_usuario"
            }
        }
    },

    {
        sequelize,
        timestamps: true,
        modelName: "Comentario",
        tableName: "comentario",
        createdAt: "fh_comentario",
        updatedAt: true,
        deletedAt: true,
    }
)