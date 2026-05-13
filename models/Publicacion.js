import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Publicacion extends Model { }

Publicacion.init(
    {
        id_post: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
/*
        fh_publicacion: {
            type: DataTypes.DATE,
            primaryKey: true
        },
*/
        titulo: {
            type: DataTypes.STRING()
        },

        descripcion: {
            type: DataTypes.TEXT
        }
    },
    {
        sequelize,
        modelName: "Publicacion",
        tableName: "publicacion",
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    }
)