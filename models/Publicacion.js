import { Model, DataTypes } from "sequelize"
import sequelize from "../db/config.js";

export class Publicacion extends Model { }

Publicacion.init(
    {
        id_post: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: "PublicacionUnica",
        },

        fh_publicacion: {
            type: DataTypes.DATE,
            unique: "PublicacionUnica",
        },

        titulo: {
            type: DataTypes.STRING()
        },

        descripcion: {
            type: DataTypes.TEXT,
            defaultValue: "Ninguna"
        }
    },
    {
        sequelize,
        timestamps: true,
        modelName: "Publicacion",
        tableName: "publicacion",
        createdAt: "fh_publicacion",
        updatedAt: "fh_edit_publicacion",
        deletedAt: true,
    }
)