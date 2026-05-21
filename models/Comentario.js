import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

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
            type: DataTypes.INTEGER
        },

        texto: {
            type: DataTypes.TEXT
        },
    },

    {
        sequelize,
        modelName: "Comentario",
        tableName: "comentario",
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }
)